'use client';

import RollingLink from '@/src/components/RollingText/RollingLink';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home,' },
  { href: '/gallery', label: 'Gallery,' },
  { href: '/work', label: 'Work,' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (previous === undefined) return;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      data-testid='header'
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className='fixed top-0 left-0 z-100 w-full bg-neutral-950'
    >
      {/* <nav className='flex flex-row justify-between content-center items-center w-full h-min px-6 py-6.5 md:px-12 md:py-6.5 md:pr-35 md:pl-12'> */}
      <nav className='site-container flex h-min w-full flex-row content-center items-center justify-between px-6 py-6.5 md:px-12 md:py-6.5'>
        {/* LEFT — Avatar (difference 블렌드 제외: 사진은 그대로 보여야 함) */}
        <Link
          href='/'
          aria-label='홈으로 이동'
          className='relative block h-11.5 w-11.5 shrink-0 overflow-hidden rounded-full border border-white/20'
        >
          {!avatarLoadFailed ? (
            <Image
              src='/images/avatar.jpg'
              alt='Profile'
              fill
              sizes='(max-width: 768px) 44px, 44px'
              className='object-cover'
              priority
              onError={() => setAvatarLoadFailed(true)}
            />
          ) : (
            <div className='absolute inset-0 rounded-full bg-white/10' aria-hidden />
          )}
        </Link>

        {/* Right — Helios 스타일 difference는 텍스트 영역만 (이미지에 쓰면 사라짐) */}
        <div
          className='relative flex h-min w-min flex-none flex-row content-center items-center gap-[270px] overflow-hidden p-0 opacity-100'
          style={{ mixBlendMode: 'difference' }}
        >
          <div className='relative flex h-min w-min max-w-[300px] flex-none flex-col content-start items-start gap-[3px] overflow-visible p-0 opacity-100'>
            <p className='font-semibold text-white'>Quick Links</p>
            <div className='group/nav relative flex h-min w-full flex-row content-start items-center gap-x-0.5 overflow-visible p-0 opacity-100'>
              {NAV_LINKS.map(({ href, label }) => (
                <RollingLink
                  key={href}
                  href={href}
                  text={label}
                  textClassName='font-medium'
                  className='text-[#999] transition-colors duration-200 group-hover/nav:text-[#555] hover:text-white focus-visible:text-white'
                />
              ))}
            </div>
          </div>
          <div className='relative hidden h-min w-min max-w-[300px] flex-none flex-col content-start items-start gap-[3px] overflow-visible p-0 opacity-100 lg:flex'>
            <div className='relative flex transform-none flex-col justify-center whitespace-pre'>
              <p className='font-semibold text-white'>Based in Seoul, 한국</p>
            </div>
            <div className='relative flex transform-none flex-col justify-center whitespace-pre text-[#999]'>
              <p>Front-End Developer</p>
            </div>
          </div>
        </div>
      </nav>
      <div className='relative h-px w-full flex-none overflow-hidden bg-neutral-400/20 will-change-transform'></div>
    </motion.header>
  );
}
