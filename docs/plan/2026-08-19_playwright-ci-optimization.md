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

당초에는 이를 **일시적 장애**로 판단해 재시도로 흡수하려 했으나, **이후 실측에서 이 판단이 뒤집혔다**(3-1절 참고). 정상 동작 시에도 테스트 자체는 40초인데 준비 단계가 2~6분을 소비하며, 타임아웃이 없어 장애 한 번이 37분 손실로 이어지는 구조적 약점도 함께 확인됐다.

### 1-1. 재시도로 해결되지 않음이 확인됨 (2026-08-19 14:47 UTC)

재시도·dpkg 잠금 정리를 적용한 뒤 실행에서 **3회 시도가 모두 5분 타임아웃에 걸려 총 15분 45초 만에 실패**했다. 로그가 보여준 사실:

- **재시도 로직 자체는 정상 작동했다** — 3회가 실제로 실행됐고 `Could not get lock` 오류는 발생하지 않았다(dpkg 정리가 제 역할을 함).
- **apt 미러가 초저속이었다** — 1회차에서 `fonts-ipafont-gothic`(3.5MB) 다음 패키지를 받는 데 **4분 39초**가 걸렸다. 2·3회차도 같은 지점에서 멈췄고, 재시도 시작 시점의 잔여량은 `111 MB/114 MB` — 즉 **15분 동안 3MB만 받았다.**
- **장애가 07~10시 창에 국한되지 않았다** — 14:47에도 재발했고 15분 내내 지속됐다. "일시적 blip"이라는 전제가 성립하지 않는다.
- 반면 브라우저 캐시는 정상 적중했다(`Cache restored from key: Linux-playwright-1.61.0`, 355MB). **남은 병목은 apt 하나뿐**이었다.

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

### 3-1. 방향 전환 — 컨테이너 채택 (2026-08-19)

위 1~6은 브라우저 다운로드(②)를 없애고 손실 시간을 줄였지만, **정체의 실제 원인인 apt(①)를 제거하지 못한다.** 1-1절 실측으로 재시도가 무력함이 확인되어 방향을 바꾼다.

7. **Playwright 공식 컨테이너에서 실행** — `mcr.microsoft.com/playwright:v1.61.0-noble`. 브라우저와 OS 라이브러리가 모두 내장되어 **①②가 함께 사라진다.** 이에 따라 브라우저 캐시·설치·재시도 단계 전체를 제거한다.
   - 이미지 태그는 `@playwright/test` 실제 설치 버전과 일치해야 한다. `package.json`이 `^1.61.0` 범위 지정이라 lockfile 갱신 시 어긋날 수 있으므로, 버전과 내장 브라우저 목록을 로그로 남겨 불일치 시 즉시 원인을 알 수 있게 한다.
   - `update-snapshots.yml`도 **반드시 동일한 이미지**를 쓴다. baseline을 촬영하는 환경과 검증하는 환경이 다르면 스냅샷이 영구히 어긋난다.

> **남은 위험 — VRT baseline** — 컨테이너의 폰트 구성이 러너와 달라 텍스트 렌더링이 바뀔 수 있다. 현재 baseline은 로컬(macOS)에서 생성해 5% 허용치로 통과시키는 구조라 여유가 크지 않다. 다만 실패 로그에서 러너의 한글 렌더링이 `install-deps`가 설치하는 CJK 폰트(`fonts-ipafont-gothic` 등)에 의존함을 확인했고, 공식 이미지는 같은 의존성을 미리 구워둔 것이라 구성이 유사할 가능성이 높다. **확답은 실측으로만 가능하므로 4절 검증 계획에서 확인한다.**

## 4. 검증 계획 (Verification)

컨테이너 전환(3-1절) 기준으로 다음을 확인한다.

1. **apt·브라우저 다운로드가 사라졌는지** — 잡 로그에 `Install Playwright Browsers` 단계가 없고, `Log Playwright version and bundled browsers` 단계가 `chromium-*`·`webkit-*` 디렉토리를 출력하는지 확인한다.
2. **버전 일치** — 위 단계가 출력한 `@playwright/test` 버전이 이미지 태그(`v1.61.0-noble`)와 같은지 확인한다. 어긋나면 테스트가 `Executable doesn't exist`로 실패한다.
3. **기존 baseline 21장이 그대로 통과하는지** — 이것이 이번 전환의 핵심 관문이다. 통과하면 baseline 재생성이 불필요하다.
4. **실패할 경우의 대응** — 실패한 스냅샷의 diff 이미지를 아티팩트에서 내려받아 원인이 폰트 렌더링인지 확인한다. 폰트 차이가 맞다면 `update-snapshots.yml`(동일 컨테이너)을 `workflow_dispatch`로 실행해 baseline을 CI에서 재생성·커밋하고, 이후에는 로컬 `pnpm run test:e2e:update` 대신 이 워크플로를 쓰도록 `docs/guides/development-workflow.md`를 개정한다.
5. **소요 시간** — 준비 단계가 사라진 만큼 잡 전체 시간이 줄었는지 이전 실행(2분 33초 ~ 7분)과 비교한다.

## 5. 범위 밖 (Out of Scope)

- VRT 스냅샷 자체의 결정성 개선은 PR #48에서 이미 처리했다(PageLoader 대기, 외부 CDN GIF 캐러셀 마스킹).
- 워크플로 병렬화·샤딩 등 실행 시간 구조 개선은 이번 범위에 포함하지 않는다.

## 6. 후속 과제 (Follow-up)

- **Playwright 버전 업그레이드 시 이미지 태그 동기화** — `package.json`이 `^1.61.0` 범위 지정이라 lockfile 갱신만으로 실제 설치 버전이 올라갈 수 있다. 그때 두 워크플로의 `container.image` 태그를 함께 올려야 하며, 잊으면 테스트가 `Executable doesn't exist`로 실패한다. 3절의 로그 단계가 이 불일치를 즉시 드러내도록 되어 있다.
- **baseline 생성 환경 일원화** — 4절 검증에서 기존 baseline이 통과하지 못하면, baseline 생성을 `update-snapshots.yml`(CI)로 옮기고 `docs/guides/development-workflow.md`의 "로컬에서 `test:e2e:update` 실행" 지침을 개정한다.
