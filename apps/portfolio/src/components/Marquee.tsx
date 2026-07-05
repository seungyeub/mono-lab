'use client';

/**
 * Marquee — CSS keyframe 기반 무한 좌→우 스크롤 텍스트 띠.
 * 레퍼런스 사이트(Helios)의 여러 구분선 역할 마르퀴와 동일한 느낌.
 *
 * 사용 예시:
 *   <Marquee items={['Art Direction', 'Branding', 'Strategy', 'Web Design']} />
 */

import { useEffect, useRef, useState } from 'react';

interface MarqueeProps {
  /** 반복할 텍스트 아이템 배열 */
  items: string[];
  /** 구분자 (기본: ✦) */
  separator?: string;
  /** 이동 속도 — 낮을수록 빠름 (px/s 기준, 기본 60) */
  speed?: number;
  /** 추가 클래스 */
  className?: string;
  /** 텍스트 클래스 */
  textClassName?: string;
}

export default function Marquee({
  items,
  separator = '✦',
  speed = 60,
  className = '',
  textClassName = '',
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);

  useEffect(() => {
    if (!trackRef.current) return;
    // 트랙 너비 기준으로 속도 계산
    const width = trackRef.current.scrollWidth / 2;
    setDuration(width / speed);
  }, [speed]);

  // 아이템을 두 벌 복사 (seamless loop용)
  const allItems = [...items, ...items];

  return (
    <div className={`w-full overflow-hidden border-y border-white/10 py-2 ${className}`}>
      <div
        ref={trackRef}
        className='flex gap-0 whitespace-nowrap will-change-transform'
        style={{
          animation: `marquee-scroll ${duration}s linear infinite`,
        }}
      >
        {allItems.map((item, i) => (
          <span key={i} className={`inline-flex items-center gap-6 md:gap-10 ${textClassName}`}>
            <span className='text-xs font-medium tracking-[0.2em] uppercase md:text-sm'>
              {item}
            </span>
            <span className='mr-1 text-xs text-gray-600'>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
