'use client';

import RollingButton from '@/src/components/RollingText/RollingButton';
import ScrollRevealText from '@/src/components/ScrollRevealText';
import SectionLabel from '@/src/components/SectionLabel';
import TagBar from '@/src/components/TagBar';
import { CAROUSEL_CARDS } from '@/src/data/carouselGifs';
import { useCursorStore } from '@/src/store/useCursorStore';

const TAGS = ['UI Precision', 'Motion Focused', 'Responsive Design', 'Detail-Driven'];

/**
 * EpilogueSection — 홈 페이지 전용 에필로그(Scene 05).
 * GIF 캐러셀·태그 바·철학 문구로 구성되며, 홈의 마지막 섹션으로만 사용한다.
 * 사이트 공통 하단 영역(Quick Links/Networks·대형 타이포)은 Footer가 담당한다.
 */
export default function EpilogueSection() {
  const setCursorType = useCursorStore((state) => state.setType);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const cards = CAROUSEL_CARDS;

  return (
    <section
      data-testid='epilogue-section'
      className='relative flex w-full flex-col items-center gap-[50px] pt-[140px] xl:pt-[200px]'
    >
      {/* ── 1. Section Label ── */}
      <SectionLabel scene='05' leftLabel='© Final Section 에필로그' rightLabel='Epilogue' />

      {/* ── 2. 가로 스크롤 캐러셀 ── */}
      <div className='box-content h-[250px] w-full overflow-hidden pt-12 pb-8 sm:h-[300px] lg:h-[360px]'>
        {/* GPU 가속을 위한 will-change-transform 추가 및 무한 스크롤 애니메이션 */}
        <div className='flex w-max animate-[marquee-scroll_700s_linear_infinite] items-start will-change-transform'>
          {/* 배열을 3번 복사하여 무한 스크롤이 끊기지 않게 함 */}
          {Array.from({ length: 3 })
            .flatMap(() => cards)
            .map((card, i) => (
              <div key={i} className='w-[320px] shrink-0 px-2 sm:w-[360px] lg:w-[400px]'>
                <div className='group relative flex max-h-[250px] flex-col justify-between overflow-hidden rounded-lg bg-neutral-900 transition-all duration-500 hover:z-20 hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] sm:max-h-[300px] lg:max-h-[360px]'>
                  {/* GIF 배경 이미지 */}
                  {card.gif && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.gif}
                      alt={card.title}
                      width={card.width}
                      height={card.height}
                      loading='lazy'
                      decoding='async'
                      className='block h-auto w-full'
                    />
                  )}

                  {/* 텍스트를 Absolute 로 띄워서 이미지 위를 덮음 */}
                  <div className='pointer-events-none absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
                    <h3 className='text-sm font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]'>
                      {card.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── 3. 태그 바 ── */}
      <TagBar tags={TAGS} />

      {/* ── 4. 본문 (철학 + Back to Top) ── */}
      <div className='w-full px-6 py-4 sm:py-16 md:px-12 md:py-20'>
        <div className='mx-auto flex max-w-[640px] flex-col items-center gap-10 text-pretty lg:gap-12'>
          <ScrollRevealText
            lines={[
              '보이지 않는 탄탄한 구조와 타협하지 않는 시각적 섬세함을 결합해 밀도 높은 프로덕트를 완성합니다. 모든 상태와 전환을 세심하게 다듬어, 어떤 스크린에서든 사용자가 마주하는 순간들이 명확하고 한결같으며 흔들림 없는 의도를 갖도록 설계합니다.',
            ]}
            align='center'
            className='w-full text-sm font-semibold break-keep sm:text-base lg:text-lg'
          />
          <RollingButton
            onClick={scrollToTop}
            onMouseEnter={() => setCursorType('pointer')}
            onMouseLeave={() => setCursorType('default')}
            text='Back to Top'
            textClassName='font-bold tracking-tight'
            className='rounded-full border-2 border-white bg-neutral-950 px-5 py-2 text-[16px] tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black md:text-[23px]'
          />
        </div>
      </div>
    </section>
  );
}
