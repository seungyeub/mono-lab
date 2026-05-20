'use client';

import Link from 'next/link';
import { useCursorStore } from '@/src/store/useCursorStore';

// 가로 캐러셀에 표시될 프로젝트 카드 (이미지 경로만 관리)
const CAROUSEL_CARDS = [
  { title: 'Meltdown Studios', image: '/images/projects/01.jpg', bg: '#1a1a2e' },
  { title: 'Rootwise',         image: '/images/projects/02.jpg', bg: '#1e1e1e' },
  { title: 'Meridiem',         image: '/images/projects/03.jpg', bg: '#2a1a0e' },
  { title: 'Nutree Bakery',    image: '/images/projects/04.jpg', bg: '#0e1a0e' },
  { title: 'Animal & Birds',   image: '/images/projects/05.jpg', bg: '#1a0e2a' },
  // 두 벌 복사해서 seamless loop
  { title: 'Meltdown Studios', image: '/images/projects/01.jpg', bg: '#1a1a2e' },
  { title: 'Rootwise',         image: '/images/projects/02.jpg', bg: '#1e1e1e' },
  { title: 'Meridiem',         image: '/images/projects/03.jpg', bg: '#2a1a0e' },
  { title: 'Nutree Bakery',    image: '/images/projects/04.jpg', bg: '#0e1a0e' },
  { title: 'Animal & Birds',   image: '/images/projects/05.jpg', bg: '#1a0e2a' },
];

const QUICK_LINKS = [
  { label: 'Home',    href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Work',    href: '/work' },
  { label: 'Contact', href: '/contact' },
];

const NETWORKS = [
  { label: 'Instagram', href: '#' },
  { label: 'Dribbble',  href: '#' },
  { label: 'Behance',   href: '#' },
  { label: 'Twitter',   href: '#' },
];

export default function Footer() {
  const setCursorType = useCursorStore((state) => state.setType);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="w-full text-white overflow-hidden">

      {/* ── 1. 가로 스크롤 캐러셀 (site-container와 동일 최대 너비) ── */}
      <div className="site-container w-full overflow-hidden border-t border-white/10">
        <div
          className="flex gap-4 py-4 px-4"
          style={{ animation: 'marquee-scroll 30s linear infinite' }}
        >
          {CAROUSEL_CARDS.map((card, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-48 h-64 md:w-64 md:h-80 relative overflow-hidden rounded-sm"
              style={{ backgroundColor: card.bg }}
            >
              {/* 이미지 경로 */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className="absolute bottom-3 left-3 text-xs text-white/60 uppercase tracking-widest">
                {card.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. 태그 바 ── */}
      <div className="site-container w-full px-6 md:px-12 py-4 border-y border-white/10 flex flex-wrap gap-4 md:gap-8 text-[10px] uppercase tracking-[0.2em] text-white/30">
        {['Independent', 'Brand Focus', 'Strategic', 'Detail-Driven', 'Seoul, 한국'].map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      {/* ── 3. 본문 (설명 + 링크) ── */}
      <div className="site-container w-full px-6 md:px-12 py-16 md:py-20 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12">
        {/* 좌측: 설명 + Back to Top */}
        <div className="flex flex-col gap-8 max-w-xl">
          <p className="text-xl md:text-2xl font-medium leading-relaxed">
            I build cohesive brand identities by combining strategic positioning with visual
            precision — helping startups and businesses show up clearly, consistently, and with
            intention.
          </p>
          <button
            onClick={scrollToTop}
            onMouseEnter={() => setCursorType('pointer')}
            onMouseLeave={() => setCursorType('default')}
            className="self-start border border-white/40 rounded-full px-7 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            Back to Top ↑
          </button>
        </div>

        {/* 우측: Quick Links + Networks */}
        <div className="flex gap-12 md:gap-16">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
              Quick Links
            </span>
            {QUICK_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setCursorType('pointer')}
                onMouseLeave={() => setCursorType('default')}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
              Networks
            </span>
            {NETWORKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCursorType('pointer')}
                onMouseLeave={() => setCursorType('default')}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. 거대한 ©2026 텍스트 ── */}
      <div className="site-container w-full overflow-hidden border-t border-white/10">
        <p
          className="px-6 md:px-12 py-4 font-medium tracking-tighter leading-none text-white/[0.06] select-none"
          style={{ fontSize: 'clamp(4rem, 18vw, 18rem)' }}
        >
          ©2026
        </p>
      </div>
    </footer>
  );
}
