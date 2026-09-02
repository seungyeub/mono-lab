# Portfolio

Framer Helios 템플릿을 레퍼런스로 한 **Next.js 기반 개인 포트폴리오 웹사이트**.

## ✨ 주요 기능

- **Hero Section** — Three.js / React Three Fiber 기반 3D 인터랙티브 카드 + 물리 엔진(Rapier)
- **Works Section** — MDX 기반 10개 실제 프로젝트 (Overview → Tech Stack → Key Features → Demonstrations → Impact & Results 구조)
- **Skills Section** — 브랜드 칼러 칩 레이아웃 (5 카테고리, 50개 기술 스택)
- **Experience Section** — 경력/자격증 타임라인
- **FAQ Section** — 아코디언 UI
- **Epilogue** — 81개 GIF 무한 스크롤 캐러셀 (홈 전용)
- **Resume 페이지** — 경력/자격증 상세 (ExperienceSection과 데이터 공유)
- **Contact 폼** — React Hook Form + Zod + Resend Server Action
- **커스텀 커서** — 4가지 상태 (`default` | `view` | `grab` | `pointer`)
- **스무스 스크롤** — Lenis

## 🛠 기술 스택

| 영역          | 기술                                               |
| ------------- | -------------------------------------------------- |
| **Framework** | Next.js (App Router)                               |
| **Language**  | TypeScript                                         |
| **Styling**   | Tailwind CSS v4                                    |
| **3D**        | Three.js, React Three Fiber, @react-three/rapier   |
| **Animation** | Framer Motion, Lenis                               |
| **Form**      | React Hook Form, Zod v3, Resend                    |
| **State**     | Zustand                                            |
| **Content**   | MDX (`src/contents/work/`)                         |
| **Test**      | Jest, Playwright (Visual Regression Testing)       |
| **CI/CD**     | GitHub Actions, SonarCloud, CodeRabbit, Lighthouse |

## 🚀 시작하기

```bash
# 루트에서 (mono-lab)
pnpm install
pnpm run dev
```

[http://localhost:3001](http://localhost:3001) 에서 확인할 수 있습니다.

## 📂 프로젝트 구조

```
apps/portfolio/
├── src/
│   ├── app/                  # Next.js App Router 페이지
│   │   ├── page.tsx          # 홈 (Hero, Works, Skills, Experience, FAQ, Epilogue)
│   │   ├── work/             # Work 목록 + [slug] 상세
│   │   ├── resume/           # 이력서 페이지
│   │   └── contact/          # Contact 폼
│   ├── features/home/        # 홈 섹션 컴포넌트
│   ├── components/           # 공통 컴포넌트 (Header, Footer, CustomCursor 등)
│   ├── contents/work/        # MDX 프로젝트 파일 (10건)
│   └── lib/                  # 유틸리티 (MDX 파서, 이미지 필터 등)
├── public/
│   ├── icons/                # 커스텀 SVG 아이콘
│   └── images/               # 정적 이미지 에셋
├── docs/
│   ├── 01__Planning/         # 프로젝트 기획 문서
│   └── plan/                 # 기능별 상세 계획서
└── tests/                    # Playwright VRT 테스트
```

## 📝 문서

- [\_Project.md](docs/01__Planning/_Project.md) — 프로젝트 목적 및 운영 원칙
- [\_Tasks.md](docs/01__Planning/_Tasks.md) — 작업 진행 현황
- [\_DecisionLog.md](docs/01__Planning/_DecisionLog.md) — 의사결정 기록
- [\_Notes.md](docs/01__Planning/_Notes.md) — 자유 기록

## 📄 라이선스

MIT License
