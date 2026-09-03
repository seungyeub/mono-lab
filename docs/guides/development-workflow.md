# 🧑‍💻 로컬 개발 워크플로우 및 체크리스트 (Pre-push Checklist)

엄격한 GitHub Actions (CI/CD) 파이프라인이 구축되어 있으므로, 코드를 원격 저장소에 Push하기 전에 로컬에서 미리 에러를 잡아내는 습관이 매우 중요합니다. 아래의 가이드를 따라 커밋 전 상태를 점검하세요.

---

## 1. 🟢 필수 체크 (모든 코드 수정 시)

가장 빈번하게 CI를 터뜨리는 주범인 포맷팅(Prettier)과 정적 분석(ESLint/TypeScript) 에러를 방지합니다.

```bash
# 1. 포맷팅 자동 정렬 (CI의 format:check 에러 방지)
pnpm run format

# 2. 린트 및 타입 에러 검사 (경고 하나만 떠도 CI가 터지므로 미리 확인)
pnpm run lint && pnpm run check-types
```

> **💡 꿀팁: 원라이너 커맨드**
> 작업이 끝난 후 프로젝트 **루트(최상위) 디렉토리**에서 아래 커맨드를 한 번만 돌리시면 마음이 편안해집니다.
>
> ```bash
> pnpm run format && pnpm run lint && pnpm run check-types
> ```

---

## 2. 🟡 UI 및 컴포넌트를 수정했을 때 (Playwright Snapshot)

Playwright 시각적 회귀 테스트(Visual Regression Test)가 세팅되어 있습니다. OS 간 렌더링 오차 및 소수점 픽셀 불일치 에러를 방지하기 위해 **전체 페이지 단위(`fullPage: true`)로 한 번에 통짜 캔버스로 촬영**됩니다. 버튼 색상이나 폰트 패딩 등이 조금만 바뀌어도 CI가 기존 스냅샷과 다르다며 에러를 발생시킵니다.

UI 디자인에 변경이 있었다면, 반드시 로컬에서 **새로운 스냅샷(Golden Master)을 촬영하여 기존 파일을 덮어씌워야 합니다.**

```bash
# Playwright 테스트가 설정된 앱 디렉토리로 이동
cd apps/portfolio

# (중요) Playwright는 프로덕션 빌드(pnpm start)를 기준으로 테스트하므로 반드시 먼저 빌드해야 합니다.
pnpm run build

# 기존 스냅샷을 새로운 UI에 맞춰 업데이트 (전체 페이지 스냅샷이 새로 촬영됨)
pnpm run test:e2e:update
```

⚠️ **주의사항:** 스냅샷 업데이트 후 새로 생성되거나 변경된 `-baseline.png` 이미지 파일들도 반드시 `git add`에 포함하여 함께 커밋해야 합니다.

### 2-1. Baseline의 기준 환경은 CI 컨테이너입니다

CI의 VRT는 Playwright 공식 컨테이너(`mcr.microsoft.com/playwright`) 안에서 실행되므로, **PR을 통과시키는 기준은 컨테이너 렌더링**입니다. 대부분의 스냅샷은 macOS 로컬 촬영본이 5% 허용치 안에 들어 그대로 커밋해도 되지만, 텍스트 밀도가 높은 페이지(예: `work-detail`의 Desktop Chrome)는 폰트 렌더링 차이가 허용치를 넘을 수 있습니다.

- **로컬에서 특정 스냅샷만 반복해서 실패**하고 화면상 실제 변경이 없다면, 환경 차이일 가능성이 큽니다. 이때는 로컬에서 덮어쓰지 말고 **`Update Visual Snapshots` 워크플로(Actions → workflow_dispatch, 브랜치 지정)** 를 실행하세요 — 컨테이너에서 재촬영한 baseline이 해당 브랜치에 자동 커밋됩니다. 실행 후 `git pull`로 받아옵니다.
- 반대로 컨테이너 기준 baseline은 macOS 로컬 `playwright test`에서 해당 스냅샷 1~2개가 실패할 수 있습니다. **CI가 통과하면 정상**이며, 로컬 실패를 없애려고 baseline을 로컬 촬영본으로 되돌리면 CI가 깨집니다.

---

## 3. 🔵 핵심 비즈니스 로직(함수 등)을 수정했을 때 (Jest)

핵심 로직이 변경되었다면 단위 테스트가 통과하는지, 그리고 SonarCloud의 테스트 커버리지 기준을 충족하는지 확인해야 합니다.

```bash
# 단위 테스트 수행 및 커버리지 리포트(lcov.info) 업데이트
pnpm run test
```
