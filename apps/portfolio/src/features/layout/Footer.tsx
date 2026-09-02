'use client';

import RollingLink from '@/src/components/RollingText/RollingLink';
import { motion } from 'framer-motion';

const QUICK_LINKS = [
  { label: 'Home,', href: '/' },
  { label: 'Resume,', href: '/resume' },
  { label: 'Work,', href: '/work' },
  { label: 'Contact', href: '/contact' },
];

const NETWORKS = [
  { label: 'Github,', href: 'https://github.com/seungyeub' },
  { label: 'Pinterest,', href: 'https://pinterest.com/bseungyeub' },
  { label: 'Blog,', href: 'https://blog.naver.com/backsajang420' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/seungyeub-baek-23aa9016a/',
  },
];

/**
 * Footer — 모든 라우트에 공통으로 노출되는 하단 영역.
 * 홈 전용 에필로그(GIF 캐러셀·철학 문구)는 EpilogueSection이 담당한다.
 */
export default function Footer() {
  return (
    <footer data-testid='footer' className='relative flex w-full flex-col pt-[50px]'>
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
          <p className='text-[min(14vw,12rem)] leading-none font-bold tracking-tighter'>
            SEUNGYEUB
          </p>

          <p className='text-[min(5vw,4rem)] leading-none font-light tracking-tight'>©2026</p>
        </motion.div>
      </div>
    </footer>
  );
}
