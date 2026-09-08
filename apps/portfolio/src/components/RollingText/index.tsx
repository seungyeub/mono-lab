'use client';

/**
 * RollingText — Helios 스타일 글자별 stagger 롤링 텍스트.
 *
 * 구조: 각 글자마다 .char-wrap 컨테이너를 만들어
 * 위(top)와 아래(bottom) 두 레이어를 독립적으로 이동시킵니다.
 * 부모 그룹이 hover 상태가 되면 CSS custom property로
 * 각 글자 쌍에 개별 delay를 적용합니다.
 */
interface RollingTextProps {
  text: string;
  className?: string;
  /** 글자 사이 지연(ms). 0이면 모든 글자가 한 번에 굴러 짧은 링크 목록에서 빠르게 반응한다 */
  stagger?: number;
}

export default function RollingText({ text, className = '', stagger = 25 }: RollingTextProps) {
  const chars = text.split('');

  return (
    <span
      className={`relative inline-flex text-inherit ${className}`}
      aria-label={text}
      style={{ lineHeight: '1.25' }}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          aria-hidden='true'
          className='relative inline-block overflow-hidden'
          style={{
            // 각 글자별 높이를 line-height와 맞춤
            height: '1.25em',
          }}
        >
          {/* Top layer — slides UP on hover */}
          <span
            className='inline-block translate-y-0 transition-transform ease-in-out group-hover/roll:-translate-y-full'
            style={{
              transitionDuration: '300ms',
              transitionDelay: `${i * stagger}ms`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>

          {/* Bottom layer — starts below, slides INTO view on hover */}
          <span
            className='absolute top-0 left-0 inline-block translate-y-full transition-transform ease-in-out group-hover/roll:translate-y-0'
            style={{
              transitionDuration: '300ms',
              transitionDelay: `${i * stagger}ms`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  );
}
