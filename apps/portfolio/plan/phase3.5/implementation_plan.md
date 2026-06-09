# [Goal Description]

PRD의 레퍼런스 링크가 `designbyhelios.framer.website` (Helios의 메인 포트폴리오)로 변경됨에 따라, **Phase 3.5: 기존 홈 화면 및 레이아웃을 Helios 레퍼런스에 맞게 전면 수정**하는 작업을 진행합니다.
기존에 Rootwise Architects(건축 사무소) 테마로 맞춰져 있던 텍스트와 레이아웃 구조를, Helios(브랜드/로고 디자이너) 테마에 맞게 텍스트, 구성, 애니메이션을 재조정합니다. 이 작업을 마친 후 Phase 4(MDX 연동)로 넘어가야 맥락이 정확히 이어집니다.

## User Review Required

> [!IMPORTANT]
> **Helios 레퍼런스 주요 변경점**
>
> 1. 건축(Architecture) → 브랜드 디자인(Brand Design)으로 테마 변경.
> 2. Hero 문구가 "5+ years™ of brand identity work..." 등의 텍스트로 변경됨.
> 3. Header 로고 이름 변경 (예: ROOTWISE → HELIOS 또는 본인 이름).

## Open Questions

> [!NOTE]
>
> 1. **Header 로고 텍스트:** 기존 `ROOTWISE`라고 적혀있던 좌측 상단 로고 자리에 본인의 이름이나 원하는 텍스트(예: `HELIOS`, `SEUNGYEUB`) 중 어떤 것을 넣을까요?
> 2. **거주지 텍스트:** 레퍼런스에는 `Based in Delhi インド` 라고 적혀있습니다. 이 부분을 `Based in Seoul 韓国` (또는 원하시는 텍스트)로 변경할까요, 아니면 레퍼런스와 100% 똑같이 Delhi로 둘까요?

## Proposed Changes

### 1. 공통 레이아웃 수정

- **[MODIFY]** `apps/portfolio/src/features/layout/Header.tsx`: 로고 텍스트 변경 및 레이아웃 미세 조정.
- **[MODIFY]** `apps/portfolio/src/features/layout/Footer.tsx`: Helios의 푸터("PORTFOLIO WRAP", "I build cohesive brand identities...") 내용으로 변경.

### 2. 홈 화면 컴포넌트 전면 수정

- **[MODIFY]** `apps/portfolio/src/features/home/HeroSection.tsx`: 기존의 큰 "Rootwise Architects" 텍스트를 제거하고, Helios 스타일의 "Based in Delhi...", "Logo / Brand Designer", "5+ years™ of brand identity work..." 타이포그래피와 패럴랙스로 변경.
- **[MODIFY]** `apps/portfolio/src/features/home/FeaturedWorks.tsx`: 프로젝트 목록을 Helios의 포트폴리오(Meltdown Studios, Meridiem 등) 이름과 카테고리(Brand Identity, Logo Design)로 교체.
- **[MODIFY]** `apps/portfolio/src/features/home/ServicesSection.tsx`: 건축 서비스 내용을 Helios의 Capabilities (Brand Strategy, Logo Design, Brand Identity, Brand Guidelines)로 교체.
- **[NEW]** `apps/portfolio/src/features/home/ProfileSection.tsx`: Helios 포트폴리오에 존재하는 "Personal Profile" (Freelancer 경력 등) 영역 추가.

### 3. 홈 페이지 통합

- **[MODIFY]** `apps/portfolio/app/page.tsx`: 새로 만든 `ProfileSection`을 포함하여 렌더링 순서 재배치.

## Verification Plan

- `pnpm run dev` 실행 후 홈 화면 접속 시 Rootwise의 흔적이 사라지고 Helios(브랜드 디자이너) 포트폴리오의 느낌과 텍스트로 완벽히 탈바꿈했는지 확인.
