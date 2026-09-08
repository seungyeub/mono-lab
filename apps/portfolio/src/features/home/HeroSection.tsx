'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useCursorStore } from '@/store/useCursorStore';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import RollingLink from '@/components/RollingText/RollingLink';
import Marquee from '@/components/Marquee';
import dynamic from 'next/dynamic';

/**
 * 3D 캔버스가 뜨기 전에 자리를 지키는 정적 플레이스홀더.
 * three.js + rapier 번들(전송 약 1.1MB, 실행 약 5초)이 하이드레이션 직후 메인 스레드를
 * 잡으면 첫 화면 텍스트가 그려지지 못해 LCP가 13초까지 밀렸다(P3-11 Lighthouse 실측).
 * 캔버스 마운트를 브라우저가 한가해진 뒤로 미루고, 그동안은 이 블록을 보여준다.
 */
function CardPlaceholder() {
  return (
    <div className='border-line flex h-full w-full items-center justify-center rounded-xl border bg-black/20'>
      <div className="h-16 w-16 rounded-full bg-[url('/images/avatar.jpg')] bg-cover bg-center opacity-50 grayscale" />
    </div>
  );
}

const InteractiveCardCanvas = dynamic(() => import('./components/InteractiveCardCanvas'), {
  ssr: false,
  // idle 이후 청크를 받는 동안에도 같은 자리를 지킨다 — 기본 fallback은 null이라 영역이 비어 보인다
  loading: () => <CardPlaceholder />,
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

  // 캔버스는 LCP가 끝나고 메인 스레드가 비었을 때 올린다.
  // requestIdleCallback은 Safari에 없어 setTimeout으로 대체하고, 바쁜 페이지에서
  // 무한정 기다리지 않도록 timeout을 둔다.
  // 동작 줄이기 사용자에게는 흔들리는 3D 카드 대신 정적 플레이스홀더를 그대로 둔다
  const prefersReducedMotion = useReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);
  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setCanvasReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setCanvasReady(true), 200);
    return () => window.clearTimeout(id);
  }, []);

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
            <div className='text-label tracking-label mt-8 hidden flex-col gap-1 font-medium text-white/40 uppercase md:flex'>
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

            {/* 메인 헤드라인 — 이 h1이 LCP 요소다.
                opacity를 0에서 시작하면 JS가 하이드레이션돼 페이드를 끝낼 때까지 "그려지지 않은"
                것으로 잡혀 LCP가 13~15초까지 밀렸다(P3-11 실측). 텍스트는 첫 페인트부터 보이게 두고
                위로 올라오는 움직임만 남긴다 — transform은 LCP 판정에 영향이 없다. */}
            <motion.h1
              initial={{ y: 40 }}
              animate={{ y: 0 }}
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
                  <div className='border-line flex h-full w-full flex-col items-center justify-center rounded-xl border bg-black/20'>
                    <p className='mb-2 text-sm text-white/40'>3D Component Error</p>
                    <div className="h-16 w-16 rounded-full bg-[url('/images/avatar.jpg')] bg-cover bg-center opacity-50 grayscale" />
                  </div>
                }
              >
                {canvasReady && !prefersReducedMotion ? (
                  <InteractiveCardCanvas />
                ) : (
                  <CardPlaceholder />
                )}
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
      </div>
    </section>
  );
}
