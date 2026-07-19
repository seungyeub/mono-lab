'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function StoryAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });
  const [phase, setPhase] = useState<'enter' | 'pulse' | 'explode'>('enter');

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
        animate={
          phase === 'enter'
            ? { x: 0, scale: 1, opacity: 1 }
            : phase === 'pulse'
            ? { x: 0, scale: [1, 1.8, 1], opacity: 1 }
            : { x: 0, scale: 0, opacity: 0 }
        }
        transition={
          phase === 'enter'
            ? { duration: 1.2, ease: [0.16, 1, 0.3, 1] } // Custom spring-like ease
            : phase === 'pulse'
            ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.2 }
        }
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
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos((i * 30 * Math.PI) / 180) * (Math.random() * 100 + 100),
                y: Math.sin((i * 30 * Math.PI) / 180) * (Math.random() * 100 + 100),
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 1 + Math.random() * 0.5, ease: 'easeOut' }}
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
