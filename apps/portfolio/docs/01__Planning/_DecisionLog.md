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

- Accepted — Phase 4에서 **Chips 레이아웃 + Brand 색상 모드**로 최종 확정 (2026-06-23). `SkillGrid` 컴포넌트 및 비교 토글 UI 제거 완료.

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

---

## 2026-07-20

### Decision

Footer 캐러셀을 기존 정적 프로젝트 이미지(`next/image`)에서 외부 GIF 기반 무한 스크롤 갤러리로 전환한다. `awesome-web-styling` 레포지토리의 81개 GIF를 CDN으로 로드한다.

### Reason

포트폴리오 하단의 에필로그 영역에 과거 웹 스타일링 아카이브의 GIF들을 활용하면 기술적 다양성을 시각적으로 증명할 수 있다. 외부 GIF 특성상 Next.js 이미지 최적화가 불필요하여 일반 `<img>` 태그로 전환했고, CLS 방지를 위해 명시적 `width`/`height`를 설정했다.

### Alternatives

정적 프로젝트 썸네일 이미지를 유지하는 방식

### Status

- Accepted

---

## 2026-07-20

### Decision

커스텀 커서 상태 체계를 `'default' | 'view' | 'grab' | 'pointer'`로 통일하고, 3D 카드 영역의 마이크로카피를 `Drag`에서 `Grab`으로 변경한다.

### Reason

물리 엔진(Rapier)이 적용된 3D 객체의 인터랙션 UX에서 `DRAG`보다 `GRAB`이 '만질 수 있는 사물'이라는 몰입감을 더 잘 전달한다. 또한 기존에 산발적이던 커서 상태 타입을 4개로 통일하고 `useMotionValue` 도입으로 마우스 좌표 렌더링을 최적화했다.

### Alternatives

`PULL` (당기다) — 물리적 장력을 강조하지만 직관성에서 `GRAB`보다 열세

### Status

- Accepted

---

## 2026-08-18

### Decision

ExperienceSection의 `stack` 속성명을 `type`으로 변경하고, 하드코딩된 그리드 스타일을 공용 테마 토큰(`lg:grid-cols-experience`)으로 대체한다.

### Reason

`stack`은 기술 스택을 연상시키지만 실제 데이터는 직무 형태(Co-Founder, Junior, Contractor 등)를 나타내므로 `type`이 의미적으로 정확하다. 또한 `lg:grid-cols-[2fr_2fr_2fr_1fr]`이 여러 곳에 반복되어 있어 유지보수성을 위해 Tailwind 테마 토큰으로 추출했다 (CodeRabbit 리뷰 반영).

### Alternatives

`role`이나 `position` 등 다른 속성명 — 기존 `role` (Frontend Engineer 등)과 의미 충돌

### Status

- Accepted
