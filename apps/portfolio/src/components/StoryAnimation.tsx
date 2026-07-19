'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// ─────────────────────────────────────────────
// 애니메이션 상수 (SonarCloud: Math.random() 제거)
// ─────────────────────────────────────────────

type Phase = 'enter' | 'pulse' | 'explode';

/** 12개 파티클의 사전 계산된 거리·지속시간 (결정적 값) */
const PARTICLES = [
  { id: 'p-0', distance: 148, duration: 1.22 },
  { id: 'p-1', distance: 167, duration: 1.38 },
  { id: 'p-2', distance: 123, duration: 1.11 },
  { id: 'p-3', distance: 189, duration: 1.45 },
  { id: 'p-4', distance: 134, duration: 1.07 },
  { id: 'p-5', distance: 175, duration: 1.33 },
  { id: 'p-6', distance: 156, duration: 1.19 },
  { id: 'p-7', distance: 142, duration: 1.41 },
  { id: 'p-8', distance: 181, duration: 1.15 },
  { id: 'p-9', distance: 119, duration: 1.28 },
  { id: 'p-10', distance: 163, duration: 1.36 },
  { id: 'p-11', distance: 191, duration: 1.09 },
];

// ─────────────────────────────────────────────
// 중첩 삼항 제거용 헬퍼 함수
// ─────────────────────────────────────────────

function getSparkAnimate(phase: Phase) {
  switch (phase) {
    case 'enter':
      return { x: 0, scale: 1, opacity: 1 };
    case 'pulse':
      return { x: 0, scale: [1, 1.8, 1], opacity: 1 };
    case 'explode':
      return { x: 0, scale: 0, opacity: 0 };
  }
}

function getSparkTransition(phase: Phase) {
  switch (phase) {
    case 'enter':
      // Custom spring-like ease
      return { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const };
    case 'pulse':
      return { duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const };
    case 'explode':
      return { duration: 0.2 };
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function StoryAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });
  const [phase, setPhase] = useState<Phase>('enter');

  useEffect(() => {
    if (isInView) {
      setPhase('enter');
      const pulseTimer = setTimeout(() => setPhase('pulse'), 1200);
      const explodeTimer = setTimeout(() => setPhase('explode'), 2600);
      return () => {
        clearTimeout(pulseTimer);
        clearTimeout(explodeTimer);
      };
    } else {
      setPhase('enter');
    }
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className='relative mt-10 flex h-[250px] w-full items-center justify-center overflow-hidden border-t border-white/5 bg-neutral-950'
    >
      {/* Premium glow background */}
      <motion.div
        animate={{ opacity: phase === 'explode' ? 0.5 : 0.1 }}
        transition={{ duration: 1 }}
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_60%)]'
      />

      {/* The Spark (Dot) */}
      <motion.div
        initial={{ x: '-50vw', scale: 0, opacity: 0 }}
        animate={getSparkAnimate(phase)}
        transition={getSparkTransition(phase)}
        className='absolute z-10 h-2 w-2 rounded-full bg-white'
        style={{ boxShadow: '0 0 20px 6px rgba(255,255,255,0.6)' }}
      />

      {/* The Explosion (Wireframe & Particles) */}
      {phase === 'explode' && (
        <>
          {/* Expanding Square */}
          <motion.div
            initial={{ scale: 0, opacity: 1, rotate: 0 }}
            animate={{ scale: [0, 4, 8], opacity: [1, 0.8, 0], rotate: 90 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className='absolute h-24 w-24 border-[1px] border-white/40'
          />
          {/* Expanding Circle */}
          <motion.div
            initial={{ scale: 0, opacity: 1, rotate: 45 }}
            animate={{ scale: [0, 5, 9], opacity: [1, 0.5, 0], rotate: 135 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.1 }}
            className='absolute h-24 w-24 rounded-full border-[1px] border-white/30'
          />

          {/* Shooting Particles */}
          {PARTICLES.map((particle, i) => (
            <motion.div
              key={particle.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos((i * 30 * Math.PI) / 180) * particle.distance,
                y: Math.sin((i * 30 * Math.PI) / 180) * particle.distance,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: particle.duration, ease: 'easeOut' }}
              className='absolute z-0 h-1 w-1 rounded-full bg-white'
              style={{ boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)' }}
            />
          ))}
        </>
      )}

      {/* Typography Climax */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={
          phase === 'explode'
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 20, filter: 'blur(10px)' }
        }
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        className='absolute bottom-10 z-20 text-[11px] font-medium tracking-[0.4em] text-white/90 uppercase sm:text-xs'
      >
        Ignite Your Vision
      </motion.div>
    </div>
  );
}
