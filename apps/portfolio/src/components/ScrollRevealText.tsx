'use client';

import { motion, type MotionValue, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, type RefObject } from 'react';

type Align = 'left' | 'center' | 'right';

interface ScrollRevealTextProps {
  lines: string[];
  align?: Align;
  className?: string;
}

const alignClass: Record<Align, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

/**
 * 스크롤 진행도를 재는 기준. 문단 시작이 화면 높이의 90% 지점에 올 때 0,
 * 문단 끝이 55% 지점에 올 때 1이다. `reachable` 계산도 같은 값을 써야 한다.
 */
const OFFSET_START = 0.9;
const OFFSET_END = 0.55;
const DIM = 0.12;

function WordReveal({
  word,
  scrollYProgress,
  reachable,
  start,
  end,
}: {
  word: string;
  scrollYProgress: MotionValue<number>;
  /** 페이지를 끝까지 내렸을 때 도달할 수 있는 최대 진행도(0~1) */
  reachable: RefObject<number>;
  start: number;
  end: number;
}) {
  // 진행도를 도달 가능한 범위로 다시 펴서 마지막 단어가 그 안에서 끝나게 한다.
  // 화면이 짧으면 reachable이 1이라 원래와 같다.
  const opacity = useTransform(scrollYProgress, (raw) => {
    const progress = Math.min(1, raw / Math.max(reachable.current, 0.001));
    const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
    return DIM + (1 - DIM) * t;
  });

  return (
    <motion.span style={{ opacity }} className='inline-block'>
      {word}
    </motion.span>
  );
}

/** 단어별 scroll-reveal — 스크롤에 따라 앞부터 순서대로 밝아집니다 */
export default function ScrollRevealText({
  lines,
  align = 'left',
  className = '',
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  // 전체 단어 수 계산 (delay 비율 산정용)
  const allWords = lines.flatMap((line) => line.split(' '));
  const totalWords = allWords.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [`start ${OFFSET_START}`, `end ${OFFSET_END}`],
  });

  /**
   * 화면이 세로로 길면 페이지를 끝까지 내려도 문단 끝이 55% 지점까지 올라오지 못해
   * 진행도가 1에 닿지 않고 뒤쪽 단어가 어두운 채로 남는다 — 1280×2000에서 30개 중
   * 8개가 그랬다(실측). 끝까지 내렸을 때의 최대 진행도를 재 두고 단어 구간을 그
   * 안으로 맞춘다. 문단 높이·문서 높이가 바뀌면(폰트 로드, 창 크기) 다시 잰다.
   */
  const reachable = useRef(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const zero = top - OFFSET_START * vh;
      const one = top + rect.height - OFFSET_END * vh;
      const maxScroll = document.documentElement.scrollHeight - vh;
      const ratio = (maxScroll - zero) / (one - zero);
      reachable.current = Math.min(1, Math.max(0.2, ratio));
    };

    measure();
    window.addEventListener('resize', measure);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(document.body);
    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, []);

  let wordIndex = 0;

  return (
    <p ref={containerRef} className={className}>
      {lines.map((line, lineIdx) => {
        const words = line.split(' ');

        return (
          <span key={lineIdx} className='block w-full'>
            <span className={`inline-flex w-full flex-wrap gap-x-[0.3em] ${alignClass[align]}`}>
              {words.map((word) => {
                const i = wordIndex++;
                const start = i / totalWords;
                const end = (i + 1) / totalWords;

                return (
                  <WordReveal
                    key={i}
                    word={word}
                    scrollYProgress={scrollYProgress}
                    reachable={reachable}
                    start={start}
                    end={end}
                  />
                );
              })}
            </span>
          </span>
        );
      })}
    </p>
  );
}
