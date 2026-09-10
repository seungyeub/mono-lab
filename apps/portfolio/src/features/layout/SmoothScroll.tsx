'use client';

import { ReactNode, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  /*
    matchMedia를 마운트 시 한 번만 읽으면 사용자가 도중에 동작 줄이기를 켜도 관성
    스크롤이 계속 돈다. useReducedMotion은 변화를 구독하므로 의존성으로 두면
    설정이 바뀔 때 effect가 다시 실행되어 Lenis가 정리된다.
  */
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // 동작 줄이기 사용자에게는 관성 스크롤도 부담이라 기본 스크롤을 그대로 둔다
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // 예약된 프레임을 취소하지 않으면 destroy 후에도 raf 반복이 남는다
    let frameId = 0;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
