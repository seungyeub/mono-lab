# Playwright CI 브라우저 설치 최적화

> **작성일:** 2026-08-19
> **Title:** Playwright CI — 브라우저 설치 단계 정체 해소 및 캐싱 도입
> **Description:** `Install Playwright Browsers` 단계가 정체되어 VRT 잡이 수십 분간 매달리는 문제를 설치 범위 축소·브라우저 캐싱·타임아웃·재시도 도입으로 해결한다. 정체 지점은 브라우저 CDN이 아니라 `--with-deps`의 apt 다운로드였다.

---

## 1. 문제 (Problem)

`Playwright Tests` 워크플로의 `Install Playwright Browsers` 단계가 정체되어, 테스트 단계에 진입조차 하지 못하고 잡이 매달리는 일이 발생했다.

최근 20회 실행을 전수 확인한 결과 **정체는 총 3회이며 모두 2026-08-19 07~10시 사이에 몰려 있다.**

| 시각        | 정체 시간      | 조치                        |
| ----------- | -------------- | --------------------------- |
| 08-19 07:05 | 37분           | 수동 취소 후 재실행         |
| 08-19 09:00 | 21분           | 수동 취소 후 재실행         |
| 08-19 10:10 | 10분(타임아웃) | 본 문서의 타임아웃이 동작함 |

반면 그 이전 실행에서는 한 번도 정체되지 않았고 소요 시간은 **1분 49초 ~ 6분 7초**였다. 같은 기간의 다른 실패 4건은 이 단계가 아니라 스냅샷 불일치였다.

따라서 이는 **상시적 결함이 아니라 apt 미러의 일시적 장애**로 판단한다. 다만 정상 동작 시에도 테스트 자체는 40초인데 준비 단계가 2~6분을 소비하며, 타임아웃이 없어 일시적 장애 한 번이 37분 손실로 이어지는 구조적 약점은 실재한다.

## 2. 원인 분석 (Root Cause)

현재 워크플로(`.github/workflows/playwright.yml`)의 해당 단계는 다음과 같다.

```yaml
- name: Install Playwright Browsers
  run: |
    cd apps/portfolio
    pnpm exec playwright install --with-deps
```

이 명령은 성격이 다른 두 구간을 순차로 실행한다.

| 구간                    | 내용                                                     | 크기     | 캐시 가능 여부                    |
| ----------------------- | -------------------------------------------------------- | -------- | --------------------------------- |
| ① apt 시스템 라이브러리 | webkit 구동에 필요한 gstreamer·코덱·폰트 등 181개 패키지 | 약 114MB | ❌ OS 레벨이라 `actions/cache` 밖 |
| ② 브라우저 바이너리     | chromium + webkit 빌드                                   | 약 400MB | ✅ `~/.cache/ms-playwright`       |

**정체는 ①에서 발생했다.** 실패 실행의 로그를 확인하면 apt가 "181개 패키지, 114MB를 받겠다"고 선언한 직후 출력이 완전히 멈추고, 타임아웃까지 아무 진전이 없다. 브라우저 CDN(②)이 아니다.

여기에 더해 코드 확인으로 특정한 구조적 취약점은 다음과 같다.

1. **브라우저 바이너리 캐시 부재** — pnpm store와 Turborepo는 `actions/cache`로 캐싱하면서, 정작 가장 무거운 브라우저 다운로드(②, 약 400MB)는 매 실행마다 새로 받는다.
2. **불필요한 브라우저까지 설치** — `playwright.config.ts`의 `projects`는 `Desktop Chrome`(chromium)과 `Mobile Safari` 2종(webkit)뿐이라 **firefox는 한 번도 사용되지 않는데** 인자 없는 `playwright install`이 전체 브라우저를 받는다.
3. **타임아웃 부재** — `timeout-minutes`가 없어 정체되면 GitHub Actions 기본 한도(6시간)까지 매달린다. 실제로 37분·21분을 소진했다.

동일한 단계가 `.github/workflows/update-snapshots.yml`에도 그대로 존재하므로 두 워크플로를 함께 수정한다.

## 3. 개선 방안 (Solution)

1. **설치 범위 축소** — `playwright install --with-deps chromium webkit`으로 실제 사용하는 2종만 설치한다.
2. **브라우저 캐싱** — `~/.cache/ms-playwright`를 `actions/cache`로 캐싱한다. 캐시 키는 **Playwright 해석 버전**에 고정해 버전이 바뀌면 자동으로 새로 받도록 한다(무관한 의존성 변경으로 캐시가 무효화되지 않게 `pnpm-lock.yaml` 해시 대신 버전을 사용).
3. **캐시 적중 시 시스템 의존성만 설치** — 브라우저 바이너리는 캐시에서 복원되지만 OS 라이브러리(apt)는 캐시 대상이 아니므로, 적중 시 `playwright install-deps chromium webkit`만 실행한다.
4. **타임아웃 도입** — 설치 단계에 `timeout-minutes`를 부여해 정체 시 수십 분을 소진하는 대신 조기 실패시킨다.
5. **재시도 도입** — 위 1~4로는 ①(apt) 정체를 막을 수 없다. 캐시가 적중해도 `install-deps`는 apt를 그대로 실행하기 때문이다. 원인이 일시적 미러 장애이므로 **5분 타임아웃(`--kill-after=30s`로 강제 종료 보장) × 최대 3회 시도(첫 시도 포함, 재시도는 최대 2회)**로 흡수한다. 단계 전체에는 `timeout-minutes: 18`을 백스톱으로 둔다.
6. **재시도 전 dpkg 잠금 정리** — PR #49 실제 CI 실행(2026-08-19)에서 `--kill-after`의 `SIGKILL`이 apt-get을 트랜잭션 도중 죽이면서 자식 프로세스가 `/var/lib/dpkg/lock-frontend`를 놓지 못한 채 남는 것을 확인했다(1차 시도가 강제 종료되자 2·3차 시도가 "Could not get lock"으로 즉시 실패). 각 시도 실패 후 `pkill -9 -f 'apt-get|dpkg'`, 잠금 파일 삭제, `dpkg --configure -a`로 정리한 뒤 재시도하도록 보강했다.

> **왜 컨테이너로 가지 않았는가** — `mcr.microsoft.com/playwright` 공식 이미지를 쓰면 ①②가 모두 사라져 정체 원인 자체가 제거된다. 그러나 러너 이미지와 폰트 구성이 달라 **VRT baseline 21장이 전부 무효화될 위험**이 있고, 현재 baseline은 로컬(macOS)에서 생성해 5% 허용치로 CI를 통과시키는 구조라 baseline 생성을 CI로 옮겨야 할 가능성이 크다. 원인이 일시적인 데 비해 변경 범위와 되돌리기 비용이 크므로 이번 범위에서 제외하고 6절 후속 과제로 남긴다.

## 4. 검증 계획 (Verification)

- 캐시 키(`${{ runner.os }}-playwright-${{ steps.playwright-version.outputs.VERSION }}`)는 OS·버전에만 묶여 있어 기본 브랜치나 다른 워크플로가 이미 채워둔 캐시가 첫 실행에 그대로 적중할 수 있다. **캐시 미스를 확실히 재현**하려면 검증 전 해당 키의 기존 캐시를 삭제하거나, 검증용 커밋에서만 임시 접미사(예: `-verify`)를 붙인다.
- 그 상태로 PR 실행 1회차의 `cache-hit` 출력값(`false`여야 함)을 로그에서 확인하고, 브라우저 설치와 VRT가 정상 통과하는지 확인한다.
- 동일 키로 커밋을 추가해 2회차 실행의 `cache-hit`가 `true`인지, 설치 단계 소요 시간이 유의미하게 단축되는지 비교한다.
- 스냅샷 비교 결과가 기존과 동일한지(브라우저 버전 고정으로 렌더링 차이가 없는지) 확인한다.
- 재시도 로직은 정체가 재현될 때만 작동하므로 즉시 검증할 수 없다. 다만 실패 시 로그에 `설치 시도 N/3` 그룹과 경고가 남으므로, 이후 실패 발생 시 그것으로 동작 여부를 판별한다.

## 5. 범위 밖 (Out of Scope)

- VRT 스냅샷 자체의 결정성 개선은 PR #48에서 이미 처리했다(PageLoader 대기, 외부 CDN GIF 캐러셀 마스킹).
- 워크플로 병렬화·샤딩 등 실행 시간 구조 개선은 이번 범위에 포함하지 않는다.

## 6. 후속 과제 (Follow-up)

**Playwright 공식 컨테이너 전환 검토** — Phase 5 P0 완료 후 전용 PR에서 다룬다.

- **기대 효과**: `mcr.microsoft.com/playwright`는 브라우저와 OS 라이브러리를 모두 내장하므로 ①②가 사라진다. 정체 원인이 제거되고, 정상 시에도 2~6분이 걸리던 준비 단계가 없어져 잡 시간이 크게 준다(테스트 자체는 40초). 단, 이미지 태그(예: `v1.61.0-noble`)는 그 시점의 `@playwright/test` 실제 설치 버전(`node -p "require('@playwright/test/package.json').version"`)과 반드시 일치시킨다 — `package.json`은 `^1.61.0`으로 범위 고정이라 lockfile 갱신 시 실제 버전이 태그와 달라질 수 있다.
- **선결 확인 사항**: 컨테이너의 폰트 구성이 `ubuntu-latest` 러너와 달라 텍스트 렌더링이 바뀔 수 있다. 전환 PR에서 **기존 baseline 21장이 5% 허용치 안에서 통과하는지 먼저 실측**해야 한다.
- **통과하지 못할 경우의 파급**: baseline을 컨테이너 환경 기준으로 재생성해야 하며, 그러면 로컬(macOS) `pnpm run test:e2e:update`로는 CI와 일치하는 baseline을 만들 수 없다. `update-snapshots.yml`(이미 존재)로 baseline 생성을 CI에 위임하고 `docs/guides/development-workflow.md`의 관련 지침도 함께 개정해야 한다.
