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

Playwright 시각적 회귀 테스트(Visual Regression Test)가 세팅되어 있기 때문에, **버튼 색상이나 여백(Margin/Padding) 하나만 바뀌어도 CI가 기존 스냅샷과 다르다며 에러를 발생**시킵니다.

UI 디자인에 변경이 있었다면, 반드시 로컬에서 **새로운 스냅샷(Golden Master)을 촬영하여 기존 파일을 덮어씌워야 합니다.**

```bash
# Playwright 테스트가 설정된 앱 디렉토리로 이동
cd apps/portfolio

# (중요) Playwright는 프로덕션 빌드(pnpm start)를 기준으로 테스트하므로 반드시 먼저 빌드해야 합니다.
pnpm run build

# 기존 스냅샷을 새로운 UI에 맞춰 업데이트
pnpm run test:e2e:update
```

⚠️ **주의사항:** 스냅샷 업데이트 후 새로 생성되거나 변경된 `.png` 이미지 파일들도 반드시 `git add`에 포함하여 함께 커밋해야 합니다.

---

## 3. 🔵 핵심 비즈니스 로직(함수 등)을 수정했을 때 (Jest)

핵심 로직이 변경되었다면 단위 테스트가 통과하는지, 그리고 SonarCloud의 테스트 커버리지 기준을 충족하는지 확인해야 합니다.

```bash
# 단위 테스트 수행 및 커버리지 리포트(lcov.info) 업데이트
pnpm run test
```
