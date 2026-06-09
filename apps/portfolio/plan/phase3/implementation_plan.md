# [Goal Description]

PRD 마일스톤의 **Phase 3: 랜딩 페이지(Home) 주요 섹션 및 애니메이션 적용** 작업을 진행합니다.
이 단계에서는 Rootwise Architects 템플릿의 핵심인 미니멀한 디자인과 우아한 스크롤 애니메이션을 갖춘 홈 화면(`app/page.tsx`)을 완성합니다. 기능을 논리적으로 분리하기 위해 각 섹션을 `features/home` 디렉토리에 컴포넌트화하여 작업합니다.

## User Review Required

> [!IMPORTANT]
> **모바일 최적화 (Responsive Design)**
> 모든 애니메이션과 레이아웃은 모바일(태블릿/스마트폰) 환경에서도 어색하지 않게 작동하도록 분기 처리(`framer-motion`의 viewport 설정 등)가 들어갑니다. 모바일 환경에서의 텍스트 크기나 여백 등 세밀한 조정에 대한 의견이 있다면 알려주세요.

## Open Questions

> [!NOTE]
>
> 1. **Featured Works (대표 포트폴리오) 데이터:** 현재 백엔드/MDX 연결(Phase 4) 전입니다. 홈 화면에 노출될 임시 목업(Mock) 데이터의 이미지 자리에는 어떤 것을 사용할까요? (예: `unsplash` 무작위 건축/디자인 사진 URL 사용, 혹은 단순 색상 블록)
> 2. **Hero Section 텍스트:** 홈페이지 진입 시 가장 먼저 보이는 거대한 타이포그래피(예: "Designing the future of architecture") 문구는 어떤 텍스트를 임시로 넣어둘까요? 원본 템플릿의 느낌을 살린 더미 텍스트를 사용할까요?

## Proposed Changes

### 1. 홈 전용 기능 컴포넌트 생성 (`features/home/`)

- **[NEW]** `HeroSection.tsx`: 사이트 진입 시 보이는 메인 타이포그래피 영역. 스크롤을 내릴 때 텍스트가 위로 부드럽게 사라지는(Fade out + Translate Y) 패럴랙스 효과 적용.
- **[NEW]** `FeaturedWorks.tsx`: 대표 프로젝트 썸네일 리스트. 스크롤이 해당 영역에 도달했을 때 아이템들이 아래에서 위로 차례대로 나타나는(Staggered Fade In Up) 애니메이션 적용. 호버 시 썸네일 스케일 업(Zoom) 효과 포함.
- **[NEW]** `ServicesSection.tsx` & `TestimonialSection.tsx`: 에이전시의 주요 서비스 내용과 고객 후기가 무한 롤링되거나 스크롤에 맞춰 등장하는 섹션.

### 2. 홈 페이지 통합 (`app/page.tsx`)

- **[MODIFY]** `apps/portfolio/app/page.tsx`: 이전 Phase 2에서 만든 임시 테스트 코드를 삭제하고, 위에서 만든 `HeroSection`, `FeaturedWorks`, `ServicesSection`, `TestimonialSection` 컴포넌트들을 순서대로 배치합니다.

## Verification Plan

### Automated Tests

- `pnpm lint` 및 `pnpm check-types` 실행 시 에러가 없는지 확인.

### Manual Verification

- `pnpm run dev` 실행 후 홈 화면(`localhost:3000`)에 접속하여:
  1.  최초 로딩 시 Hero 텍스트가 자연스럽게 렌더링되는지 확인.
  2.  스크롤을 내릴 때 Hero 텍스트가 패럴랙스로 밀리며 사라지는지 확인.
  3.  Featured Works 섹션 도달 시 썸네일들이 순차적으로 나타나는 애니메이션 확인.
  4.  프로젝트 썸네일에 마우스를 올렸을 때 사진이 살짝 확대되는 호버 액션 확인.
