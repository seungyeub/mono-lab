'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useCursorStore } from '@/src/store/useCursorStore';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import RollingLink from '@/src/components/RollingText/RollingLink';
import Marquee from '@/src/components/Marquee';
import dynamic from 'next/dynamic';

const InteractiveCardCanvas = dynamic(() => import('./components/InteractiveCardCanvas'), {
  ssr: false,
});

const MARQUEE_ITEMS = [
  'Precision',
  'Engineering',
  'Interface',
  'Interaction',
  'Systems',
  'Motion',
  'Clarity',
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const setCursorType = useCursorStore((s) => s.setType);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // 좌측 타이포는 스크롤 시 위로 밀려 사라짐
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const pointerEvents = useTransform(scrollYProgress, (v) => (v > 0.6 ? 'none' : 'auto'));

  return (
    <section
      ref={containerRef}
      className='relative w-full min-h-8/12 md:min-h-auto flex flex-col gap-6 md:gap-16 pb-6 md:pb-10 overflow-hidden'
    >
      {/* ── 2단 메인 그리드 (상단 자연 흐름 배치) ── */}
      <div className='w-full'>
        <div className='site-container px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-0 w-full'>
          {/* LEFT — 타이포그래피 */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className='flex flex-col py-8 md:py-12 pr-0 md:mr-[-4px] gap-8 bg-transparent col-start-1 row-start-1 z-10 pointer-events-none md:pointer-events-auto'
          >
            {/* 상단 메타 */}
            <div className='hidden md:flex flex-col gap-1 text-[11px] uppercase tracking-[0.18em] text-white/40 font-medium mt-8'>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                FRONT-END DEVELOPER
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                SEUNGYEUB BAEK
              </motion.span>
            </div>

            {/* 메인 헤드라인 */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className='mt-4 md:mt-12 lg:mt-16 text-[clamp(1.1rem,3.5vw,3rem)] font-semibold md:font-bold leading-[1.2]'
            >
              명확함과 정교함, 그리고
              <br />
              분명한 의도를 바탕으로
              <br />
              인터페이스와 시스템을 구축하는
              <br />
              엔지니어 백승엽 입니다.
            </motion.h1>

            {/* CTA 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className='hidden sm:block md:mt-10 lg:mt-16 pointer-events-auto'
            >
              <div className='relative'>
                <RollingLink
                  href='/contact'
                  onMouseEnter={() => setCursorType('pointer')}
                  onMouseLeave={() => setCursorType('default')}
                  text='Contact'
                  textClassName='font-bold tracking-tight'
                  className='inline-block border-2 border-white rounded-full px-5 py-2 text-[16px] md:text-[23px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300'
                />
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — 이미지 슬롯 (parallax & fade matching left) */}
          <motion.div
            style={{ y: textY, opacity: textOpacity, pointerEvents }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            // 배경이미지(hero.jpg) 및 배경색상 제거, 투명(bg-transparent) 처리하여 로딩 중 여백 연출
            className='relative w-full h-[120vw] sm:h-[96vw] md:h-full md:min-h-[350px] lg:min-h-[400px] rounded-xl bg-transparent col-start-1 row-start-1 md:col-start-2'
          >
            {/* 웹 접근성(a11y) 스크린리더를 위한 대체 텍스트 */}
            <span className='sr-only'>인터랙티브 3D 포트폴리오 사원증 뷰어</span>

            <div className='absolute inset-0'>
              <ErrorBoundary
                fallback={
                  <div className='w-full h-full flex flex-col items-center justify-center bg-black/20 rounded-xl border border-white/10'>
                    <p className='text-white/40 text-sm mb-2'>3D Component Error</p>
                    <div className="w-16 h-16 opacity-50 bg-[url('/images/avatar.jpg')] bg-cover bg-center rounded-full grayscale" />
                  </div>
                }
              >
                <InteractiveCardCanvas />
              </ErrorBoundary>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── 하단 Marquee 띠 ── */}
      <div className='w-full mt-4 md:mt-8'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Marquee
            items={Array.from({ length: 2 }).flatMap(() => MARQUEE_ITEMS)}
            speed={100}
            textClassName='text-white/70'
          />
        </motion.div>
        <div className='mt-12 md:mt-16 h-px w-full bg-[#bbbbbb]/20' />
        <div className='mt-0.5 h-px w-full bg-[#bbbbbb]/20' />
      </div>
    </section>
  );
}
