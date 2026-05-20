# Phase 2: 레이아웃 및 스크롤/커서 세팅 완료 🎉

`mono-lab/apps/portfolio` 프로젝트에 **Rootwise Architects** 특유의 부드러운 인터랙션을 위한 기반 공사를 완료했습니다.

## 📌 주요 구현 내역

### 1. 전역 상태 및 애니메이션
*   **Zustand Store (`useCursorStore.ts`)**: 마우스 호버 상태(`default`, `pointer`)를 전역적으로 관리할 수 있도록 세팅했습니다.
*   **Custom Cursor (`CustomCursor.tsx`)**: 기본 마우스 커서를 숨기고, `framer-motion`을 사용하여 부드럽게 마우스를 따라다니는 원형 커서를 구현했습니다. 배경색과 대비를 이루도록 `mix-blend-mode: difference`를 적용했습니다.

### 2. 관성 스크롤
*   **Lenis (`SmoothScroll.tsx`)**: 기본 브라우저 스크롤의 딱딱함을 없애고, 물리 법칙 기반의 묵직하고 유려한 스크롤 경험을 제공하기 위해 전역 Provider를 추가했습니다.

### 3. 공통 레이아웃 컴포넌트
*   **Header (`Header.tsx`)**: 스크롤을 아래로 내릴 때는 매끄럽게 위로 숨고, 위로 올릴 때 다시 나타나도록 `framer-motion`의 `useScroll` 훅을 사용해 구현했습니다.
*   **Footer (`Footer.tsx`)**: 레퍼런스의 연락처 정보 및 소셜 링크 섹션을 구현했습니다.

### 4. 통합 테스트 페이지
*   **`layout.tsx` & `globals.css`**: 다크 모드(`bg-[#0a0a0a]`) 배경과 폰트를 전역 세팅하고, 모든 기능을 통합했습니다.
