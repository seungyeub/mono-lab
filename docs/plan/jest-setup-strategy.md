# Jest 테스트 환경 구축 전략 (apps/portfolio 전용)

> **작성일:** 2026-06-09
> **대상:** `mono-lab` 모노레포 내 `apps/portfolio` (Next.js App Router)

이 문서는 모노레포의 독립성을 훼손하지 않으면서, Next.js 환경에 가장 최적화된 Jest 테스트 인프라를 구축하기 위한 계획입니다. 추후 다른 앱(`apps/resume` 등)에서 Vitest를 쓰더라도 충돌 없이 공존할 수 있도록 설계되었습니다.

---

## 1. 개요 및 구조 설계

- **테스트 러너**: `Jest`
- **테스트 환경**: `jsdom` (React 컴포넌트 렌더링 검증용)
- **대상 폴더**: `apps/portfolio` 한정
- **테스트 폴더 구조**: **Colocation (응집) 구조** 채택
  - 컴포넌트 파일 바로 옆에 테스트 파일을 두는 방식입니다. (예: `Button.tsx` 와 `Button.test.tsx` 가 같은 폴더에 위치)
  - 현대 React 및 Next.js 생태계에서 가장 널리 쓰이는 표준 방식이며, 컴포넌트 단위로 로직과 테스트를 한눈에 파악할 수 있어 유지보수성이 매우 높습니다.
- **터보레포 연동**: `turbo run test` 명령을 통해 루트 레벨에서 통합 제어 가능하도록 구성

---

## 2. 작업 상세 단계 (Proposed Steps)

### Step 1. 패키지 의존성 추가
- **위치:** `apps/portfolio/package.json`
- **추가할 devDependencies:**
  - `jest`, `@types/jest`
  - `jest-environment-jsdom`
  - `@testing-library/react`, `@testing-library/jest-dom`

### Step 2. Next.js 특화 Jest 설정 파일 생성
기존의 복잡한 Babel 세팅을 버리고 Next.js가 내장 지원하는 `next/jest` 플러그인(SWC 컴파일러 연동)을 사용합니다.

- **`apps/portfolio/jest.config.ts` 생성**:
  - `next/jest` 래퍼를 씌워서 `next.config.js`와 환경 변수(`.env`)를 자동으로 불러오도록 합니다.
  - 모노레포 내에서 절대 경로(Alias) 설정(`@/*` 등)이 제대로 매핑되도록 `moduleNameMapper`를 설정합니다.
  - **커버리지 리포트 활성화:** 추후 CI와 SonarCloud 연동을 위해 `coverageReporters: ['lcov']` 설정을 켭니다.

- **`apps/portfolio/jest.setup.ts` 생성**:
  - `import '@testing-library/jest-dom'` 코드를 추가하여 `expect(el).toBeInTheDocument()` 와 같은 직관적인 DOM 매처(matcher)를 전역으로 사용할 수 있게 세팅합니다.

### Step 3. 터보레포(Turborepo) 파이프라인 연동
모노레포의 꽃인 터보레포를 활용하여 테스트도 캐싱의 이점을 받도록 만듭니다.

- **루트 `turbo.json` 수정**:
  - `tasks` 블록에 `"test": { "dependsOn": ["^test"] }` 설정을 추가합니다.
- **루트 `package.json` 수정**:
  - `"scripts"` 안에 `"test": "turbo run test"` 명령을 추가합니다.

---

## 3. 검증 계획 (Verification Plan)

모든 설치와 세팅이 끝난 후 아래 프로세스로 정상 작동 여부를 검증할 예정입니다.

1. **Dummy Test 작성:** `apps/portfolio/src/components/` 내에 임의의 버튼이나 라벨 컴포넌트를 만들고, 바로 옆에 `example.test.tsx` 파일을 작성합니다.
2. **테스트 실행:** 루트(`mono-lab/`) 경로에서 `pnpm run test`를 실행하여 렌더링이 무사히 통과하는지 확인합니다.
3. **커버리지 파일 검증:** `apps/portfolio/coverage/lcov.info` 경로에 리포트 파일이 정상 생성되었는지 확인합니다. 이 파일이 훗날 CI/CD에서 SonarCloud 봇에게 보내질 핵심 지표가 됩니다.
