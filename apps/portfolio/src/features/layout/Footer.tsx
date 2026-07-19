'use client';

import RollingButton from '@/src/components/RollingText/RollingButton';
import RollingLink from '@/src/components/RollingText/RollingLink';
import ScrollRevealText from '@/src/components/ScrollRevealText';
import SectionLabel from '@/src/components/SectionLabel';
import TagBar from '@/src/components/TagBar';
import { useCursorStore } from '@/src/store/useCursorStore';
import { motion } from 'framer-motion';

import { CAROUSEL_CARDS } from '@/src/data/carouselGifs';

const QUICK_LINKS = [
  { label: 'Home,', href: '/' },
  { label: 'Gallery,', href: '/gallery' },
  { label: 'Work,', href: '/work' },
  { label: 'Contact', href: '/contact' },
];

const NETWORKS = [
  { label: 'Github,', href: 'https://github.com/seungyeub' },
  { label: 'Pinterest,', href: 'https://pinterest.com/bseungyeub' },
  { label: 'Instagram,', href: 'https://www.instagram.com/b.seungyeub' },
  { label: 'Blog', href: 'https://blog.naver.com/backsajang420' },
];

const TAGS = ['UI Precision', 'Motion Focused', 'Responsive Design', 'Detail-Driven'];

export default function Footer() {
  const setCursorType = useCursorStore((state) => state.setType);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const cards = CAROUSEL_CARDS;

  return (
    <footer
      data-testid='footer'
      className='relative flex w-full flex-col items-center gap-[50px] pt-[140px] xl:pt-[200px]'
    >
      {/* ── 1. Section Label ── */}
      <SectionLabel scene='05' leftLabel='© Final Section 에필로그' rightLabel='Epilogue' />

      {/* ── 2. 가로 스크롤 캐러셀 ── */}
      <div className='box-content h-[250px] w-full overflow-hidden pt-12 pb-8 sm:h-[300px] lg:h-[360px]'>
        {/* GPU 가속을 위한 will-change-transform 추가 및 무한 스크롤 애니메이션 */}
        <div
          className='flex w-max items-start will-change-transform'
          style={{
            animation: 'marquee-scroll 700s linear infinite',
          }}
        >
          {/* 배열을 3번 복사하여 무한 스크롤이 끊기지 않게 함 */}
          {Array.from({ length: 3 })
            .flatMap(() => cards)
            .map((card, i) => (
              <div key={i} className='w-[320px] shrink-0 px-2 sm:w-[360px] lg:w-[400px]'>
                <div className='group relative flex flex-col justify-between overflow-hidden rounded-lg bg-neutral-900 transition-all duration-500 hover:z-20 hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] max-h-[250px] sm:max-h-[300px] lg:max-h-[360px]'>
                  {/* GIF 배경 이미지 */}
                  {card.gif && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.gif}
                      alt={card.title}
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

      {/* ── 5. 하단 영역 (Links + 거대한 타이포그래피) ── */}
      <div className='flex w-full flex-col'>
        {/* Quick Links & Networks */}
        <div className='site-container flex w-full flex-col items-start gap-5 px-6 py-6 md:flex-row md:justify-between md:gap-0 md:px-12 md:py-12'>
          <div className='flex max-w-[300px] flex-col gap-[3px]'>
            <p className='font-semibold text-white'>Quick Links</p>
            <div className='group/nav flex flex-row items-center gap-x-0.5'>
              {QUICK_LINKS.map(({ href, label }) => (
                <RollingLink
                  key={href}
                  href={href}
                  text={label}
                  textClassName='font-medium'
                  // 전체 호버 시 옅어지고(#555), 선택한 것만 완전한 흰색(white)으로 강조
                  className='text-[#999] transition-colors duration-200 group-hover/nav:text-[#555] hover:text-white!'
                />
              ))}
            </div>
          </div>

          <div className='flex max-w-[300px] flex-col gap-[3px]'>
            <p className='text-left font-semibold text-white md:text-right'>Networks</p>
            <div className='group/nav flex flex-row items-center gap-x-0.5'>
              {NETWORKS.map(({ href, label }) => (
                <RollingLink
                  key={href}
                  href={href}
                  target='_blank' // 외부 링크이므로 새 창 열기 속성 추가
                  rel='noopener noreferrer' // 보안을 위한 속성 추가
                  text={label}
                  textClassName='font-medium'
                  className='text-[#999] transition-colors duration-200 group-hover/nav:text-[#555] hover:text-white!'
                />
              ))}
            </div>
          </div>
        </div>

        {/* 거대한 포트폴리오 푸터 */}
        <div className='group/footer flex w-full flex-col border-t border-white/10'>
          <div className='site-container flex w-full flex-col justify-between gap-2 px-6 pt-6 text-[10px] tracking-widest text-white/40 uppercase md:flex-row md:px-12 md:pt-10 md:text-xs'>
            <span>Front-end Development</span>
            <span>All Rights Reserved</span>
          </div>

          <motion.div
            whileInView={{ color: 'rgba(255, 255, 255, 1)' }}
            transition={{ duration: 3, ease: 'easeOut' }}
            viewport={{ once: false, amount: 'some' }}
            className='site-container flex w-full cursor-none flex-col items-baseline gap-2 px-6 pt-8 pb-8 text-white/20 select-none md:px-12 md:pt-16 lg:flex-row lg:justify-center lg:gap-4'
          >
            <p
              className='leading-none font-bold tracking-tighter'
              style={{ fontSize: 'min(14vw, 12rem)' }}
            >
              SEUNGYEUB
            </p>

            <p
              className='leading-none font-light tracking-tight'
              style={{ fontSize: 'min(5vw, 4rem)' }}
            >
              ©2026
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
