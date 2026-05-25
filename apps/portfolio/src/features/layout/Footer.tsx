'use client';

import RollingText from '@/src/components/RollingText';
import SectionLabel from '@/src/components/SectionLabel';
import TagBar from '@/src/components/TagBar';
import { useCursorStore } from '@/src/store/useCursorStore';
import Image from 'next/image';
import Link from 'next/link';

// 가로 캐러셀에 표시될 프로젝트 카드
const CAROUSEL_CARDS = [
  { title: 'Meltdown Studios', image: '/images/projects/01.jpg', width: '132px', height: '193px' },
  { title: 'Rootwise', image: '/images/projects/02.jpg', width: '154px', height: '110px' },
  { title: 'Meridiem', image: '/images/projects/03.jpg', width: '150px', height: '193px' },
  { title: 'Nutree Bakery', image: '/images/projects/04.jpg', width: '165px', height: '245px' },
  { title: 'Animal & Birds', image: '/images/projects/05.jpg', width: '190px', height: '136px' },
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
    <footer className='relative w-full flex flex-col items-center gap-[50px] pt-[120px] overflow-hidden'>
      {/* ── 1. Section Label ── */}
      <SectionLabel scene='05' leftLabel='© Final Section 에필로그' rightLabel='Portfolio Wrap' />

      {/* ── 2. 가로 스크롤 캐러셀 ── */}
      <div className='w-full overflow-hidden py-10'>
        <div
          className='flex items-start w-max'
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
                <div className='absolute bottom-3 left-3 text-xs text-white/90 uppercase tracking-widest'>
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
      <div className='w-full px-6 md:px-12 py-16 md:py-20'>
        <div className='flex flex-col items-center gap-8 max-w-xl mx-auto'>
          <p className='w-full max-w-[550px] break-keep text-pretty font-semibold text-center'>
            보이지 않는 탄탄한 구조와 타협하지 않는 시각적 섬세함을 결합해 밀도 높은 프로덕트를
            완성합니다. 모든 상태와 전환을 세심하게 다듬어, 어떤 스크린에서든 사용자가 마주하는
            순간들이 명확하고 한결같으며 흔들림 없는 의도를 갖도록 설계합니다.
          </p>
          <button
            onClick={scrollToTop}
            onMouseEnter={() => setCursorType('pointer')}
            onMouseLeave={() => setCursorType('default')}
            className='group/roll border-white border-2 rounded-full px-4 py-2 text-[16px] md:text-[23px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300'
          >
            <RollingText text='Back to Top' className='font-bold tracking-tight' />
          </button>
        </div>
      </div>

      {/* ── 5. 하단 영역 (Links + 거대한 타이포그래피) ── */}
      <div className='w-full flex flex-col'>
        {/* Quick Links & Networks */}
        <div className='site-container px-6 md:px-12 py-6 md:py-12 flex flex-col items-start w-full gap-5 md:flex-row md:justify-between md:gap-0'>
          <div className='flex flex-col gap-[3px] max-w-[300px]'>
            <p className='text-white font-semibold'>Quick Links</p>
            <div className='group/nav flex flex-row items-center gap-x-0.5'>
              {QUICK_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  // 전체 호버 시 옅어지고(#555), 선택한 것만 완전한 흰색(white)으로 강조
                  className='text-[#999] transition-colors duration-200 group-hover/nav:text-[#555] hover:text-white!'
                >
                  <RollingText text={label} className='font-medium' />
                </Link>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-[3px] max-w-[300px]'>
            <p className='text-white font-semibold text-left md:text-right'>Networks</p>
            <div className='group/nav flex flex-row items-center gap-x-0.5'>
              {NETWORKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  target='_blank' // 외부 링크이므로 새 창 열기 속성 추가
                  rel='noopener noreferrer' // 보안을 위한 속성 추가
                  className='text-[#999] transition-colors duration-200 group-hover/nav:text-[#555] hover:text-white!'
                >
                  <RollingText text={label} className='font-medium' />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 거대한 포트폴리오 푸터 */}
        <div className='w-full flex flex-col border-t border-white/10 group/footer'>
          <div className='site-container px-6 md:px-12 w-full flex flex-col md:flex-row justify-between pt-6 md:pt-10 text-[10px] md:text-xs text-white/40 uppercase tracking-widest gap-2'>
            <span>Front-end Development</span>
            <span>All Rights Reserved</span>
          </div>

          <div className='site-container px-6 md:px-12 w-full flex flex-col lg:flex-row lg:justify-center items-baseline gap-2 lg:gap-4 pt-8 md:pt-16 pb-4 text-white/30 hover:text-white transition-colors duration-700 select-none cursor-default'>
            <p
              className='font-bold tracking-tighter leading-none'
              style={{ fontSize: 'min(14vw, 12rem)' }}
            >
              SEUNGYEUB
            </p>

            <p
              className='font-light tracking-tight leading-none'
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
