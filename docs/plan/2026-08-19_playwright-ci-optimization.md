# Playwright CI 브라우저 설치 최적화

> **작성일:** 2026-08-19
> **Title:** Playwright CI — 브라우저 설치 단계 정체 해소 및 캐싱 도입
> **Description:** `Install Playwright Browsers` 단계가 반복적으로 정체되어 VRT 잡이 수십 분간 매달리는 문제를 브라우저 캐싱·설치 범위 축소·타임아웃 도입으로 해결한다.

---

## 1. 문제 (Problem)

PR #48 진행 중 `Playwright Tests` 워크플로의 `Install Playwright Browsers` 단계가 **최근 3회 실행 중 2회 정체**되어, 테스트 단계에 진입조차 하지 못하고 잡이 매달렸다.

| 실행                    | 정체 시간 | 조치                |
| ----------------------- | --------- | ------------------- |
| PR #48 (1차)            | 37분      | 수동 취소 후 재실행 |
| PR #48 (백로그 커밋 후) | 21분      | 수동 취소 후 재실행 |

재실행만으로 해소된 것으로 보아 코드 문제가 아니라 **다운로드 정체(브라우저 CDN 또는 apt 미러)**로 판단된다. 두 경우 모두 정상 소요 시간(약 4~7분)을 크게 벗어났다.

## 2. 원인 분석 (Root Cause)

현재 워크플로(`.github/workflows/playwright.yml`)의 해당 단계는 다음과 같다.

```yaml
- name: Install Playwright Browsers
  run: |
    cd apps/portfolio
    pnpm exec playwright install --with-deps
```

구조적 취약점 3가지를 코드 확인으로 특정했다.

1. **브라우저 바이너리 캐시 부재** — pnpm store와 Turborepo는 `actions/cache`로 캐싱하면서, 정작 가장 무거운 브라우저 다운로드(약 400MB)는 매 실행마다 새로 받는다.
2. **불필요한 브라우저까지 설치** — `playwright.config.ts`의 `projects`는 `Desktop Chrome`(chromium)과 `Mobile Safari` 2종(webkit)뿐이라 **firefox는 한 번도 사용되지 않는데** 인자 없는 `playwright install`이 전체 브라우저를 받는다.
3. **타임아웃 부재** — `timeout-minutes`가 없어 다운로드가 정체되면 GitHub Actions 기본 한도(6시간)까지 매달린다. 실제로 37분·21분을 소진했다.

동일한 단계가 `.github/workflows/update-snapshots.yml`에도 그대로 존재하므로 두 워크플로를 함께 수정한다.

## 3. 개선 방안 (Solution)

1. **설치 범위 축소** — `playwright install --with-deps chromium webkit`으로 실제 사용하는 2종만 설치한다.
2. **브라우저 캐싱** — `~/.cache/ms-playwright`를 `actions/cache`로 캐싱한다. 캐시 키는 **Playwright 해석 버전**에 고정해 버전이 바뀌면 자동으로 새로 받도록 한다(무관한 의존성 변경으로 캐시가 무효화되지 않게 `pnpm-lock.yaml` 해시 대신 버전을 사용).
3. **캐시 적중 시 시스템 의존성만 설치** — 브라우저 바이너리는 캐시에서 복원되지만 OS 라이브러리(apt)는 캐시 대상이 아니므로, 적중 시 `playwright install-deps chromium webkit`만 실행한다.
4. **타임아웃 도입** — 설치 단계에 `timeout-minutes`를 부여해 정체 시 수십 분을 소진하는 대신 조기 실패시키고 재실행으로 넘어가게 한다.

## 4. 검증 계획 (Verification)

- PR 생성 후 **캐시 미스** 실행에서 브라우저 설치가 정상 완료되고 VRT가 통과하는지 확인한다.
- 동일 PR에 커밋을 추가해 **캐시 적중** 실행의 설치 단계 소요 시간이 유의미하게 단축되는지 비교한다.
- 스냅샷 비교 결과가 기존과 동일한지(브라우저 버전 고정으로 렌더링 차이가 없는지) 확인한다.

## 5. 범위 밖 (Out of Scope)

- VRT 스냅샷 자체의 결정성 개선은 PR #48에서 이미 처리했다(PageLoader 대기, 외부 CDN GIF 캐러셀 마스킹).
- 워크플로 병렬화·샤딩 등 실행 시간 구조 개선은 이번 범위에 포함하지 않는다.
