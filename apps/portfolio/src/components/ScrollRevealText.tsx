'use client';

import { motion, type MotionValue, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

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

function WordReveal({
  word,
  scrollYProgress,
  start,
  end,
}: {
  word: string;
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.12, 1]);

  return (
    <motion.span style={{ opacity }} className='inline-block'>
      {word}
    </motion.span>
  );
}

/** 단어별 scroll-reveal — 스크롤에 따라 앞부터 순서대로 밝아집니다 */
export default function ScrollRevealText({ lines, align = 'left', className = '' }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  // 전체 단어 수 계산 (delay 비율 산정용)
  const allWords = lines.flatMap((line) => line.split(' '));
  const totalWords = allWords.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'end 0.55'],
  });

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
