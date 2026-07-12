'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import Band from './Band';

export default function InteractiveCardCanvas() {
  return (
    <div className='h-full w-full touch-none'>
      {/* ── [3D 캔버스 초기 셋업] ──
          camera: 데스크탑/모바일 전 구간에서 fov: 20으로 고정하여 사원증을 크고 왜곡 없이 렌더링합니다.
          dpr: 레티나 디스플레이 등 고해상도 환경을 위해 기기 픽셀 비율(1~1.5)을 유동적으로 대응합니다. */}
      <Canvas camera={{ position: [0, 0, 13], fov: 20 }} dpr={[1, 1.5]}>
        <ambientLight intensity={Math.PI} />
        {/* ── [물리 엔진 환경 셋업 (Rapier)] ──
            gravity: [0, -40, 0]으로 강한 중력을 설정하여 초기 낙하 속도를 높이고 무거운 사원증의 물리적 느낌을 살립니다.
            timeStep: 초당 60프레임(1/60) 기준으로 물리 연산을 고정하여 브라우저 주사율에 따른 시뮬레이션 오차를 줄입니다. */}
        <Suspense fallback={null}>
          <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
            <Band />
          </Physics>
        </Suspense>

        {/* [Mandatory Comment] Canvas의 투명한 배경을 완벽하게 유지하고
            Three.js의 'Unknown color: transparent' 경고를 방지하기 위해,
            Environment의 background 속성과 <color> 태그를 완전히 제거했습니다. */}
        <Environment blur={0.8} resolution={256}>
          {/* 스튜디오 프리미엄 조명 세팅 */}
          <Lightformer
            intensity={3}
            color='white'
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={5}
            color='white'
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
          {/* 추가 엣지 라이트 (금속 클립 반사광 강화) */}
          <Lightformer
            intensity={4}
            color='white'
            position={[10, 5, 5]}
            rotation={[0, -Math.PI / 2, Math.PI / 3]}
            scale={[50, 5, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}
