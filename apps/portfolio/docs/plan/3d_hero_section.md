# PRD & 구현 계획: 3D 인터랙티브 Hero Section (사원증 카드)

---

## 1. 개요 (Overview)

`apps/portfolio` 프로젝트의 메인 진입점인 `HeroSection`의 우측 이미지 슬롯을 기존 정적 이미지에서 인터랙티브한 3D 물리 기반 사원증(ID Card) 모델로 교체한 작업의 PRD 및 구현 계획서입니다.

참고 프로젝트(`fattahmaulana/3D_CARD`)의 물리 엔진과 3D 렌더링 방식을 차용하여 사용자에게 강렬하고 동적인 첫인상을 제공합니다.

---

## 2. 화면 및 UX 설명 (Visual & UX Details)

- **레이아웃 배치**:
  - 화면 좌측: 기존과 동일하게 소개 텍스트, 타이포그래피, CTA(Call to Action) 버튼들이 위치합니다.
  - 화면 우측 (이미지 슬롯): 단조로운 2D 이미지가 아닌, 3D 공간(Canvas)이 렌더링됩니다.
- **3D 시각 요소**:
  - 화면 상단에 고정된 랜야드(목걸이 줄)에 매달려 있는 형태의 3D 사원증/명찰이 렌더링됩니다.
  - 플라스틱, 메탈 클립, 랜야드 천 소재의 질감이 사실적으로 표현됩니다 (빛 반사, 그림자 등).
- **사용자 상호작용 (Interaction)**:
  - **마우스 호버**: 카드 위로 마우스를 올리면 커서가 `grab` 아이콘으로 변경되며 상호작용 가능함을 암시합니다.
  - **드래그 앤 드롭**: 카드를 클릭한 상태로 마우스를 움직이면(드래그) 실제 물리 법칙이 적용되어 줄이 당겨지며 카드가 마우스를 따라옵니다.
  - **물리 시뮬레이션**: 드래그를 놓으면 중력과 줄의 탄성에 의해 카드가 자연스럽게 흔들리며 제자리로 돌아갑니다.

---

## 3. 기술 스택 및 에셋

### 의존성 (Dependencies)

- **Three.js**: WebGL 기반 3D 렌더링 코어 라이브러리
- **@react-three/fiber**: React 환경에서 Three.js를 선언적으로 다루기 위한 렌더러
- **@react-three/drei**: 3D 모델 로딩, 조명, 환경 설정 등을 돕는 유틸리티 라이브러리
- **@react-three/rapier**: React Three Fiber를 위한 고성능 3D 물리 엔진 라이브러리 (중력, 충돌, 조인트 연결 처리)
- **meshline**: 랜야드(목걸이 줄)와 같이 두께가 있는 선을 부드럽게 렌더링하기 위한 확장 라이브러리

### 필요 에셋 (Assets)

| 에셋           | 소스                                  | 목적지                         |
| -------------- | ------------------------------------- | ------------------------------ |
| 3D 모델 (.glb) | `tmp/3D_CARD/public/assets/kartu.glb` | `public/assets/3d/ID-Card.glb` |
| 랜야드 텍스처  | `tmp/3D_CARD/public/assets/bandd.png` | `public/assets/3d/Lanyard.png` |

---

## 4. 컴포넌트 구조 (Component Architecture)

### 1. HeroSection 컴포넌트 수정

- 우측 이미지 영역을 감싸는 컨테이너를 `relative`, `w-full`, `h-full` 상태로 구성합니다.
- **지연 로딩 (Lazy Loading)**: 3D 렌더링 라이브러리는 SSR 환경에서 에러를 유발할 수 있으므로 `next/dynamic`으로 `{ ssr: false }` 처리합니다.
- **등장 애니메이션**: 3D 모델의 초기 생성 좌표(RigidBody의 Y축 위치)를 화면 밖 위쪽 공간으로 설정하여, 로드 완료 시 물리 엔진의 중력을 받아 자연스럽게 아래로 떨어집니다.

### 2. InteractiveCardCanvas 컴포넌트 (신규)

- `@react-three/fiber`의 `<Canvas>` 컴포넌트를 렌더링합니다.
- `<Environment>`, `<ambientLight>`, `<Lightformer>` 등을 배치하여 부드러운 배경과 금속 재질의 사실적인 반사광을 설정합니다.
- `<Physics>` 태그로 물리 엔진 공간을 생성하고, 그 내부에 실제 카드 요소인 `<Band>` 컴포넌트를 렌더링합니다.

### 3. Band (물리적 연결체) 컴포넌트 (신규)

- **물리 강체 (RigidBody)**: 랜야드의 시작점(fixed)과 중간 조인트들(j1, j2, j3), 카드 본체(card)를 각각 독립된 RigidBody로 선언합니다.
- **조인트 (Joints)**: `useRopeJoint`(로프 관절)와 `useSphericalJoint`(구체 관절)를 사용하여 강체들을 연결합니다.
- **인터랙션 바인딩**: 3D 카드 모델 오브젝트에 `onPointerDown`, `onPointerUp`, `onPointerMove` 이벤트를 할당합니다.
- **MeshLine 시각화**: 매 프레임(`useFrame`)마다 보이지 않는 물리 조인트들의 위치를 추적하여 부드러운 곡선(CatmullRomCurve3)을 계산하고, 이를 기반으로 랜야드 끈(MeshLine)을 시각적으로 렌더링합니다.

---

## 5. 구현 단계별 완료 현황

| Step     | 내용                                                                            | 상태 |
| -------- | ------------------------------------------------------------------------------- | ---- |
| Step 1   | 의존성(Dependencies) 설치                                                       | ✅   |
| Step 2   | 3D 에셋(Assets) 마이그레이션                                                    | ✅   |
| Step 3   | `Band.tsx` 생성 (물리 조인트 및 랜야드 렌더링)                                  | ✅   |
| Step 4   | `InteractiveCardCanvas.tsx` 생성 (3D Canvas 및 환경 구성)                       | ✅   |
| Step 5   | 성능 최적화 및 UX 개선 (Suspense, 반응형 FOV, dpr 설정)                         | ✅   |
| Step 5.1 | 렌더링 안정화 및 해상도 왜곡 수정 (Suspense↔Physics 순서, MeshLine resolution) | ✅   |
| Step 6   | `HeroSection.tsx` 에 적용 (next/dynamic 활용, Debounce 리사이즈)                | ✅   |
| Step 6.1 | ResizeObserver 도입 (100% 무결점 리사이즈 방어)                                 | ✅   |
| Step 7   | 테스트 및 폴리싱 (FOV 조정, 바운스 파라미터, ErrorBoundary)                     | ✅   |
| Step 8   | 디테일 폴리싱 (조명, Clipping 방지, 패럴랙스 오차 수정, Fallback 싱크)          | ✅   |
| Step 8.1 | 모바일 카드 크기 재조정 (FOV 25 고정, 컨테이너 높이 80vw)                       | ✅   |
| Step 9   | 3D 캔버스 스크롤 연동 (Fade & Translate, 커스텀 커서 'DRAG' 힌트)               | ✅   |
| Step 10  | 코드 퀄리티 고도화 (any 타입 제거, 상세 주석 추가)                              | ✅   |
| Step 11  | 랜야드 시각적 렌더링 한계 극복 (가림막 Cap 렌더링 추가)                         | ✅   |

### 보류 항목

- **곡선 렌더링(Lerp) 로직 동기화**: `j3` 위치 업데이트 방식과 렌더링 커브의 텐션 조절 — 부자연스러워 보류됨.
- **카드 회전(Flip) 물리 효과 강화**: 드래그 후 놓았을 때 카드가 역동적으로 뒤집어지도록 각속도(Angular Velocity) 조절 — 미완.

---

## 6. 성능 최적화 및 주의사항

- **에셋 압축**: 3D 모델(.glb)은 Draco 압축 등을 통해 파일 용량을 최소화하여 초기 로딩 속도 저하를 방지합니다.
- **동적 로딩 (SSR 우회)**: 3D Canvas 및 브라우저 API에 의존하는 물리 엔진 코드는 반드시 클라이언트 측 컴포넌트로만 작동하게 처리해야 합니다 (`'use client'` 및 동적 임포트).
- **반응형 디자인**: 모바일에서 FOV를 `25`로 고정하고 컨테이너 높이를 `80vw`로 설정하여 카드가 잘리지 않도록 합니다.

---

## 7. 코드 작성 가이드라인 (향후 유지보수 기준)

- **상세한 주석 작성**: 물리 강체(RigidBody)의 생성 목적, 각 조인트가 연결되는 원리, 마우스 좌표 변환 수식, MeshLine 곡선 계산 파트에 어떤 물리 조인트 위치를 참조하는지 주석으로 명시합니다.
- **상수화**: 마찰력, 중력 값, 로프 길이 등의 물리 파라미터는 매직 넘버로 방치하지 않고 상단에 변수로 빼내어 명시적인 주석을 추가합니다.

---

## 8. 보완 필요 사항 (추후 고려)

- **폴백 UI (Fallback UI)**: WebGL을 지원하지 않는 브라우저나 낮은 사양의 기기에서 3D 렌더링 중 크래시가 날 경우, Error Boundary를 통해 기존 2D 프로필 이미지를 띄워주는 대비책.
- **웹 접근성 (Accessibility / a11y)**: 3D `<Canvas>` 내부는 스크린 리더가 해석하지 못하므로, Canvas 컨테이너에 `aria-label`이나 숨겨진 `<span>` 텍스트로 대체 설명을 제공해야 합니다.
