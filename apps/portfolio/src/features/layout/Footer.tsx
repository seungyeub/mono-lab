'use client';

import RollingLink from '@/src/components/RollingText/RollingLink';
import RollingButton from '@/src/components/RollingText/RollingButton';
import SectionLabel from '@/src/components/SectionLabel';
import TagBar from '@/src/components/TagBar';
import { useCursorStore } from '@/src/store/useCursorStore';
import Image from 'next/image';
import ScrollRevealText from '@/src/components/ScrollRevealText';

// 가로 캐러셀에 표시될 프로젝트 카드
const CAROUSEL_CARDS = [
  {
    title: 'Meltdown Studios',
    image: '/images/projects/01.jpg',
    width: '132px',
    height: '193px',
  },
  {
    title: 'Rootwise',
    image: '/images/projects/02.jpg',
    width: '154px',
    height: '110px',
  },
  {
    title: 'Meridiem',
    image: '/images/projects/03.jpg',
    width: '150px',
    height: '193px',
  },
  {
    title: 'Nutree Bakery',
    image: '/images/projects/04.jpg',
    width: '165px',
    height: '245px',
  },
  {
    title: 'Animal & Birds',
    image: '/images/projects/05.jpg',
    width: '190px',
    height: '136px',
  },
];

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

  return (
    <footer
      data-testid='footer'
      className='relative flex w-full flex-col items-center gap-[50px] pt-[140px] xl:pt-[200px]'
    >
      {/* ── 1. Section Label ── */}
      <SectionLabel scene='05' leftLabel='© Final Section 에필로그' rightLabel='Epilogue' />

      {/* ── 2. 가로 스크롤 캐러셀 ── */}
      <div className='w-full overflow-hidden py-10'>
        <div
          className='flex w-max items-start'
          style={{ animation: 'marquee-scroll 60s linear infinite' }}
        >
          {/* 배열 복사로 무한 스크롤 트릭 */}
          {Array.from({ length: 5 })
            .flatMap(() => CAROUSEL_CARDS)
            .map((card, i) => (
              <div key={i} className='shrink-0 pr-4'>
                <div
                  className='relative overflow-hidden rounded-md'
                  style={{ width: card.width, height: card.height }}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes='200px'
                    className='object-cover'
                  />
                  {/* 가독성을 위한 하단 그라데이션 */}
                  <div className='absolute inset-0 bg-linear-to-t from-black/50 to-transparent' />
                  <div className='absolute bottom-3 left-3 text-xs tracking-widest text-white/90 uppercase'>
                    {card.title}
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
            className='w-full text-sm font-semibold break-keep sm:text-base'
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

          <div className='site-container flex w-full cursor-default flex-col items-baseline gap-2 px-6 pt-8 pb-8 text-white/30 transition-colors duration-700 select-none hover:text-white md:px-12 md:pt-16 lg:flex-row lg:justify-center lg:gap-4'>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
