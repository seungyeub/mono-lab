'use client';

import RollingLink from '@/src/components/RollingText/RollingLink';
import { useCursorStore } from '@/src/store/useCursorStore';

/**
 * Explore the Project CTA 카드.
 * - 버튼은 홈 "SEE ALL WORKS"와 동일한 스타일·효과(rounded-full + hover 시 white 배경 + 롤링 텍스트).
 * - 등재된 liveUrl은 전부 실운영 사이트라 라벨을 "Visit Website"로 쓴다(Live Demo는 데모처럼 읽힘).
 * - 값이 없는 CTA는 렌더링하지 않는다(P0-3 계약).
 */
export default function ExploreCta({ liveUrl, github }: { liveUrl?: string; github?: string }) {
  const setCursorType = useCursorStore((s) => s.setType);

  if (!liveUrl && !github) return null;

  const buttonClass =
    'inline-block rounded-full border-2 border-white px-5 py-2 text-[16px] tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black md:text-[23px]';

  return (
    <section className='mt-20 md:mt-28'>
      <div className='flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center transition-colors duration-500 hover:border-white/20 md:py-16'>
        <h2 className='text-2xl font-semibold tracking-tight md:text-3xl'>Explore the Project</h2>
        <p className='max-w-xl text-sm text-gray-400 md:text-base'>
          운영 중인 사이트와 소스 코드에서 실제 결과물을 확인할 수 있습니다.
        </p>
        <div className='flex flex-col gap-4 sm:flex-row'>
          {liveUrl && (
            <RollingLink
              href={liveUrl}
              target='_blank'
              rel='noopener noreferrer'
              onMouseEnter={() => setCursorType('pointer')}
              onMouseLeave={() => setCursorType('default')}
              text='Visit Website'
              textClassName='font-bold tracking-tight'
              className={buttonClass}
            />
          )}
          {github && (
            <RollingLink
              href={github}
              target='_blank'
              rel='noopener noreferrer'
              onMouseEnter={() => setCursorType('pointer')}
              onMouseLeave={() => setCursorType('default')}
              text='Source Code'
              textClassName='font-bold tracking-tight'
              className={buttonClass}
            />
          )}
        </div>
      </div>
    </section>
  );
}
