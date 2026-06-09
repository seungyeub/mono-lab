# [Goal Description]

PRD 마일스톤의 **Phase 2: 공통 레이아웃 (Header, Footer, Custom Cursor, Lenis 스크롤) 구현** 작업을 진행합니다.
이 단계에서는 사용자가 웹사이트 전반에서 동일하게 경험하게 될 최상위 구조를 잡고, Framer 템플릿 특유의 고급스러운 인터랙션(커스텀 커서, 관성 스크롤) 기반을 마련합니다.

## User Review Required

> [!IMPORTANT]
> **디자인 에셋 및 폰트 설정**
> 기본적으로 Next.js에 내장된 `next/font/google`을 활용하여 모던한 산세리프 폰트(예: Inter 또는 Hanken Grotesk)를 전역에 적용할 예정입니다. 만약 원하시는 특정 폰트가 있다면 말씀해 주세요.

## Open Questions

> [!NOTE]
>
> 1. **커스텀 커서(Custom Cursor) 디자인:** 기본 커서 대신 동그란 원형 커서를 마우스 위치에 따라 따라다니게 만들고, 링크(a 태그)나 버튼 호버 시 커서 크기가 커지거나 색상이 변하도록 설계할 예정입니다. 혹시 생각하시는 특별한 커서 애니메이션이 있으신가요?
> 2. **Header 스크롤 반응:** 스크롤을 아래로 내릴 때는 Header가 위로 숨고, 위로 올릴 때 다시 나타나는(Hide on scroll down) 방식을 적용할까요, 아니면 항상 상단에 고정(Sticky)시킬까요? (Framer 템플릿들은 주로 Hide on scroll 방식을 씁니다.)

## Proposed Changes

### 1. 상태 관리 (Zustand) 셋업

- **[NEW]** `apps/portfolio/src/store/useCursorStore.ts`: 커스텀 커서의 상태(`default`, `pointer` 등 호버 상태)를 전역으로 관리하는 Zustand 스토어 생성.

### 2. 레이아웃 기능 컴포넌트 생성 (`features/layout`)

- **[NEW]** `apps/portfolio/src/features/layout/SmoothScroll.tsx`: `@studio-freight/lenis`를 활용하여 `children`을 감싸는 전역 관성 스크롤 Provider 컴포넌트.
- **[NEW]** `apps/portfolio/src/features/layout/CustomCursor.tsx`: `framer-motion`과 `useCursorStore`를 사용하여 마우스 좌표를 추적하는 전역 커서 컴포넌트.
- **[NEW]** `apps/portfolio/src/features/layout/Header.tsx`: 네비게이션(Work, About, Contact) 링킹이 포함된 헤더.
- **[NEW]** `apps/portfolio/src/features/layout/Footer.tsx`: 사이트 하단 카피라이트 및 소셜 링크.

### 3. 최상위 Layout 및 스타일 개편

- **[MODIFY]** `apps/portfolio/src/app/globals.css`: 기본 커서 숨김 처리(`cursor: none`) 및 Tailwind 기본 스타일 정리.
- **[MODIFY]** `apps/portfolio/src/app/layout.tsx`: `SmoothScroll`, `CustomCursor`, `Header`, `Footer` 컴포넌트를 통합하여 최상위 레이아웃 구성.

## Verification Plan

### Automated Tests

- `pnpm lint` 및 `pnpm check-types` 실행 시 에러가 없는지 확인.

### Manual Verification

- 터미널에서 `pnpm run dev` 실행 후:
  1.  마우스를 움직일 때 기본 커서가 보이지 않고, 커스텀 원형 커서가 부드럽게 따라오는지 확인.
  2.  페이지를 위아래로 스크롤할 때 일반 브라우저 스크롤이 아닌, 묵직하고 부드러운 Lenis 관성 스크롤이 적용되었는지 확인.
  3.  Header와 Footer가 올바른 위치에 렌더링되는지 확인.
