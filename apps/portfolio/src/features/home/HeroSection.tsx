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
      data-testid='hero-section'
      ref={containerRef}
      className='relative flex min-h-8/12 w-full flex-col gap-6 pb-6 md:min-h-0 md:gap-16 md:pb-10'
    >
      {/* ── 2단 메인 그리드 (상단 자연 흐름 배치) ── */}
      <div className='w-full'>
        <div className='site-container grid w-full grid-cols-1 gap-0 px-6 md:grid-cols-2 md:px-12'>
          {/* LEFT — 타이포그래피 */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className='pointer-events-none z-10 col-start-1 row-start-1 flex flex-col gap-8 bg-transparent py-8 pr-0 md:pointer-events-auto md:mr-[-4px] md:py-12'
          >
            {/* 상단 메타 */}
            <div className='mt-8 hidden flex-col gap-1 text-[11px] font-medium tracking-[0.18em] text-white/40 uppercase md:flex'>
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
              className='mt-4 text-[clamp(1.1rem,3.5vw,3rem)] leading-[1.2] font-semibold md:mt-12 md:font-bold lg:mt-16'
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
              className='pointer-events-auto hidden sm:block md:mt-10 lg:mt-16'
            >
              <div className='relative'>
                <RollingLink
                  href='/contact'
                  onMouseEnter={() => setCursorType('pointer')}
                  onMouseLeave={() => setCursorType('default')}
                  text='Contact'
                  textClassName='font-bold tracking-tight'
                  className='inline-block rounded-full border-2 border-white px-5 py-2 text-[16px] tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black md:text-[23px]'
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
            className='relative col-start-1 row-start-1 h-[120vw] w-full rounded-xl bg-transparent sm:h-[96vw] md:col-start-2 md:h-full md:min-h-[350px] lg:min-h-[400px]'
          >
            {/* 웹 접근성(a11y) 스크린리더를 위한 대체 텍스트 */}
            <span className='sr-only'>인터랙티브 3D 포트폴리오 사원증 뷰어</span>

            <div className='absolute inset-0'>
              <ErrorBoundary
                fallback={
                  <div className='flex h-full w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-black/20'>
                    <p className='mb-2 text-sm text-white/40'>3D Component Error</p>
                    <div className="h-16 w-16 rounded-full bg-[url('/images/avatar.jpg')] bg-cover bg-center opacity-50 grayscale" />
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
      <div className='mt-4 w-full md:mt-8'>
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
        <div className='mt-12 h-px w-full bg-white/15 md:mt-16' />
        <div className='mt-0.5 h-px w-full bg-white/15' />
      </div>
    </section>
  );
}
