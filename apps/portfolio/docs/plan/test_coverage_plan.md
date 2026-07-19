# Test Coverage Plan

현재 프로젝트 내 `.test.tsx` 파일을 분석한 결과, 12개의 파일에 대해서만 테스트 코드가 작성되어 있으며, 나머지 **44개**의 주요 파일 및 컴포넌트에 대한 테스트 코드가 누락되어 있습니다. 안정적인 서비스 운영을 위해 아래와 같이 단계별 테스트 코드 작성 계획을 수립합니다.

## 1. 테스트 누락 파일 분석 (총 44개)

### 🧩 1-1. 코어 레이아웃 & 글로벌 상태 (최우선 순위)

애플리케이션 전반에 걸쳐 렌더링되며 사용자 경험에 직결되는 핵심 컴포넌트 및 상태입니다.

- `features/layout/Header.tsx`
- `features/layout/Footer.tsx`
- `features/layout/CustomCursor.tsx`
- `features/layout/SmoothScroll.tsx`
- `components/PageLoader.tsx`
- `store/useCursorStore.ts`

### 📦 1-2. 공통 UI 컴포넌트

여러 섹션에서 재사용되는 빈도가 높은 UI 요소들입니다.

- `components/RollingText/RollingButton.tsx`
- `components/RollingText/RollingLink.tsx`
- `components/ScrollRevealText.tsx`
- `components/SectionLabel.tsx`
- `components/TagBar.tsx`

### 🏠 1-3. 주요 페이지 피처 (Feature)

홈 화면과 연락처 화면 등 메인 뷰를 구성하는 덩치가 큰 섹션 컴포넌트들입니다.

- `features/home/HeroSection.tsx`
- `features/home/ServicesSection.tsx`
- `features/work/WorkGrid.tsx`
- `features/contact/ContactForm.tsx`

### 🎮 1-4. 3D & WebGL 컴포넌트

단순 UI가 아닌 Three.js 및 Framer Motion 기반의 복잡한 인터랙티브 컴포넌트들로, 테스트 작성이 가장 까다로운 영역입니다.

- `components/FooterLiquidSphere.tsx`
- `components/FooterPhysicsStage.tsx`
- `components/FooterDistortionMarquee.tsx`
- `features/home/components/InteractiveCardCanvas.tsx`
- 그 외 `Footer...` 로 시작하는 다수의 실험적 컴포넌트들

### 🛠 1-5. 유틸 및 데이터 패칭 로직

- `lib/actions.ts`
- `lib/mdx.ts`
- `features/home/skillsData.ts`

---

## 2. 단계별(Phased) 실행 계획

### 📍 Phase 1: 기반 다지기 (코어 로직 & 공통 UI)

가장 작고 재사용성이 높은 유닛(Unit)부터 테스트를 작성합니다.

1. `useCursorStore.ts` (Zustand 상태 관리) 로직 테스트
2. `lib/actions.ts`, `lib/mdx.ts` 유틸 함수 유닛 테스트
3. `TagBar`, `SectionLabel`, `RollingButton` 등 입력과 출력이 명확한 공통 컴포넌트 스냅샷 및 렌더링 테스트

### 📍 Phase 2: 통합 레이아웃 & 폼 로직 검증

1. `Header.tsx`, `Footer.tsx` 등의 글로벌 레이아웃 컴포넌트 렌더링 테스트
2. `ContactForm.tsx` 의 폼 입력, 유효성 검사, 제출 상태에 대한 통합 테스트
3. 메인 홈 화면의 `HeroSection`, `ServicesSection` 구성요소 렌더링 테스트

### 📍 Phase 3: 인터랙티브 & 3D (선택적 진행 권장)

3D 캔버스(`@react-three/fiber`)와 복잡한 애니메이션(`framer-motion`)의 경우, 테스트 비용 대비 효율이 떨어질 수 있습니다.

1. `InteractiveCardCanvas`, `FooterLiquidSphere` 등은 내부 3D 객체가 렌더링(Mount) 되는지 여부만 체크하는 최소한의 Smoke Test 위주로 구성합니다.
2. `framer-motion`은 Mocking하여 애니메이션 자체보다는 비즈니스 로직(클릭, 상태 변화)을 중점적으로 검증합니다.
