# Frontend Foundation Template

이 저장소는 앞으로 생성할 모든 프론트엔드 프로젝트(포트폴리오, 블로그, 사이드 프로젝트 등)의 기반이 되는 **Turborepo + pnpm 기반의 모노레포 템플릿**입니다.

## 🚀 기술 스택 (Tech Stack)
* **패키지 매니저:** pnpm workspaces
* **모노레포 빌드 시스템:** Turborepo
* **프레임워크:** Next.js 14+ (App Router)
* **스타일링:** Tailwind CSS
* **코드 품질:** ESLint, Prettier, TypeScript

## 📁 구조 (Structure)

이 템플릿은 다음과 같이 구성되어 있습니다:

### Apps
* `apps/web`: Next.js 14 웹 애플리케이션 (메인 포트폴리오/서비스용)

### Packages
* `packages/ui`: 여러 앱에서 공유 가능한 React UI 컴포넌트 (Tailwind CSS 적용)
* `packages/eslint-config`: 공통 ESLint 설정 (Next.js 지원 포함)
* `packages/typescript-config`: 공통 `tsconfig.json` 설정
* `packages/tailwind-config`: 공통 Tailwind CSS 설정

## 🛠 사용 방법 (How to use)

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

## 📄 라이선스 (License)
MIT License
