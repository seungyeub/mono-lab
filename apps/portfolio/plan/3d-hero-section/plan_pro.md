# 3D Hero Section Implementation Plan (plan_pro.md)

이 문서는 `PRD_pro.md`와 실제 코드베이스(`HeroSection.tsx`)를 바탕으로 3D 사원증 인터랙션을 구현하기 위한 단계별 상세 계획입니다. 각 작업 단계를 체크리스트 형태로 관리할 수 있습니다.

## Step 1: 의존성(Dependencies) 설치

- [x] `apps/portfolio` 프로젝트 경로에서 3D 렌더링 및 물리 엔진을 위한 필수 라이브러리들을 설치합니다.
  ```bash
  npm install three @react-three/fiber @react-three/drei @react-three/rapier meshline
  npm install -D @types/three
  ```

## Step 2: 3D 에셋(Assets) 마이그레이션

- [x] 클론해 둔 `tmp/3D_CARD` 레포지토리의 원본 에셋들을 현재 포트폴리오 프로젝트의 `public` 폴더로 복사하고, 직관적인 이름으로 변경합니다.
  - 소스: `tmp/3D_CARD/public/assets/kartu.glb`, `tmp/3D_CARD/public/assets/bandd.png`
  - 목적지: `apps/portfolio/public/assets/3d/ID-Card.glb`, `apps/portfolio/public/assets/3d/Lanyard.png`

## Step 3: 물리 조인트 및 랜야드 렌더링 컴포넌트 (`Band.tsx`) 생성

- [x] `apps/portfolio/src/features/home/components/Band.tsx` 파일을 신규 생성합니다.
- [x] PRD 4항의 주석 정책을 준수하여, 물리 강체와 조인트(로프) 연결에 대한 상세 주석을 작성합니다.
- [x] `useGLTF`와 `useTexture`를 활용해 에셋을 로드하고 `RigidBody`를 세팅합니다.

  ```tsx
  // src/features/home/components/Band.tsx
  'use client';
  import * as THREE from 'three';
  import { useRef, useState, useEffect } from 'react';
  import { useFrame, extend } from '@react-three/fiber';
  import { useGLTF, useTexture } from '@react-three/drei';
  import {
    BallCollider,
    CuboidCollider,
    RigidBody,
    useRopeJoint,
    useSphericalJoint,
  } from '@react-three/rapier';
  import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

  extend({ MeshLineGeometry, MeshLineMaterial });

  export default function Band({ maxSpeed = 50, minSpeed = 10 }) {
    // [Mandatory Comment] 랜야드의 시작점(fixed)과 각 관절들(j1,j2,j3), 카드 본체(card)를 위한 물리 강체(RigidBody) 참조
    const band = useRef(null),
      fixed = useRef(null),
      j1 = useRef(null),
      j2 = useRef(null),
      j3 = useRef(null),
      card = useRef(null);

    // 로드하는 에셋의 경로를 업데이트된 파일명으로 지정합니다.
    const { nodes, materials } = useGLTF('/assets/3d/ID-Card.glb');
    const texture = useTexture('/assets/3d/Lanyard.png');
    // ... (곡선 계산 및 마우스 드래그 좌표 계산 로직 생략) ...

    // [Mandatory Comment] 초기 position을 Y축 4로 설정하여 화면 위쪽 바깥에서 생성.
    // 렌더링 완료 시 물리엔진의 중력을 받아 뷰포트 안으로 자유 낙하(바운스 등장 연출).
    return (
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} type='fixed' />
        {/* 조인트 볼 및 카드 CuboidCollider */}
      </group>
    );
  }
  ```

## Step 4: 3D Canvas 및 환경 구성 컴포넌트 (`InteractiveCardCanvas.tsx`) 생성

- [x] `apps/portfolio/src/features/home/components/InteractiveCardCanvas.tsx` 파일을 신규 생성합니다.
- [x] 조명(`ambientLight`, `Environment`, `Lightformer`)을 세팅하여 금속 반사광과 스튜디오 환경을 구성합니다.
- [x] 물리 시뮬레이션 환경을 위해 `<Physics>` Provider로 `Band` 컴포넌트를 감싸줍니다.

  ```tsx
  // src/features/home/components/InteractiveCardCanvas.tsx
  'use client';
  import { Canvas } from '@react-three/fiber';
  import { Environment, Lightformer } from '@react-three/drei';
  import { Physics } from '@react-three/rapier';
  import Band from './Band';

  export default function InteractiveCardCanvas() {
    return (
      <div className='w-full h-full cursor-grab active:cursor-grabbing'>
        <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
          <ambientLight intensity={Math.PI} />
          {/* 중력값을 아래로 주어 떨어지는 효과 극대화 */}
          <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
            <Band />
          </Physics>
          <Environment background blur={0.75}>
            <color attach='background' args={['transparent']} />
            {/* 스튜디오 조명 세팅 */}
            <Lightformer
              intensity={2}
              color='white'
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color='white'
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Canvas>
      </div>
    );
  }
  ```

## Step 5: 성능 최적화 및 UX 개선 (`InteractiveCardCanvas.tsx` 보완)

- [x] React 18+ 비동기 에러를 방지하기 위해 `Canvas` 내부에 `<Suspense fallback={null}>`을 추가하여 `Band` 컴포넌트를 감쌉니다.
- [x] 모바일 등 화면 폭이 좁은 기기에서 카드가 화면을 벗어나지 않게 `Camera`의 FOV나 스케일을 반응형으로 조절하는 로직(예: 화면 폭 대비 동적 계산)을 적용합니다.
- [x] 저사양 기기에서의 발열 및 프레임 드랍을 막기 위해 `<Canvas dpr={[1, 2]}>` 등 최적화 설정을 추가합니다.
- [x] Canvas 영역의 투명한 여백이 메인 스크롤이나 다른 버튼 클릭 이벤트를 방해하지 않도록 CSS 이벤트(예: `touch-pan-y` 등)를 세밀하게 조정합니다.

## Step 5.1: 렌더링 안정화 및 해상도 왜곡 수정 (Step 10 선행 작업)

- [x] **`<Suspense>`와 `<Physics>` 렌더링 순서 역전**: 3D 모델(`Band`) 로딩이 100% 완료된 시점부터 물리 엔진(Gravity)이 흐르도록, 기존 코드에서 `<Physics>` 내부에 있던 `<Suspense>`를 밖으로 꺼내어 `<Suspense>`가 `<Physics>`를 감싸는 구조로 수정합니다.
- [x] **랜야드 선 두께 해상도 왜곡 수정 (Step 10 당겨오기)**: 고해상도 기기(`dpr={[1, 2]}`)에서 랜야드의 두께가 얇아지거나 변형되는 것을 막기 위해, `Band.tsx`의 `MeshLineMaterial`의 `resolution` 속성을 뷰포트 크기와 기기 픽셀 비율(dpr)을 곱한 물리 픽셀 해상도로 적용하여 굵기를 균일하게 고정합니다. (카메라 FOV 스냅 현상은 수정 없이 기존 로직 유지)

## Step 6: `HeroSection.tsx` 에 적용 (next/dynamic 활용)

- [x] `apps/portfolio/src/features/home/HeroSection.tsx` 파일 내부에 `InteractiveCardCanvas`를 주입합니다.
- [x] 서버 사이드 렌더링 에러를 방지하기 위해 `next/dynamic`으로 `{ ssr: false }` 처리합니다.
- [x] 스피너나 스켈레톤 없이 로딩 시 빈 화면의 여백을 유지하도록 기존 배경 이미지를 걷어냅니다.
- [x] **리사이즈 성능 최적화 (Debounce 적용)**: 윈도우 창 크기를 조절할 때 `Band.tsx` 내부에서 3D 캔버스 해상도를 실시간으로 가져오며 발생하는 수십 번의 무거운 재렌더링과 물리 연산 버그를 막기 위해, 리사이즈가 끝난 후 마지막에 한 번만 값을 갱신하도록 디바운스(Debounce) 로직을 추가로 구현합니다.

  ```tsx
  // src/features/home/HeroSection.tsx 상단
  import dynamic from 'next/dynamic';

  // [Mandatory Comment] 3D 엔진(Window API 의존성)의 SSR 오류 방지 및 '위에서 떨어지는 연출'을 위한 지연 로딩
  const InteractiveCardCanvas = dynamic(() => import('./components/InteractiveCardCanvas'), {
    ssr: false,
  });

  // ... (HeroSection 컴포넌트 내부) ...
  {
    /* RIGHT — 이미지 슬롯 (parallax) */
  }
  <motion.div
    style={{ y: imgY }}
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    // 배경이미지(hero.jpg) 및 배경색상 제거, 투명(bg-transparent) 처리하여 로딩 중 여백 연출
    className='relative w-full h-[55vw] md:h-auto md:min-h-[500px] overflow-hidden rounded-xl bg-transparent'
  >
    {/* 웹 접근성(a11y) 스크린리더를 위한 대체 텍스트 */}
    <span className='sr-only'>인터랙티브 3D 포트폴리오 사원증 뷰어</span>

    <div className='absolute inset-0'>
      <InteractiveCardCanvas />
    </div>
  </motion.div>;
  ```

## Step 6.1: 100% 무결점 리사이즈 방어를 위한 ResizeObserver 도입

- [x] 기존 `window.resize` 이벤트의 감지 사각지대(모바일 메뉴바 숨김, 스크롤바 생성, 화면 회전 등 DOM 내부 레이아웃 밀림 현상)를 원천 차단합니다.
- [x] `Band.tsx` 내의 윈도우 리사이즈 리스너를 제거하고, 3D 캔버스 컨테이너(`gl.domElement.parentElement`) 자체의 크기 변화를 100% 정확하게 추적하는 `ResizeObserver`를 부착(혹은 R3F의 내부 ResizeObserver 상태 직접 구독)합니다.
- [x] 측정된 정확한 픽셀 값을 기존에 구현한 디바운스(Debounce) 로직에 전달하여 업데이트함으로써, 어떠한 극한의 브라우저 환경에서도 사원증 줄 두께나 3D 물리 연산이 깨지지 않도록 완벽하게 방어합니다.

## Step 7: 테스트 및 폴리싱 (Polishing)

- [x] 데스크탑 및 모바일 뷰포트에서 `Canvas` 카메라의 `FOV`(시야각)가 넘치거나 모자라지 않는지 반응형 확인 및 스케일 조정.
- [x] 초기 렌더링 시 낙하 후 발생하는 바운스 애니메이션의 물리적 강도(`gravity`, `linearDamping` 파라미터) 미세 조정.
- [x] 에러 바운더리(Error Boundary)를 별도로 래핑하여 WebGL 크래시 시 2D 폴백 이미지가 뜨는지 테스트.

## Step 8: 디테일 폴리싱 및 추가 이슈 해결 (크기, 줄 길이, 조명 등)

- [x] **조명 디테일 조정**: `ambientLight`와 `Lightformer`의 빛 강도, 각도, 위치를 재조정하여 금속 클립과 플라스틱 재질이 한층 더 고급스럽게 빛나도록 다듬습니다.
- [x] **Clipping(잘림) 방지**: `HeroSection.tsx` 컨테이너의 `overflow-hidden`을 제거하여 카드가 화면 바깥으로 자연스럽게 튀어나오며 흔들리도록 수정합니다.
- [x] **패럴랙스 오차 수정**: 스크롤(`imgY`)로 인해 DOM이 이동할 때, 마우스 3D 드래그 좌표와 실제 커서 위치가 어긋나는 문제를 방지하거나 연출을 최적화합니다.
- [x] **로딩 싱크 및 Fallback**: `ErrorBoundary`를 실제 컴포넌트에 적용하고, DOM 페이드인 시간과 3D 렌더링(낙하) 시작 시간의 싱크가 자연스럽게 맞도록 조정합니다.

## Step 8.1: 모바일 환경 카드 크기 및 비율 재조정 (FOV 및 컨테이너 높이 변경)

- [x] **FOV 값 고정**: `ResponsiveCamera`에서 모바일(768px 미만)일 때 `35`로 줌아웃 하던 로직을 완전히 제거하고, 전 구간에서 데스크탑과 동일하게 `fov: 25`로 고정시켰습니다. (모바일에서도 카드가 더 크고 가깝게 보임)
- [x] **컨테이너 높이(비율) 확대**: `HeroSection.tsx` 내 모바일 캔버스 컨테이너의 높이를 `h-[55vw]`에서 `h-[80vw]`로 대폭 늘렸습니다. 세로 공간이 추가로 확보되면서 고정된 25도의 FOV와 완벽한 시너지를 내어, 모바일 화면에서 카드가 상하로 잘리지 않고 훨씬 크고 존재감 있게 떨어지도록 연출을 고도화했습니다.

## Step 9: 3D 캔버스 스크롤 연동 (Fade & Translate) 및 커서(Cursor) 디자인 원복

- [x] **우측 이미지 슬롯 스크롤 연동**: `HeroSection.tsx`에서 좌측 타이포그래피 영역에 적용된 스크롤 기반 `opacity`(페이드아웃) 및 `y`(위로 이동) `useTransform` 값을 우측 3D 캔버스 래퍼(`motion.div`)에도 동일하게 적용하여 좌우가 통일감 있게 사라지도록 구현합니다.
- [x] **스크롤 잔여 터치 방지**: 3D 캔버스의 `opacity`가 0이 되어 보이지 않게 된 후에는 드래그 등 헛손질이 먹히지 않도록 `pointer-events: none` 처리를 추가하여 쾌적한 스크롤 경험을 보장합니다.
- [x] **커스텀 커서(원형) 원복**: 3D 카드 위로 마우스를 올렸을 때 나타나던 시스템 기본 커서(손바닥 모양)를 제거합니다. `Band.tsx` 내의 `document.body.style.cursor` 강제 주입 로직과 `InteractiveCardCanvas.tsx`의 `cursor-grab` 클래스를 걷어내고, 전역 원형 커서(`CustomCursor.tsx`)가 끊김 없이 유지되도록 복구합니다.
- [x] **커스텀 커서 'DRAG' 힌트(Affordance) 추가**: `useCursorStore` 타입에 `drag`를 추가하고, `CustomCursor.tsx`에서 `drag` 상태일 때 커서를 확장하며 "DRAG" 글씨를 표시하도록 디자인합니다. 이후 `Band.tsx` 내 사원증 렌더링 파트(`onPointerOver` / `onPointerOut`)에 연동하여 사용자에게 직관적인 인터랙션 경험을 제공합니다.

## Step 10: 코드 퀄리티 고도화 및 유지보수성 향상 (타입 정립 및 주석 추가)

- [x] **`any` 타입 제거 및 엄격한 타입 적용**: `Band.tsx` 내부에서 발견된 `useRef<any>`와 같은 불완전한 타입 정의를 찾아, `MeshLineMaterial` 등 정확한 Three.js / 외부 라이브러리 타입으로 안전하게 대체합니다.
- [x] **`Band.tsx` 상세 주석 추가**: 랜야드(줄)를 구성하는 `useRopeJoint`, `useSphericalJoint` 물리 엔진 관절 매커니즘과 `useFrame` 내에서 곡선(Curve)을 업데이트하는 렌더링 로직에 대한 상세한 설명 주석을 추가합니다.
- [x] **`InteractiveCardCanvas.tsx` 상세 주석 추가**: R3F `<Canvas>` 내부의 환경(Environment), 조명(ambientLight, Lightformer), 물리 엔진 Provider(`<Physics>`), 그리고 반응형 FOV 카메라 등 3D 환경 셋업 전반에 대한 동작 원리를 주석으로 상세히 남깁니다.
- [x] **`ErrorBoundary.tsx` 상세 주석 추가**: WebGL 컨텍스트 유실이나 렌더링 크래시 상황을 대비하기 위한 에러 바운더리 클래스의 생명주기(`getDerivedStateFromError`, `componentDidCatch`)와 폴백(Fallback) 처리의 목적을 명확히 주석으로 작성합니다.

## Step 11: 랜야드(줄) 시각적 렌더링 한계 극복 대안 검토 (시각적 트릭)

가장 안정적인 2D `MeshLine` 형태를 유지하되, 3D 클립과 선이 만나면서 발생하는 교차 단면의 깨짐(Jittering)을 숨기기 위한 눈속임 대안을 계획합니다.

- [x] **가림막(Cap) 렌더링 추가 (권장)**: 선과 클립이 만나는 교차점(`j3` 조인트 부근)에 실제 랜야드 마감재처럼 생긴 납작한 사각형(`BoxGeometry`) 형태의 3D 덮개를 렌더링합니다. 2D 선이 3D 클립을 파고드는 지저분한 단면을 넓게 덮어버려 시각적 어색함을 원천 차단합니다.
- [] **연결점(조인트) 위치 뒤로 숨기기**: 선이 끝나는 목표 좌표(`j3`)를 클립의 앞쪽이 아닌 살짝 뒤쪽이나 안쪽 깊숙한 곳(Z축 이동)으로 밀어 넣습니다. 카메라가 정면에서 바라볼 때 클립 쇠 덩어리가 겹치는 틈새를 자연스럽게 가리도록 유도합니다.

## 보류: 적용 고려

- [x] **목걸이 줄 길이 축소**: 랜야드를 구성하는 조인트(Joint) 간격 및 물리 강체 좌표를 조절하여 줄의 전체 길이를 원본(`1`)의 3/4 수준인 `0.75`로 줄여 적용 완료했습니다.
- [] **곡선 렌더링(Lerp) 로직 동기화**: `j1`, `j2`에 적용된 보간(`lerp`) 로직과 렌더링이 즉시 반영되는 `j3` 사이의 시각적 불일치를 해소하기 위해, `j3` 위치 업데이트 방식 또는 렌더링 커브(`CatmullRomCurve3`)의 텐션을 조절하여 이질감 없이 부드럽게 렌더링되도록 개선하려 했으나 부자연스러워 보류됨.
- [] **카드 회전(Flip) 물리 효과 강화**: 드래그 후 놓았을 때 카드가 튀어 오르면서 앞뒤로 조금 더 역동적으로 뒤집어지거나 회전하도록 각속도(Angular Velocity) 또는 관절(Joint) 파라미터를 조절하여 테스트합니다.
