'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Marquee from '@/src/components/Marquee';
import Link from 'next/link';
import { useCursorStore } from '@/src/store/useCursorStore';

const MARQUEE_ITEMS = [
  'Art Direction',
  'Branding',
  'Strategy',
  'Visual Design',
  'Logo Design',
  'Brand Identity',
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

  // 우측 이미지는 반대 방향 — 살짝 아래로 (패럴랙스 분리)
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* ── 상단 헤더 여백 ── */}
      <div className="pt-24 md:pt-28" />

      {/* ── 2단 메인 그리드 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[75vh] px-4 md:px-8">

        {/* LEFT — 타이포그래피 */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="flex flex-col justify-between py-8 md:py-12 pr-0 md:pr-12"
        >
          {/* 상단 메타 */}
          <div className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.18em] text-white/40 font-medium">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Based in Seoul, 한국
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Logo / Brand Designer
            </motion.span>
          </div>

          {/* 메인 헤드라인 */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="text-[clamp(2rem,5.5vw,5rem)] font-medium tracking-tight leading-[1.08] mt-8"
          >
            Crafting Identities and Systems that Define and Build a Lasting Brand. イメージ.
          </motion.h1>

          {/* CTA 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10"
          >
            <Link
              href="/contact"
              onMouseEnter={() => setCursorType('pointer')}
              onMouseLeave={() => setCursorType('default')}
              className="inline-block border border-white/60 rounded-full px-8 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              Contact
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT — 이미지 슬롯 (parallax) */}
        <motion.div
          style={{ y: imgY }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative w-full h-[55vw] md:h-auto md:min-h-[500px] overflow-hidden"
        >
          {/* 이미지 영역 — 나중에 실제 이미지로 교체 */}
          <div
            className="absolute inset-0 bg-[#1a1a1a] bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero.jpg')" }}
          >
            {/* 이미지 없을 때 placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/10 text-xs uppercase tracking-widest">
                hero image · /images/hero.jpg
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 하단 Marquee 띠 ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-8 md:mt-12"
      >
        <Marquee
          items={MARQUEE_ITEMS}
          speed={50}
          textClassName="text-white/70"
        />
      </motion.div>
    </section>
  );
}
