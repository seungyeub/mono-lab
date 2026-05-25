'use client';

/**
 * WordRoller — Helios 스타일 자동 단어 교체 롤링 텍스트.
 *
 * 동작 원리:
 *  - `words` 배열의 단어들을 일정 간격(interval)으로 순환.
 *  - 현재 단어는 글자별로 왼→오른 stagger로 위로 올라가며 사라짐.
 *  - 다음 단어는 글자별로 왼→오른 stagger로 아래에서 올라오며 등장.
 *  - 부모의 font-size / font-weight / color를 상속해 어디서든 사용 가능.
 *
 * 잔상 제거 방법:
 *  - opacity 애니메이션 제거 → 투명도 겹침 없음
 *  - 각 글자마다 개별 overflow:hidden 클립 박스 적용
 *    → 슬롯 밖으로 나간 글자는 즉시 보이지 않아 잔상이 생기지 않음
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WordRollerProps {
  /** 순환할 단어(혹은 문장) 배열 */
  words: string[];
  /** 단어 교체 간격 (ms). 기본값 3000 */
  interval?: number;
  /** 글자 간 stagger delay (ms). 기본값 40 */
  staggerMs?: number;
  /** 진입·퇴장 애니메이션 duration (s). 기본값 0.55 */
  duration?: number;
  /** 최상위 span에 추가할 Tailwind 클래스 */
  className?: string;
}

export default function WordRoller({
  words,
  interval = 3000,
  staggerMs = 40,
  duration = 0.55,
  className = '',
}: WordRollerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  const word = words[index];
  const chars = word!.split('');
  const staggerSec = staggerMs / 1000;

  return (
    <span
      className={`inline-flex ${className}`}
      aria-live='polite'
      aria-label={word}
      style={{ verticalAlign: 'bottom' }}
    >
      <AnimatePresence mode='popLayout' initial={false}>
        <motion.span
          key={word! + index}
          className='inline-flex'
          initial='hidden'
          animate='visible'
          exit='exit'
        >
          {chars.map((char, i) => (
            /*
             * 핵심: 각 글자를 overflow:hidden + inline-block 슬롯으로 감쌈.
             * 슬롯 밖으로 이동한 글자(y > 100% 또는 y < -100%)는
             * 클립되어 보이지 않으므로 잔상이 완전히 사라짐.
             * opacity 는 제거 — 투명도 겹침이 잔상의 주원인이었음.
             */
            <span
              key={i}
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'bottom',
                paddingBottom: '0.1em',
                marginBottom: '-0.1em',
              }}
            >
              <motion.span
                className='inline-block'
                style={{ whiteSpace: 'pre' }}
                variants={{
                  hidden: {
                    y: '130%',
                  },
                  visible: {
                    y: '0%',
                    transition: {
                      duration,
                      delay: i * staggerSec,
                      ease: [0.16, 1, 0.3, 1], // easeOutExpo — Helios 느낌
                    },
                  },
                  exit: {
                    y: '-130%',
                    transition: {
                      duration: duration * 0.75,
                      delay: i * staggerSec * 0.6,
                      ease: [0.16, 0.8, 1, 1], // easeInCubic
                    },
                  },
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
