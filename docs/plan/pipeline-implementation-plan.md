# 인프라 및 파이프라인 구축 실행 계획서 (Implementation Plan)

> **작성일:** 2026-06-19
> **Title:** 인프라 및 파이프라인 구축 실행 계획
> **Description:** 단일 저장소 환경의 Branch Protection, Lighthouse CI, Vercel 배포 등 필수 CI/CD 인프라 구축 세부 액션 플랜.

## 개요

이 문서는 `docs/dev-logs/infrastructure-and-testing-strategy.md`의 고찰을 바탕으로 실제 모노레포(`mono-lab`) 환경에 인프라와 CI/CD 파이프라인을 구축하기 위한 구체적인 액션 플랜입니다. 한 번에 모든 것을 완벽하게 세팅하기보다는, 현재 프로젝트 단계에 가장 필요한 **안전망(Branch Protection, Lighthouse, Visual Snapshot)**을 최우선으로 구축합니다.

---

## 1. Branch Protection 및 PR 워크플로우 세팅

> **목표:** Upstream이 없는 단일 저장소 환경에서 실무와 유사한 브랜치 보호 및 PR 강제화.

- [ ] GitHub Repository Settings > Branches 이동하여 `master` 및 `develop` 브랜치 룰(Rule) 생성.
- [ ] `Require a pull request before merging` 활성화 (직접 Push 원천 차단).
- [ ] `Require status checks to pass before merging` 활성화.
- [ ] 필수 Status Checks 목록에 기존 `ci.yml`의 주요 Job(예: `build`, `lint`, `test`) 등록.
- [ ] 작업 시 `feature/*` 브랜치 사용 및 Draft PR 수동 생성 원칙 수립.

## 2. Lighthouse CI 구축 (성능 하한선 방어막)

> **목표:** PR이 생성될 때마다 성능 및 접근성 지표를 자동 검사하여 품질 하락을 방지.

- [ ] `.github/workflows/ci.yml` 내에(또는 `lighthouse.yml`로 분리하여) Lighthouse CI Job 추가.
- [ ] `@lhci/cli` 패키지 설치 및 `.lighthouserc.cjs` 설정 파일 세팅.
- [ ] 검사 임계점(Baseline) 설정:
  - 성능(Performance): 70점 이상 (3D 애니메이션 등을 고려하여 초기엔 낮게 설정 후 상향)
  - 접근성(Accessibility): 90점 이상
  - SEO / Best Practices: 90점 이상
- [ ] CI Fail 시 병합을 차단하도록 설정.

## 3. Visual Snapshot Testing 기반 구축 (Playwright)

> **목표:** UI 변경 시 일일이 테스트 코드를 고치지 않도록, 기준점 캡처 및 자동 픽셀 검증 환경 구성.

### 3.1. 패키지 설치 및 환경 세팅

- [ ] `apps/portfolio` 내에 Playwright 의존성 설치 (`@playwright/test`).
- [ ] `apps/portfolio/playwright.config.ts` 생성:
  - `webServer` 설정: 테스트 실행 전 로컬 서버(`localhost:3000`)를 자동으로 띄우고 대기.
  - **애니메이션 비활성화:** `use: { animations: 'disabled' }` 옵션을 추가하여 Flaky 테스트 원천 차단.
  - **OS 픽셀 오차 보정:** `expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.05 } }` (약 5% 오차 허용) 설정 추가.

### 3.2. 스냅샷 스크립트 작성 및 1차 기준점 생성

- [ ] `apps/portfolio/e2e/snapshot.spec.ts` 파일 생성.
- [ ] Home, Work 등 핵심 페이지로 이동하여 `expect(page).toHaveScreenshot()`을 호출하는 기초 코드 작성.
- [ ] `apps/portfolio/package.json`에 업데이트 명령어 추가: `"test:e2e:update": "playwright test --update-snapshots"`
- [ ] 로컬에서 업데이트 명령어를 실행하여 첫 기준점(Golden Master) 이미지를 생성하고 Git에 커밋.

### 3.3. GitHub Actions CI 파이프라인 통합

- [ ] 별도 `.github/workflows/playwright.yml` 파일 생성 및 Playwright 테스트 Step 추가.
- [ ] CI 실행 환경 내 브라우저 바이너리 설치 로직 추가 (`npx playwright install --with-deps`).
- [ ] 테스트 실패 시, 실패한 이미지와 Diff(차이점) 이미지를 GitHub Artifacts로 자동 업로드하도록 설정하여 리뷰어가 PR에서 바로 확인할 수 있도록 구성.

## 4. CI 환경 최적화 (Turborepo & 패키지 매니저 캐싱)

> **목표:** CI 파이프라인(Lighthouse, Playwright 등)이 추가되면서 늘어나는 빌드/테스트 시간을 최소화.

- [ ] `ci.yml`의 Node.js 세팅 스텝에서 pnpm 전역 캐시 활성화.
- [ ] Turborepo 동작 시 변경되지 않은 캐시를 활용하도록 `actions/cache`를 활용하여 `.turbo` 디렉토리 캐싱 설정 추가.

---

## 5. 최종 의사결정 사항 (Final Decisions)

사용자와의 논의를 통해 다음 세 가지 핵심 방향성이 확정되었습니다.

1. **Lighthouse 피드백:** CI 통과 여부만 확인하는 것이 아니라, GitHub Actions가 **PR의 댓글(Comment)로 점수 리포트를 표 형태로 자동 작성**하도록 구성하여 리뷰 경험을 극대화합니다.
2. **CI 파이프라인 분리:** 관리 편의성과 병렬 실행(속도 최적화)을 위해 기존 `ci.yml`에 모두 몰아넣지 않고, **`lighthouse.yml`, `playwright.yml` 등 목적에 맞게 파일을 쪼개어(Split)** 구성합니다.
3. **OS 간 픽셀 오차:** 초기 개발 속도(DX)를 위해 Docker 컨테이너를 도입하지 않고, Playwright 설정에서 **5% 허용치 조절(`maxDiffPixelRatio: 0.05`) 방식**을 채택합니다.
4. **해상도 검증 전략:** Playwright는 데스크톱과 모바일 표준(390px) 및 최소 너비(375px)를 동시 검증하고, Lighthouse는 모바일 우선 색인(Mobile-first)에 맞춰 모바일 환경 기준으로 검사합니다.

## 6. 실제 구축 실행 단계 (Execution Steps)

위 결정을 바탕으로 다음 순서에 따라 코드를 실제 구축합니다. 에러를 방지하기 위해 한 번에 하나씩 세세하게 진행 및 검증합니다.

- [ ] **Step 1:** `docs/plan/pipeline-implementation-plan.md` 내용 확정 (현재 완료)
- [ ] **Step 2:** Lighthouse CI 세팅 (`.lighthouserc.cjs` 작성 및 `.github/workflows/lighthouse.yml` 구축)
- [ ] **Step 3:** Playwright 기반 구축 (`playwright.config.ts` 및 `.github/workflows/playwright.yml` 구축, 스냅샷 업데이트 스크립트 작성)
- [ ] **Step 4:** GitHub Repository 설정 내 Branch Protection (`master` 및 `develop` 브랜치) Ruleset 수동 구축
  - [ ] **Settings > Branches > Add branch ruleset** 클릭 및 적용
  - [ ] **Target branches:** `Include by pattern`으로 `master`와 `develop` 두 개 브랜치 동시 등록
  - [ ] **Rules:** `Require a pull request before merging` 체크 (직접 Push 원천 차단)
  - [ ] **Rules:** `Require status checks to pass` 옵션은 **최초 생성 시 일단 체크 해제** (아직 CI가 실행된 적이 없어 목록이 비어있으면 GitHub 정책상 Ruleset 저장이 불가능하기 때문)
  - [ ] **Bypass list:** 기본 등록된 `Repository admin` 등의 예외 권한을 전부 삭제하여, 관리자 본인조차도 무조건 PR과 CI를 거치도록 완벽한 실무 환경 강제
  - [ ] ⚠️ **(Pending Task)** 첫 번째 PR을 올리고 CI가 백그라운드에서 1회 이상 실행된 직후, 잊지 말고 다시 이 Ruleset 설정 화면으로 돌아와서 **`Require status checks to pass` 체크박스를 켜고** 목록에 나타나는 CI Job 이름들을 명시적으로 추가 등록할 것!
