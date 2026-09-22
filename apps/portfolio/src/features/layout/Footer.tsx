'use client';

import RollingLink from '@/components/RollingText/RollingLink';
import { motion } from 'framer-motion';

const QUICK_LINKS = [
  { label: 'Home,', href: '/' },
  { label: 'Projects,', href: '/projects' },
  { label: 'Resume,', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

// Contact 페이지의 Channels와 같은 순서로 둔다 - 목록이 두 곳에 있어 한쪽만 바꾸면 어긋난다
const NETWORKS = [
  { label: 'GitHub,', href: 'https://github.com/seungyeub' },
  { label: 'Blog,', href: 'https://blog.naver.com/backsajang420' },
  {
    label: 'LinkedIn,',
    href: 'https://www.linkedin.com/in/seungyeub-baek-23aa9016a/',
  },
  { label: 'Pinterest', href: 'https://pinterest.com/bseungyeub' },
];

/**
 * Footer - 모든 라우트에 공통으로 노출되는 하단 영역.
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
      <div className='group/footer border-line flex w-full flex-col border-t'>
        <div className='site-container text-label flex w-full flex-col justify-between gap-2 px-6 pt-6 tracking-widest text-white/50 uppercase md:flex-row md:px-12 md:pt-10 md:text-xs'>
          {/* 처리방침은 모든 페이지에서 닿을 수 있어야 한다 - GA가 전 페이지에서 쿠키를 쓴다.
              직군 표기(Front-End Developer)는 헤더 우측에 이미 있어 여기서는 뺐다.
              세로로 쌓이는 화면에서는 Privacy를 위에 둔다 - 아래 워터마크(SEUNGYEUB ©2026)와
              저작권 표기가 붙어 있어야 한 덩어리로 읽힌다. 가로로 펴지는 md부터는 순서를 되돌려
              저작권을 왼쪽 끝, Privacy를 오른쪽 끝에 둔다.
              글자 지연은 기본값(25ms)을 쓴다 - Quick Links·Networks와 같은 롤링으로 보이게 */}
          <RollingLink
            href='/privacy'
            text='Privacy'
            className='transition-colors duration-200 hover:text-white md:order-2'
          />
          <span className='md:order-1'>All Rights Reserved</span>
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
