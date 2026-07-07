# Decision Log

> 프로젝트에서 내린 중요한 결정을 기록합니다.

---

## 2026-05-19

### Decision

기존 `portfolio` 프로젝트를 수정하지 않고, `mono-lab` 이라는 새 프로젝트로 처음부터 시작한다.

### Reason

기존 프로젝트(`/100__Github_seungyeub/portfolio/`)는 Helios 레퍼런스와 구조적으로 차이가 크고 라이트 테마 기반이었다. 다크 테마 수정, 스크롤 애니메이션 `once` 설정 변경 등을 시도했지만, 인프라(모노레포, CI/CD 등)가 미비한 상태에서 부분 수정보다 올바른 기반 위에서 새로 시작하는 것이 완성도와 기술 역량 어필 측면에서 유리하다고 판단했다.

### Alternatives

기존 `portfolio` 프로젝트를 점진적으로 수정하는 방식

### Status

- Accepted

---

## 2026-05-19

### Decision

Turborepo + pnpm 기반의 모노레포 구조를 도입하고, 인프라 템플릿(`frontend-foundation`)과 포트폴리오(`mono-lab`)를 별도 레포로 분리한다.

### Reason

취업 포트폴리오로서 모노레포 구축 경험과 빌드 시스템(Turborepo) 최적화 경험을 어필할 수 있다. 단일 프로젝트보다 확장성 있는 아키텍처를 설계할 줄 안다는 것을 증명할 수 있다. 또한 `frontend-foundation` 템플릿은 향후 모든 사이드 프로젝트의 시작점이 된다.

### Alternatives

단일 Next.js 프로젝트로 시작하는 방식 (더 간단하지만 기술 어필 부족)

### Status

- Accepted

---

## 2026-05-19

### Decision

TanStack Query(React Query)는 도입하지 않고, Zustand만 사용한다.

### Reason

포트폴리오/에이전시 소개 사이트는 서버 상태(API 캐싱, 비동기 데이터 페칭)가 거의 없다. Zustand로 UI 상태(커서 타입, 메뉴, 페이지 트랜지션 상태)만 관리하면 충분하다. TanStack Query는 다른 프로젝트에서 활용하는 것이 더 적합하다.

### Alternatives

TanStack Query + Zustand 동시 사용

### Status

- Accepted

---

## 2026-06-09

### Decision

HeroSection의 정적 이미지 슬롯을 3D 인터랙티브 카드(`InteractiveCardCanvas`)로 대체한다.

### Reason

단순 정적 이미지보다 Three.js 기반 3D 인터랙션이 기술 역량 어필에 훨씬 효과적이다. React Three Fiber, 3D 모델(`ID-Card.glb`), 텍스처(`Lanyard.png`) 활용 경험을 포트폴리오에 자연스럽게 녹여낼 수 있다.

### Alternatives

정적 이미지(`/images/hero.jpg`) 유지

### Status

- Accepted

---

## 2026-06-20

### Decision

Zod v4를 v3.23.8로 롤백하고, `@hookform/resolvers`도 v3.9.1로 다운그레이드한다.

### Reason

Zod v4와 Next.js Turbopack 간의 `zod/v4/core` Module Not Found 에러가 발생했다. 로컬 및 CI 빌드 안정화를 위해 검증된 구버전으로 롤백했다.

### Alternatives

Zod v4를 유지하면서 Turbopack 설정을 수동으로 패치하는 방식 (불확실성이 높아 채택하지 않음)

### Status

- Accepted

---

## 2026-06-21

### Decision

Skills Section 아이콘은 `@icons-pack/react-simple-icons` 패키지를 기본으로 사용하고, 미지원 아이콘 7개(AWS, MSSQL, Playwright, Slack, OpenAI, Zustand, Antigravity)는 커스텀 SVG 파일로 `public/icons/` 에서 관리한다.

### Reason

`simple-icons` 패키지만으로는 50개 항목 전체를 커버할 수 없음을 확인했다. `customIconPath` prop을 통해 `<img>` 태그로 렌더링하는 방식은 패키지 의존성 없이 유연하게 관리할 수 있어, 두 방식을 병행하는 것이 가장 현실적이다.

### Alternatives

모든 아이콘을 SVG 파일로 관리하고 패키지 전체 제거 (관리 비용 증가)

### Status

- Accepted

---

## 2026-06-21

### Decision

Skills Section은 Grid + Chips 두 가지 레이아웃, Mono + Brand + Interactive 세 가지 색상 모드를 동시에 구현하여 사용자가 직접 비교한 후 최종 선택한다.

### Reason

레퍼런스 사이트 분석 결과 두 가지 표현 방식이 각각 장단점이 있었다. 말로 설명하는 것보다 실제로 구현해서 보여줘야 판단이 가능하다. 임시 비교 토글 UI를 달아두고 Phase 4에서 최종 결정 후 미선택 코드를 정리한다.

### Alternatives

기획 단계에서 하나만 선택해 구현 (비교 불가, 선택의 확신이 낮음)

### Status

- Accepted (Phase 4에서 최종 확정 예정)

---

## 2026-06-21

### Decision

Skills Section 헤딩은 정적 `<h2>Skills.</h2>` 로 표시한다. WordRoller 애니메이션을 사용하지 않는다.

### Reason

`WorksSection` 의 `"Works."` 헤딩과 동일한 패턴을 유지하여 시각적 일관성을 확보한다. 기존 포트폴리오의 에디토리얼 디자인 무드를 해치지 않는다.

### Alternatives

WordRoller 텍스트 롤링 애니메이션 적용 (HeroSection과 유사한 방식)

### Status

- Accepted
