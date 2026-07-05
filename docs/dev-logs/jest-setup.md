# 🛠️ 개발 일지: Jest 기반 컴포넌트 테스트 환경 구축기

> **작성일:** 2026-06-10
> **작성자:** Seungyeub
> **대상 프로젝트:** `mono-lab` 내 `apps/portfolio` (Next.js App Router)

## 1. 개요 및 요구사항

이번 작업의 핵심 목표는 모노레포 환경(Turborepo) 내에 위치한 Next.js 프로젝트(`apps/portfolio`)에 **가장 빠르고 최적화된 형태의 Jest 테스트 인프라를 구축**하는 것입니다.

**[초기 프롬프트 및 요구사항]**

> "Jest 테스트 환경 구축에 대해 흐름대로 시작부터 끝까지 모든 과정을 상세히 적어주세요. 작성한 파일과 내용들을 코드 블록으로 작성해서 한 줄 한 줄 왜 필요한지 주석으로 정리해 주세요. 추가로 `jest-setup-strategy.md` 내용과 추후 발생할 수 있는 이슈도 포함해 주세요."

---

## 2. 초기 설계 및 전략 (Strategy)

작업 시작 전 `docs/plan/jest-setup-strategy.md`를 통해 수립한 아키텍처 전략은 다음과 같습니다.

1. **테스트 러너 및 렌더링 환경:** `Jest` + `jsdom` (브라우저 없이 React 컴포넌트의 가상 DOM 렌더링을 검증하기 위함)
2. **테스트 폴더 구조 (Colocation 채택):**
   - 테스트 코드만 모아두는 별도의 `__tests__` 폴더를 만들지 않습니다.
   - 실제 UI 컴포넌트 파일 바로 옆에 테스트 파일을 위치(`Button.tsx`와 `Button.test.tsx` 동위 배치)시키는 Colocation(응집) 방식을 채택했습니다. 컴포넌트를 수정할 때 테스트 코드도 즉시 확인 가능해 유지보수성이 대폭 향상됩니다.
3. **Turborepo 파이프라인 연동:** 모노레포의 강력한 빌드 캐싱(Caching) 시스템을 활용하기 위해 터보레포 파이프라인에 통합 제어되도록 설계했습니다.

---

## 3. 구축 과정 상세 (Step-by-Step)

### Step 3.1. 패키지 의존성 설치

Next.js 환경에서 DOM 테스트를 수행하기 위해 아래 패키지들을 `apps/portfolio/package.json`의 `devDependencies`로 설치했습니다.

```bash
pnpm --filter portfolio add -D jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

- **`jest`, `@types/jest`:** 기본 테스트 러너 및 타입 추론을 위한 패키지
- **`jest-environment-jsdom`:** Node.js 환경에서 브라우저의 DOM API(document, window 등)를 흉내 내는 가상 환경 제공
- **`@testing-library/*`:** 리액트 컴포넌트를 렌더링하고, 유저가 화면을 보듯(getByText, getByRole 등) 요소를 테스트할 수 있게 돕는 핵심 라이브러리

### Step 3.2. Jest 설정 파일 작성 (`jest.config.ts`)

과거에는 복잡한 Babel 세팅이 필요했지만, 현재 Next.js는 `next/jest`라는 훌륭한 SWC 플러그인을 기본 제공합니다. 이를 활용해 설정 파일을 작성했습니다.

**`apps/portfolio/jest.config.ts`**

```typescript
import type { Config } from 'jest';
// Next.js에서 제공하는 Jest 래퍼 플러그인. 내부적으로 SWC 컴파일러와 연동됩니다.
import nextJest from 'next/jest.js';

// 프로젝트 루트 경로를 지정해 next.config.js와 .env 파일을 테스트 환경에서도 자동으로 불러오게 합니다.
const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  // V8 엔진의 기본 커버리지 수집기를 사용하여 속도를 높입니다.
  coverageProvider: 'v8',

  // 브라우저와 유사한 가상 환경(jsdom)을 렌더링 세팅으로 지정합니다.
  testEnvironment: 'jest-environment-jsdom',

  // 각 테스트 코드가 실행되기 직전에 한 번씩 먼저 실행될 설정 파일의 경로입니다.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Next.js에서 사용하는 절대 경로 매핑(Alias: @/*)을 Jest가 이해할 수 있도록 번역해 줍니다.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // 커버리지를 측정할 파일의 범위를 지정합니다. 타입 파일(.d.ts)이나 배럴 파일(index.ts)은 제외합니다.
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],

  // 로컬 터미널이나 CI 환경에서 테스트 실행 시 기본적으로 코드 커버리지를 계산하도록 켭니다.
  collectCoverage: true,
};

// async 특성을 가진 Next.js 환경 설정을 정상적으로 불러오기 위해 래퍼 함수로 감싸서 export 합니다.
export default createJestConfig(config);
```

### Step 3.3. Jest Setup 파일 작성 (`jest.setup.ts`)

매 테스트 파일마다 DOM 검증용 메서드를 불러오면 코드가 지저분해지므로, 이를 전역으로 설정하는 파일입니다.

**`apps/portfolio/jest.setup.ts`**

```typescript
// .toBeInTheDocument(), .toHaveStyle() 등 직관적이고 강력한 DOM 매처(matcher)들을
// 모든 테스트 코드에서 'import' 없이 기본적으로 사용할 수 있도록 전역 환경을 확장합니다.
import '@testing-library/jest-dom';
```

### Step 3.4. Colocation 더미 테스트 작성

작성된 설정이 실제로 DOM 요소들을 렌더링하고 테스트를 통과시키는지 확인하기 위해, 기존 `SectionLabel` 컴포넌트 바로 옆에 테스트 코드를 작성했습니다.

**`apps/portfolio/src/components/SectionLabel.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import SectionLabel from './SectionLabel';

describe('SectionLabel', () => {
  it('renders correctly with given props', () => {
    // 1. 컴포넌트를 우리가 설정한 가상 DOM(jsdom)에 렌더링합니다.
    render(<SectionLabel scene='01' leftLabel='Left Text' rightLabel='Right Text' />);

    // 2. 전달된 Props가 화면(document)에 정상적으로 텍스트로 나타나는지 전역 매처로 검증합니다.
    expect(screen.getByText('Left Text')).toBeInTheDocument();
    expect(screen.getByText('SCENE — 01')).toBeInTheDocument();
    expect(screen.getByText('Right Text')).toBeInTheDocument();
  });
});
```

### Step 3.5. Turborepo 통합 및 파이프라인 연동

모노레포 내에서 단 한 번의 명령어로 전체 프로젝트의 테스트를 실행하고, 터보레포의 캐싱 시스템을 태우기 위한 설정입니다.

**`turbo.json` (루트)**

```json
{
  "tasks": {
    "test": {
      // 컴포넌트가 변경되었을 때만 캐시를 깨고 다시 테스트를 돕니다.
      "dependsOn": ["^test"],
      // 테스트 결과로 생성되는 coverage 폴더를 캐싱 산출물로 지정합니다.
      "outputs": ["coverage/**"]
    }
  }
}
```

**`package.json` (루트)**

```json
{
  "scripts": {
    // 이제 루트 터미널에서 pnpm run test를 치면 터보레포가 알아서 각 패키지의 테스트를 수행합니다.
    "test": "turbo run test"
  }
}
```

---

## 4. 🚨 추후 발생할 수 있는 이슈 및 트러블슈팅 (Troubleshooting)

이러한 테스트 환경을 기반으로 실제 UI 개발을 진행해 나갈 때, **추후 마주치게 될 대표적인 문제**와 해결책을 기록해 둡니다.

### 1. "3D(Three.js/Canvas) 컴포넌트 테스트가 자꾸 깨져요!"

- **원인:** 우리가 세팅한 `jsdom`은 단순한 HTML 브라우저 껍데기일 뿐, 그래픽 연산을 하는 WebGL이나 `<canvas>` 태그를 렌더링할 능력이 0%입니다. 따라서 `InteractiveCardCanvas` 같은 3D 컴포넌트를 `render()` 하려고 시도하면 에러가 뿜어져 나옵니다.
- **해결책:** 3D 요소가 포함된 컴포넌트를 테스트해야 한다면 `jest-canvas-mock` 라이브러리를 추가 설치하여 Canvas를 강제로 흉내(Mock) 내어 무력화시켜야 합니다. 또는 3D 로직은 별도 e2e 툴로 검사하고 Jest 단위 테스트에서는 해당 렌더링 부분을 `jest.mock()`으로 건너뛰는(Skip) 방식을 추천합니다. (아래 5번 섹션 예시 참조)

### 2. "로컬에서는 에러가 없는데 왜 CI에서는 자꾸 테스트가 실패할까요?"

- **원인 (대소문자 파편화):** Mac OS 환경은 폴더/파일 이름의 대소문자를 엄격하게 구분하지 않아서 경로 오타를 내도 `import`가 되지만, Linux 기반의 CI 서버는 1글자의 대소문자만 틀려도 파일이 없다며 에러를 뱉습니다. 테스트 코드 내의 `import` 경로 대소문자가 정확한지 점검해야 합니다.

### 3. "테스트 코드가 늘어나니까 터미널에서 실행할 때 너무 느려요!"

- **해결책:** 로컬에서 개발 중일 때 매번 모든 파일의 `Coverage(코드 커버리지)`를 계산하는 것은 자원 낭비입니다. 속도가 답답해지면 `jest.config.ts`의 맨 마지막 줄을 `collectCoverage: process.env.CI === 'true'` 처럼 수정하여, **로컬에서는 테스트 통과 여부만 빠르게 확인**하고 커버리지 계산은 CI 서버에서만 진행하도록 최적화할 수 있습니다.

---

## 5. 📚 실무 테스트 작성 가이드 (예시 패턴)

앞으로 `apps/portfolio` 프로젝트에서 테스트 코드를 작성할 때 참고할 수 있는 4가지 핵심 패턴입니다. 필요할 때 복사해서 응용하세요!

### 패턴 1: 사용자 상호작용 (User Interaction)

버튼 클릭, 인풋 타이핑 등 사용자의 행동에 따라 UI가 어떻게 변하는지 테스트합니다.

> **필요 라이브러리:** `pnpm add -D @testing-library/user-event`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter Component', () => {
  it('버튼을 클릭하면 숫자가 1 증가해야 한다', async () => {
    // userEvent를 초기화합니다 (Jest 28+ 권장 방식)
    const user = userEvent.setup();
    render(<Counter />);

    const button = screen.getByRole('button', { name: /증가/i });
    const countDisplay = screen.getByTestId('count-value');

    // 1. 초기 렌더링 검증
    expect(countDisplay).toHaveTextContent('0');

    // 2. 사용자의 클릭 액션 시뮬레이션
    await user.click(button);

    // 3. 상태 변경 후 렌더링 검증
    expect(countDisplay).toHaveTextContent('1');
  });
});
```

### 패턴 2: 비동기 데이터 로딩 (Async Rendering)

API 데이터를 받아오거나, 로딩 스피너가 돌다가 결과가 렌더링되는 과정을 테스트합니다.

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile Component', () => {
  it('로딩 스피너가 먼저 보이고, 이후에 유저 이름이 렌더링되어야 한다', async () => {
    render(<UserProfile />);

    // 1. 처음엔 로딩 텍스트가 존재하는지 확인
    expect(screen.getByText('데이터 불러오는 중...')).toBeInTheDocument();

    // 2. 비동기 작업이 끝난 뒤 결과가 렌더링될 때까지 기다림 (findBy*는 자동으로 waitFor를 포함함)
    const userName = await screen.findByText('Seungyeub');

    // 3. 최종 결과 검증
    expect(userName).toBeInTheDocument();
    // 로딩 텍스트가 사라졌는지 검증 (queryBy*는 요소가 없어도 에러를 내지 않고 null 반환)
    expect(screen.queryByText('데이터 불러오는 중...')).not.toBeInTheDocument();
  });
});
```

### 패턴 3: Next.js 라우터 모킹 (useRouter Mocking)

Next.js의 라우터를 의존하는 컴포넌트(`next/navigation`, `next/router`)를 테스트할 때 발생하는 에러를 방지합니다.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GoBackButton from './GoBackButton';

// next/navigation 모듈 전체를 가짜(Mock)로 대체합니다.
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

import { useRouter } from 'next/navigation';

describe('GoBackButton Component', () => {
  it('클릭 시 router.back() 함수가 호출되어야 한다', async () => {
    const user = userEvent.setup();
    // 가짜 router 객체 생성
    const mockBack = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });

    render(<GoBackButton />);

    // 버튼 클릭 시뮬레이션
    await user.click(screen.getByRole('button', { name: /뒤로 가기/i }));

    // mockBack 함수가 1번 호출되었는지 검증
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
```

### 패턴 4: Three.js / Canvas 렌더링 무력화 (Mocking)

`InteractiveCardCanvas.tsx`처럼 3D 렌더링이 포함된 복잡한 컴포넌트를 테스트할 때, 무거운 WebGL 렌더링을 건너뛰고 껍데기만 테스트하는 방법입니다.

```tsx
import { render, screen } from '@testing-library/react';
import HeroSection from './HeroSection';

// Three.js 캔버스 컴포넌트 자체를 가짜 HTML <div> 태그로 통째로 덮어씌웁니다.
jest.mock('./InteractiveCardCanvas', () => {
  return function DummyCanvas() {
    return <div data-testid='mock-3d-canvas'>3D 렌더링 건너뜀</div>;
  };
});

describe('HeroSection Component', () => {
  it('Hero 텍스트와 3D 캔버스 영역이 에러 없이 렌더링되어야 한다', () => {
    render(<HeroSection />);

    // 일반 텍스트 렌더링 정상 여부 확인
    expect(screen.getByText(/Creative Developer/i)).toBeInTheDocument();

    // 3D 캔버스 영역이 가짜(Mock) 컴포넌트로 에러 없이 대체되었는지 확인
    expect(screen.getByTestId('mock-3d-canvas')).toBeInTheDocument();
  });
});
```
