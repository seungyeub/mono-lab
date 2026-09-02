# mono-lab

**Turborepo + pnpm 기반의 모노레포** — 개인 프론트엔드 프로젝트들을 하나의 저장소에서 관리합니다.

## 🚀 기술 스택

| 영역              | 기술                                               |
| ----------------- | -------------------------------------------------- |
| **패키지 매니저** | pnpm workspaces                                    |
| **빌드 시스템**   | Turborepo 2.10                                     |
| **프레임워크**    | Next.js (App Router)                               |
| **스타일링**      | Tailwind CSS v4                                    |
| **코드 품질**     | ESLint, Prettier, TypeScript                       |
| **테스트**        | Jest, Playwright (VRT)                             |
| **CI/CD**         | GitHub Actions, SonarCloud, CodeRabbit, Lighthouse |

## 📁 구조

### Apps

- `apps/portfolio` — 개인 포트폴리오 웹사이트 ([상세 README](apps/portfolio/README.md))

### Packages

- `packages/ui` — 여러 앱에서 공유 가능한 React UI 컴포넌트
- `packages/eslint-config` — 공통 ESLint 설정 (Next.js 지원 포함)
- `packages/typescript-config` — 공통 `tsconfig.json` 설정
- `packages/tailwind-config` — 공통 Tailwind CSS 설정

## 🛠 사용 방법

### 패키지 설치

```sh
pnpm install
```

### 개발 서버 실행

모든 애플리케이션과 패키지를 동시에 개발 모드로 실행합니다.

```sh
pnpm run dev
```

### 빌드

Turborepo의 캐싱을 활용하여 변경된 패키지만 빠르게 빌드합니다.

```sh
pnpm run build
```

## 📄 라이선스

MIT License
