# Product Requirements Document (PRD) - 프론트엔드 포트폴리오 웹사이트

## 1. 프로젝트 개요 (Project Overview)

본 프로젝트는 단순한 결과물을 넘어, 웹상의 다양한 아이디어를 종합하여 직접 기획하고 디자인한 개인 포트폴리오 웹사이트 구축 프로젝트입니다.
**논리적인 UI/UX 설계, 확장성 있는 모노레포 아키텍처 구축, 그리고 체계적인 문제 해결 과정(Troubleshooting)**을 기록하고 공유하는 기술 문서이자 포트폴리오로 기능하는 것을 목적으로 합니다.
특히, 사전 구축된 사내 인프라 템플릿인 **`frontend-foundation` (Turborepo + pnpm 모노레포)** 위에서 개발을 진행하여, 스케일러블한 아키텍처 설계 역량을 증명합니다.

## 2. 목표 (Goals)

- **기술적 아키텍처 및 문제 해결 경험 공유:** 모노레포(`frontend-foundation`) 환경에서의 상태 관리, 폼 처리, E2E 테스트 등 실무 기술 스택 적용 과정과 기술적 의사결정(Troubleshooting)을 명확하게 문서화 및 시각화.
- **시각적 완성도 및 동적 인터랙션:** 미니멀하고 직관적인 디자인과 스크롤 애니메이션, 3D 요소(예: Hero Section 3D Card), 페이지 트랜지션 등을 통해 유려한 사용자 경험(UX) 제공.
- **성능, SEO 및 웹 접근성(a11y):** Lighthouse 성능 점수 90점 이상 달성, 시맨틱 마크업 및 WAI-ARIA를 활용한 웹 접근성(WCAG 2.1 AA) 준수, Google Analytics 연동을 통한 데이터 분석.

## 3. 기술 스택 (Tech Stack)

### 3.1. Infrastructure (기반 템플릿: `frontend-foundation`)

- **패키지 매니저 & 빌드:** pnpm workspaces, Turborepo
- **코드 품질 및 DX:** ESLint, Prettier, TypeScript (`packages/config-*` 상속)
- **Git Hooks & 버전 관리:** Husky, lint-staged (커밋 전 자동 검사), Conventional Commits 기반 PR 자동화.

### 3.2. Core & Styling (`apps/portfolio`, `packages/ui`)

- **프레임워크:** Next.js 14+ (App Router) + React
- **스타일링:** Tailwind CSS, shadcn/ui (`packages/ui` 내부 구성)
- **애니메이션:** Framer Motion (등장, 스크롤 기반, 호버 애니메이션, 3D 카드)
- **스크롤 UX:** `@studio-freight/lenis` (부드러운 관성 스크롤)

### 3.3. State, Data, Form

- **상태 관리 및 데이터 페칭:** Next.js Server Components(RSC)를 활용한 서버 렌더링과 Zustand를 이용한 Client State(UI 상태)의 명확한 분리.
- **콘텐츠 관리:** MDX (`velite` 또는 `next-mdx-remote`) 기반의 정적 Case Study 데이터 관리
- **폼 및 유효성 검사:** React Hook Form + Zod
- **메일 전송:** Next.js Server Actions + Resend API

### 3.4. Testing, CI/CD, Monitoring

- **테스트:** Jest (비즈니스 로직 단위 테스트), Playwright (E2E 테스트, 반응형 UI 검증: Desktop 및 Mobile 해상도 동시 테스트)
- **CI/CD 파이프라인:** GitHub Actions를 활용한 자동화된 검사 및 Turborepo 캐싱(Remote/Local)을 통한 빌드 시간 최적화
- **배포:** Vercel
- **에러 모니터링:** Sentry 연동 및 React Error Boundary를 활용한 프로덕션 레벨의 선제적 에러 핸들링

---

## 4. 핵심 기능 요구사항 (Key Features)

### 4.1. 주요 페이지

1.  **Home (Landing Page):**
    - 히어로 섹션 (스크롤 시 페이드아웃, 패럴랙스 효과, 및 3D 인터랙티브 카드 요소)
    - Featured Works (대표 프로젝트 리스트, 스크롤 시 등장 애니메이션)
    - Services / Expertise 소개 및 Testimonials (고객 후기 롤링)
2.  **Work (Case Studies):**
    - 전체 프로젝트 리스트 (그리드 뷰, 호버 시 이미지 줌/필터 효과)
    - **Project Detail:** 개별 프로젝트 상세 페이지 (MDX 구동).
3.  **About:** 개발 철학, 개인 소개, 미션 등 정적 정보.
4.  **Contact:** 유효성 검사 및 Server Action 기반 이메일 전송 폼.
5.  **Architecture & Log:** 기술적 의사결정과 문제 해결(Troubleshooting) 사례를 기록하고 공유하는 전용 섹션.

### 4.2. 공통 UI 및 인터랙션

- **Custom Cursor:** 기본 커서를 숨기고 Zustand 상태에 따라 반응하는 커스텀 커서.
- **Smooth Scrolling:** Lenis 전역 적용.
- **Page Transitions:** Framer Motion의 `AnimatePresence`를 활용한 페이지 전환 효과.

## 5. 아키텍처 및 폴더 구조 (Monorepo)

```text
mono-lab/
├── apps/
│   ├── portfolio/         # 포트폴리오 메인 애플리케이션 (Next.js 14)
│   │   ├── src/
│   │   │   ├── app/       # 라우팅 및 최상위 레이아웃
│   │   │   ├── features/  # 기능별 캡슐화된 컴포넌트 (home, work, contact 등)
│   │   │   ├── store/     # 상태 관리 (Zustand)
│   │   │   └── contents/  # 정적 콘텐츠 (MDX 파일)
│   └── resume/            # 온라인 이력서 웹 애플리케이션 (Vite + React)
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

- **Phase 1:** `frontend-foundation` 세팅, Husky/lint-staged 및 GitHub Actions CI 파이프라인(Turborepo 캐싱 포함) 구축.
- **Phase 2:** 공통 레이아웃 (Header, Footer, Custom Cursor, Lenis 스크롤) 구현.
- **Phase 3:** 랜딩 페이지(Home) 주요 섹션 및 애니메이션 적용.
- **Phase 4:** MDX 파이프라인 구축 및 Work/About 페이지 구현.
- **Phase 5:** Contact 폼 처리 (Resend), Jest/Playwright 테스트 환경 구축 및 Sentry 에러 모니터링 연동.
- **Phase 6:** Lighthouse 성능/접근성 최적화, SEO 및 Google Analytics 연동.
- **Phase 7:** `apps/resume` (Vite 기반) 이력서 프로젝트 환경 세팅 및 모노레포 연동 구현.

---

## 7. 향후 확장 로드맵 (Future Scope)

- **시각적 회귀 테스트(Visual Regression Testing) 점진적 스케일업:**
  현재는 개발 생산성(DX)을 최우선으로 하여, 렌더링 오차 허용치(Pixel Ratio)를 조절하는 방식으로 Playwright 스냅샷 이미지를 Git 저장소 내부에서 가볍게 관리합니다. 향후 아키텍처는 다음과 같이 점진적으로 고도화할 계획입니다.
  1. **[Done] 컴포넌트 단위 스냅샷 분리:** Docker 대신, 개발자 경험(DX)을 극대화하기 위해 VRT(시각적 회귀 테스트) 대상을 Full-page에서 Component-level로 쪼개어 누적 오차를 원천 차단하는 아키텍처로 선회(Pivot)하여 구축 완료.
  2. **[Enterprise] Storybook + Chromatic 연동:** 이후 프로젝트가 스케일업되어 컴포넌트가 많아지고 Git 저장소 용량 비대화가 우려되는 시점에는, 시각적 회귀 테스트 전용 클라우드 SaaS인 Chromatic으로 마이그레이션하여 오차 문제와 용량 문제를 동시에 해결하는 엔터프라이즈급 UI 검증 파이프라인을 완성합니다.
