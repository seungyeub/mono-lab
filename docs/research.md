# mono-lab 프로젝트 상세 분석 보고서

> **작성일:** 2026-06-07  
> **분석 대상:** `mono-lab` — Turborepo + pnpm 기반 모노레포 템플릿

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [모노레포 인프라 구조](#2-모노레포-인프라-구조)
3. [공유 패키지 분석](#3-공유-패키지-분석)
4. [Apps 디렉토리](#4-apps-디렉토리)
5. [파일 맵](#5-파일-맵)

---

## 1. 프로젝트 개요

### 1.1 목적

앞으로 생성할 모든 프론트엔드 프로젝트(포트폴리오, 블로그, 사이드 프로젝트 등)의 기반이 되는 **Turborepo + pnpm 기반의 모노레포 템플릿**입니다. 공통 설정(TypeScript, ESLint, Tailwind CSS)과 공유 UI 컴포넌트를 `packages/`에서 관리하고, 실제 애플리케이션은 `apps/` 디렉토리에 추가하여 사용합니다.

### 1.2 핵심 인프라 기술 스택

| 영역 | 기술 |
|------|------|
| **패키지 매니저** | pnpm 10.19.0 (workspaces) |
| **빌드 시스템** | Turborepo 2.9.14 |
| **코드 포맷팅** | Prettier 3.6.0 (prettier-plugin-tailwindcss 포함) |
| **노드 요구사항** | ≥ 18 |
| **라이선스** | MIT |

---

## 2. 모노레포 인프라 구조

### 2.1 워크스페이스 레이아웃

```
mono-lab/
├── apps/                       # 애플리케이션 디렉토리 (여러 프로젝트 배치)
│   └── portfolio/              # (예시) Next.js 포트폴리오 앱
├── packages/                   # 공유 라이브러리 및 설정
│   ├── ui/                     # 공유 React UI 컴포넌트 + CSS
│   ├── eslint-config/          # ESLint 공통 설정 (base, next, react-internal)
│   ├── typescript-config/      # TypeScript 공통 설정 (base, nextjs, react-library)
│   └── tailwind-config/        # Tailwind CSS 공통 설정 + PostCSS
├── package.json                # 루트 스크립트 (turbo run build/dev/lint)
├── turbo.json                  # Turborepo 태스크 파이프라인
├── pnpm-workspace.yaml         # 워크스페이스 정의
└── pnpm-lock.yaml              # 잠금 파일
```

### 2.2 pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`apps/`과 `packages/` 하위의 모든 디렉토리를 워크스페이스 패키지로 인식합니다. 새로운 앱이나 패키지를 추가하면 자동으로 워크스페이스에 포함됩니다.

### 2.3 Turborepo 파이프라인 (`turbo.json`)

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

| 태스크 | dependsOn | cache | 출력 |
|--------|-----------|-------|------|
| `build` | `^build` (의존 패키지 먼저) | ✅ | `dist/**`, `.next/**` (캐시 제외: `.next/cache/**`) |
| `lint` | `^lint` | ✅ | — |
| `check-types` | `^check-types` | ✅ | — |
| `dev` | — | ❌ (캐시 없음) | persistent: true |

**핵심 포인트:**
- `build`는 **위상 정렬** 기반 — 의존되는 `packages/*`가 먼저 빌드된 후 `apps/*`가 빌드
- `dev`는 캐시를 사용하지 않으며 `persistent: true`로 지속 실행 (watch 모드)
- `inputs`에 `.env*`를 포함하여 환경변수 변경 시 캐시 무효화

### 2.4 루트 스크립트 (`package.json`)

```json
{
  "name": "mono-lab",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "check-types": "turbo run check-types",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "devDependencies": {
    "prettier": "^3.6.0",
    "prettier-plugin-tailwindcss": "^0.7.1",
    "turbo": "^2.9.14"
  },
  "packageManager": "pnpm@10.19.0",
  "engines": {
    "node": ">=18"
  }
}
```

- `turbo run` 명령으로 모든 워크스페이스의 해당 태스크를 병렬 실행
- `format`만 Prettier를 직접 호출 (Turborepo 외부)
- `packageManager` 필드로 pnpm 버전을 고정

### 2.5 `.npmrc`

```
auto-install-peers = true
```

피어 의존성을 자동 설치하여 `react`, `react-dom` 등의 중복 설치 문제를 방지합니다.

### 2.6 `.gitignore`

주요 무시 항목:
- `node_modules`, `.next/`, `dist/` — 빌드/의존성 산출물
- `.turbo` — Turborepo 캐시
- `.env.local`, `.env.*.local` — 로컬 환경변수
- `.DS_Store`, `*.pem` — OS/보안 파일

---

## 3. 공유 패키지 분석

### 3.1 `@repo/typescript-config`

**역할:** 모든 프로젝트에서 상속하는 TypeScript 기본 설정

| 파일 | 용도 |
|------|------|
| `base.json` | 공통 기본 설정 (ES2022, strict, NodeNext 모듈) |
| `nextjs.json` | Next.js 앱용 확장 설정 |
| `react-library.json` | React 라이브러리용 설정 |

**`base.json` 전체 설정:**

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "incremental": false,
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "NodeNext",
    "moduleDetection": "force",
    "moduleResolution": "NodeNext",
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022"
  }
}
```

**주요 설정 의미:**
- `strict: true` — 엄격한 타입 체킹 (null 안전성, 암시적 any 금지 등)
- `noUncheckedIndexedAccess: true` — 인덱스 접근 시 `T | undefined` 체크 강제
- `isolatedModules: true` — 파일별 독립 변환 보장 (SWC, esbuild 호환)
- `module: "NodeNext"` — Node.js ESM/CJS 이중 해석 지원
- `declaration: true` + `declarationMap: true` — 패키지 소비 시 타입 제공

**사용 방법:** 각 앱/패키지의 `tsconfig.json`에서 `"extends": "@repo/typescript-config/nextjs.json"` 등으로 상속.

---

### 3.2 `@repo/eslint-config`

**역할:** ESLint 규칙을 프로젝트 유형별로 분리 관리

| 파일 | 용도 | 대상 |
|------|------|------|
| `base.js` | 공통 ESLint 규칙 | 모든 프로젝트 |
| `next.js` | Next.js 앱 전용 규칙 | `apps/*` (Next.js) |
| `react-internal.js` | React 라이브러리 패키지용 규칙 | `packages/ui` 등 |

**의존성:**
```json
{
  "@next/eslint-plugin-next": "^16.2.0",
  "@typescript-eslint/eslint-plugin": "^8.17.0",
  "@typescript-eslint/parser": "^8.17.0",
  "eslint-config-prettier": "^10.0.0",
  "eslint-plugin-import": "^2.31.0",
  "eslint-plugin-react-hooks": "^5.2.0"
}
```

**사용 방법:** 각 프로젝트의 `eslint.config.js`에서 해당 설정을 import하여 사용.

---

### 3.3 `@repo/tailwind-config`

**역할:** Tailwind CSS 공유 설정 및 디자인 토큰

**`package.json` exports:**
```json
{
  "exports": {
    ".": "./shared-styles.css",
    "./postcss": "./postcss.config.js"
  }
}
```

**`shared-styles.css`:**
```css
@import "tailwindcss";

@theme {
  --color-blue-1000: #2a8af6;
  --color-purple-1000: #a853ba;
  --color-red-1000: #e92a67;
}
```

Tailwind CSS v4의 `@theme` 디렉티브를 사용하여 커스텀 색상 토큰을 정의합니다. 각 앱에서 `@import "@repo/tailwind-config"`로 공유 스타일을 임포트합니다.

**`postcss.config.js`:**
```javascript
export const postcssConfig = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**사용 방법:** 앱의 `globals.css`에서 `@import "@repo/tailwind-config"`으로 공유 토큰을 가져온 뒤, 앱 고유의 `@theme` 확장이나 `@layer` 커스터마이징을 추가합니다.

---

### 3.4 `@repo/ui`

**역할:** 여러 앱에서 공유 가능한 React UI 컴포넌트 라이브러리

**`package.json` exports:**
```json
{
  "exports": {
    "./styles.css": "./dist/index.css",
    "./*": "./dist/*.js"
  }
}
```

**현재 포함된 컴포넌트:**

| 파일 | 설명 |
|------|------|
| `src/card.tsx` | 카드 컴포넌트 |
| `src/gradient.tsx` | 그라데이션 컴포넌트 |
| `src/turborepo-logo.tsx` | Turborepo 로고 SVG |
| `src/styles.css` | 공유 스타일 (Tailwind 기반) |

**빌드 스크립트:**

| 스크립트 | 명령 | 설명 |
|----------|------|------|
| `build:styles` | `tailwindcss -i ./src/styles.css -o ./dist/index.css` | Tailwind CLI 빌드 |
| `build:components` | `tsc` | TypeScript 컴파일 |
| `dev:styles` | `tailwindcss ... --watch` | 개발 중 스타일 감시 |
| `dev:components` | `tsc --watch` | 개발 중 TS 감시 |

**`turbo.json` (패키지 로컬):**
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["build:styles", "build:components"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "dependsOn": ["dev:styles", "dev:components"],
      "cache": false,
      "persistent": true
    }
  }
}
```

빌드가 `build:styles` + `build:components` 두 단계로 분리되어 있으며, Turborepo가 이를 조합하여 실행합니다.

**사용 방법:**
- 스타일: `import '@repo/ui/styles.css'` (layout에서 전역 임포트)
- 컴포넌트: `import { Card } from '@repo/ui/card'`

**피어 의존성:** `react: ^19`

---

## 4. Apps 디렉토리

`apps/` 디렉토리는 모노레포 위에서 실행되는 **독립적인 애플리케이션들을 배치하는 공간**입니다. 각 앱은 `packages/`의 공유 설정과 컴포넌트를 `workspace:*` 의존성으로 참조하며, 자체 빌드·개발·배포 파이프라인을 가집니다.

### 4.1 현재 등록된 앱

| 앱 | 경로 | 설명 |
|----|------|------|
| **portfolio** | `apps/portfolio/` | Next.js 기반 개인 포트폴리오 웹사이트 |

### 4.2 새 앱 추가 방법

1. `apps/` 하위에 새 디렉토리 생성 (예: `apps/blog/`)
2. `package.json`에 `workspace:*`로 공유 패키지 의존성 추가:
   ```json
   {
     "dependencies": {
       "@repo/ui": "workspace:*"
     },
     "devDependencies": {
       "@repo/eslint-config": "workspace:*",
       "@repo/tailwind-config": "workspace:*",
       "@repo/typescript-config": "workspace:*"
     }
   }
   ```
3. `pnpm install` 실행 — `pnpm-workspace.yaml`의 `apps/*` 글로브에 의해 자동 인식
4. 루트에서 `pnpm run dev` 시 Turborepo가 새 앱의 `dev` 스크립트도 함께 실행

### 4.3 패키지 간 의존 관계

```
apps/portfolio
  ├── @repo/ui (workspace:*)           ← 공유 컴포넌트·스타일
  ├── @repo/eslint-config (workspace:*) ← ESLint 규칙
  ├── @repo/tailwind-config (workspace:*) ← Tailwind 토큰·PostCSS
  └── @repo/typescript-config (workspace:*) ← tsconfig 상속
```

모든 `workspace:*` 의존성은 pnpm이 심볼릭 링크로 연결하여, 패키지 수정 시 앱에서 즉시 반영됩니다.

---

## 5. 파일 맵

### 5.1 루트 레벨

```
mono-lab/
├── .gitignore .................... Git 무시 규칙 (382B)
├── .npmrc ........................ pnpm 설정 — auto-install-peers (26B)
├── LICENSE ....................... MIT 라이선스 (1,066B)
├── README.md ..................... 프로젝트 소개 (1,372B)
├── PRD.md ........................ 제품 요구사항 문서 (4,788B)
├── HELIOS_COMPARISON.md .......... 레퍼런스 비교 분석 (14,381B)
├── package.json .................. 루트 스크립트·devDeps (449B)
├── turbo.json .................... Turborepo 파이프라인 (425B)
├── pnpm-workspace.yaml ........... 워크스페이스 정의 (40B)
└── pnpm-lock.yaml ................ 잠금 파일 (163KB)
```

### 5.2 공유 패키지

```
packages/
├── ui/
│   ├── src/
│   │   ├── card.tsx .............. 카드 컴포넌트 (870B)
│   │   ├── gradient.tsx .......... 그라데이션 컴포넌트 (497B)
│   │   ├── turborepo-logo.tsx .... Turborepo 로고 (1,642B)
│   │   └── styles.css ............ 공유 스타일 (115B)
│   ├── package.json .............. exports·scripts·peerDeps (894B)
│   ├── tsconfig.json ............. TS 설정 (211B)
│   ├── turbo.json ................ 로컬 빌드 파이프라인 (458B)
│   └── eslint.config.mjs ......... ESLint 설정 (131B)
│
├── eslint-config/
│   ├── base.js ................... 공통 규칙 (651B)
│   ├── next.js ................... Next.js 규칙 (1,495B)
│   ├── react-internal.js ......... React 라이브러리 규칙 (1,088B)
│   └── package.json .............. 의존성 (634B)
│
├── typescript-config/
│   ├── base.json ................. 기본 tsconfig (500B)
│   ├── nextjs.json ............... Next.js tsconfig (272B)
│   ├── react-library.json ........ React 라이브러리 tsconfig (136B)
│   └── package.json .............. 패키지 정보 (150B)
│
└── tailwind-config/
    ├── shared-styles.css ......... 공유 디자인 토큰 (126B)
    ├── postcss.config.js ......... PostCSS 설정 (148B)
    └── package.json .............. exports 정의 (271B)
```

### 5.3 Apps

```
apps/
└── portfolio/ .................... Next.js 포트폴리오 앱 (독립 프로젝트)
```

`apps/` 하위에 포트폴리오, 블로그, 사이드 프로젝트 등 여러 애플리케이션을 배치하여 사용합니다. 각 앱은 `packages/`의 공유 설정과 컴포넌트를 상속받아 일관된 코드 품질과 스타일을 유지합니다.

---

> **이 보고서는 프로젝트의 모노레포 인프라, 공유 패키지 설정 파일을 정적 분석하여 작성되었습니다.**  
> **최종 업데이트:** 2026-06-07
