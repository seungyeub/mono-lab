'use client';

import * as THREE from 'three';
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RapierRigidBody
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { useCursorStore } from '@/src/store/useCursorStore';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: React.JSX.IntrinsicElements['bufferGeometry'];
    meshLineMaterial: React.JSX.IntrinsicElements['material'] & {
      resolution?: [number, number];
      useMap?: number;
      lineWidth?: number;
      color?: string;
      map?: THREE.Texture;
      repeat?: [number, number];
      depthTest?: boolean;
    };
  }
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
}

export default function Band({ maxSpeed = 50, minSpeed = 10 }: BandProps) {
  const band = useRef<THREE.Mesh>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const setCursorType = useCursorStore((state) => state.setType);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = { type: 'dynamic' as const, canSleep: true, colliders: false as const, angularDamping: 2, linearDamping: 2 };

  const gltf = useGLTF('/assets/3d/ID-Card.glb');
  const cardMesh = gltf.nodes.card as THREE.Mesh;
  const clipMesh = gltf.nodes.clip as THREE.Mesh;
  const clampMesh = gltf.nodes.clamp as THREE.Mesh;
  const baseMaterial = gltf.materials.base as THREE.MeshStandardMaterial;
  const metalMaterial = gltf.materials.metal as THREE.MeshStandardMaterial;

  const texture = useTexture('/assets/3d/Lanyard.png') as THREE.Texture;
  const get = useThree((state) => state.get);
  const materialRef = useRef<MeshLineMaterial>(null);

  const [initialResolution] = useState<[number, number]>(() => {
    const { size, viewport } = get();
    if (size.width >= 768) {
      return [1000, 1500];
    }
    return [size.width * viewport.dpr, size.height * viewport.dpr];
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const parentElement = get().gl.domElement.parentElement;

    if (!parentElement) return;

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (materialRef.current) {
          const { size, viewport } = get();
          materialRef.current.resolution.set(size.width * viewport.dpr, size.height * viewport.dpr);
        }
      }, 200);
    });

    resizeObserver.observe(parentElement);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeout);
    };
  }, [get]);

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  ]));

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);

  const j1Lerped = useRef(new THREE.Vector3());
  const j2Lerped = useRef(new THREE.Vector3());

  // ── [물리 엔진 관절(Joint) 세팅] ──
  // 랜야드(목걸이 줄)를 구성하기 위해 각각의 강체(RigidBody)를 줄 형태로 연결합니다.
  // fixed: 상단의 고정점 (천장에 매달린 역할)
  // j1, j2, j3: 줄을 이루는 관절들
  // card: 맨 아래에 매달리는 사원증(카드) 강체
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  // 사원증과 마지막 줄 관절은 구면 관절(Spherical Joint)로 연결하여 360도로 자유롭게 회전할 수 있게 합니다.
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  // ── [프레임 단위 렌더링 로직 (useFrame)] ──
  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    const fixedRef = fixed.current;
    const j1Ref = j1.current;
    const j2Ref = j2.current;
    const j3Ref = j3.current;
    const cardRef = card.current;
    const bandRef = band.current;

    if (fixedRef && j1Ref && j2Ref && j3Ref && cardRef && bandRef) {
      const j1TransObj = j1Ref.translation();
      const j2TransObj = j2Ref.translation();
      const j3TransObj = j3Ref.translation();
      const fixedTransObj = fixedRef.translation();

      const j1Trans = new THREE.Vector3(j1TransObj?.x ?? 0, j1TransObj?.y ?? 0, j1TransObj?.z ?? 0);
      const j2Trans = new THREE.Vector3(j2TransObj?.x ?? 0, j2TransObj?.y ?? 0, j2TransObj?.z ?? 0);
      const j3Trans = new THREE.Vector3(j3TransObj?.x ?? 0, j3TransObj?.y ?? 0, j3TransObj?.z ?? 0);
      const fixedTrans = new THREE.Vector3(fixedTransObj?.x ?? 0, fixedTransObj?.y ?? 0, fixedTransObj?.z ?? 0);

      if (j1Lerped.current.lengthSq() === 0) j1Lerped.current.copy(j1Trans);
      if (j2Lerped.current.lengthSq() === 0) j2Lerped.current.copy(j2Trans);

      const dist1 = Math.max(0.1, Math.min(1, j1Lerped.current.distanceTo(j1Trans)));
      j1Lerped.current.lerp(j1Trans, delta * (minSpeed + dist1 * (maxSpeed - minSpeed)));

      const dist2 = Math.max(0.1, Math.min(1, j2Lerped.current.distanceTo(j2Trans)));
      j2Lerped.current.lerp(j2Trans, delta * (minSpeed + dist2 * (maxSpeed - minSpeed)));

      if (curve.points[0]) curve.points[0].copy(j3Trans);
      if (curve.points[1]) curve.points[1].copy(j2Lerped.current);
      if (curve.points[2]) curve.points[2].copy(j1Lerped.current);
      if (curve.points[3]) curve.points[3].copy(fixedTrans);

      const points = curve.getPoints(32);
      (band.current.geometry as MeshLineGeometry).setPoints(points);

      const angObj = cardRef.angvel();
      ang.set(angObj?.x ?? 0, angObj?.y ?? 0, angObj?.z ?? 0);

      const quaternionObj = cardRef.rotation();
      const euler = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion(quaternionObj?.x ?? 0, quaternionObj?.y ?? 0, quaternionObj?.z ?? 0, quaternionObj?.w ?? 1)
      );

      cardRef.setAngvel({ x: ang.x, y: ang.y - euler.y * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          {/* 가림막(Cap): 2D 선과 3D 클립이 만나는 지점(j3 조인트)의 찢어짐을 시각적으로 덮는 역할 */}
          <mesh position={[0, 1.47, 0]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.9} />
          </mesh>
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setCursorType('drag')}
            onPointerOut={() => setCursorType('default')}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              if (card.current) {
                const cardTransObj = card.current.translation();
                const cardTrans = new THREE.Vector3(cardTransObj.x, cardTransObj.y, cardTransObj.z);
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(cardTrans)));
              }
            }}>
            <mesh geometry={cardMesh?.geometry}>
              <meshPhysicalMaterial
                map={baseMaterial?.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.4}
                metalness={0.7}
              />
            </mesh>
            <mesh geometry={clipMesh?.geometry} material={metalMaterial} material-roughness={0.3} />
            <mesh geometry={clampMesh?.geometry} material={metalMaterial} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          ref={materialRef}
          color="white"
          depthTest
          resolution={initialResolution}
          useMap={1}
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
