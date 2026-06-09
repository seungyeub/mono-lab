# Product Requirements Document (PRD) - Rootwise Architects 클론 (포트폴리오)

## 1. 프로젝트 개요 (Project Overview)

본 프로젝트는 Framer의 고급 포트폴리오/에이전시 템플릿인 **"Palmer (Rootwise Architects)"**의 시각적 요소와 인터랙션을 **Next.js 기반으로 완벽하게 클론 코딩**하여 프론트엔드 개발 역량을 증명하기 위한 개인 포트폴리오 웹사이트 구축 프로젝트입니다.
특히, 사전 구축된 사내 인프라 템플릿인 **`frontend-foundation` (Turborepo + pnpm 모노레포)** 위에서 개발을 진행하여, 스케일러블한 아키텍처 설계 역량을 동시에 어필합니다.

**참고 레퍼런스:** [Design by Helios (Framer)](https://designbyhelios.framer.website/)

## 2. 목표 (Goals)

- **시각적 완벽함:** 레퍼런스 사이트의 미니멀한 디자인, 타이포그래피, 간격 등을 Pixel-perfect하게 구현.
- **동적 인터랙션:** 스크롤 애니메이션, 호버 이펙트, 페이지 트랜지션 등 원본 사이트의 유려한 사용자 경험(UX) 복제.
- **인프라 및 기술적 역량 증명:** 모노레포(`frontend-foundation`) 아키텍처를 기반으로 상태 관리(Zustand), 폼 처리, E2E 테스트(Playwright) 등 실무에서 요구하는 기술 스택을 적절하게 녹여내어 취업 포트폴리오로서의 가치 극대화.

## 3. 기술 스택 (Tech Stack)

### 3.1. Infrastructure (기반 템플릿: `frontend-foundation`)

- **패키지 매니저 & 빌드:** pnpm workspaces, Turborepo
- **코드 품질:** ESLint, Prettier, TypeScript (`packages/config-*` 에서 공통 설정 상속)

### 3.2. Core & Styling (`apps/portfolio`, `packages/ui`)

- **프레임워크:** Next.js 14+ (App Router) + React
- **스타일링:** Tailwind CSS, shadcn/ui (`packages/ui` 내부 구성)
- **애니메이션:** Framer Motion (등장, 스크롤 기반, 호버 애니메이션)
- **스크롤 UX:** `@studio-freight/lenis` (부드러운 관성 스크롤)

### 3.3. State, Data, Form

- **상태 관리:** Zustand (커스텀 마우스 커서, 전역 모바일 메뉴, 트랜지션 로딩 상태 등)
- **콘텐츠 관리:** MDX (`velite` 또는 `next-mdx-remote`) 기반의 정적 Case Study 데이터 관리
- **폼 및 유효성 검사:** React Hook Form + Zod
- **메일 전송:** Next.js Server Actions + Resend API

### 3.4. Testing & CD

- **테스트:** Playwright (주요 페이지 E2E 테스트)
- **배포:** Vercel

---

## 4. 핵심 기능 요구사항 (Key Features)

### 4.1. 주요 페이지

1.  **Home (Landing Page):**
    - 히어로 섹션 (스크롤 시 페이드아웃 및 패럴랙스 효과)
    - Featured Works (대표 프로젝트 리스트, 스크롤 시 등장 애니메이션)
    - Services / Expertise 소개 및 Testimonials (고객 후기 롤링)
2.  **Work (Case Studies):**
    - 전체 프로젝트 리스트 (그리드 뷰, 호버 시 이미지 줌/필터 효과)
    - **Project Detail:** 개별 프로젝트 상세 페이지 (MDX 구동).
3.  **About:** 에이전시/개인 소개, 미션, 수상 내역 정적 정보.
4.  **Contact:** 유효성 검사 및 Server Action 기반 이메일 전송 폼.

### 4.2. 공통 UI 및 인터랙션

- **Custom Cursor:** 기본 커서를 숨기고 Zustand 상태에 따라 반응하는 커스텀 커서.
- **Smooth Scrolling:** Lenis 전역 적용.
- **Page Transitions:** Framer Motion의 `AnimatePresence`를 활용한 페이지 전환 효과.

## 5. 아키텍처 및 폴더 구조 (Monorepo)

```text
mono-lab/
├── apps/
│   └── portfolio/         # 포트폴리오 메인 애플리케이션 (Next.js 14)
│       ├── src/
│       │   ├── app/       # 라우팅 및 최상위 레이아웃
│       │   ├── features/  # 기능별 캡슐화된 컴포넌트 (home, work, contact 등)
│       │   ├── store/     # 상태 관리 (Zustand)
│       │   └── contents/  # 정적 콘텐츠 (MDX 파일)
│
├── packages/              # 공통 라이브러리
│   ├── ui/                # shadcn/ui 기반 공통 컴포넌트 및 Tailwind 설정
│   ├── config-eslint/
│   └── config-typescript/
│
├── package.json
└── turbo.json
```

## 6. 마일스톤 (Milestones)

- **Phase 1:** `frontend-foundation` 템플릿 복제 및 포트폴리오용 초기 설정 수정 (의존성 설치).
- **Phase 2:** 공통 레이아웃 (Header, Footer, Custom Cursor, Lenis 스크롤) 구현.
- **Phase 3:** 랜딩 페이지(Home) 주요 섹션 및 애니메이션 적용.
- **Phase 4:** MDX 파이프라인 구축 및 Work/About 페이지 구현.
- **Phase 5:** Contact 폼 처리 (Resend) 및 Playwright E2E 테스트.
