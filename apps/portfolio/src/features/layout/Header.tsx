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
      className='fixed top-0 left-0 w-full z-100 bg-neutral-950'
    >
      {/* <nav className='flex flex-row justify-between content-center items-center w-full h-min px-6 py-6.5 md:px-12 md:py-6.5 md:pr-35 md:pl-12'> */}
      <nav className='site-container flex flex-row justify-between content-center items-center w-full h-min px-6 py-6.5 md:px-12 md:py-6.5'>
        {/* LEFT — Avatar (difference 블렌드 제외: 사진은 그대로 보여야 함) */}
        <Link
          href='/'
          className='relative block w-11.5 h-11.5 shrink-0 rounded-full overflow-hidden border border-white/20'
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
            <div className='absolute inset-0 bg-white/10 rounded-full' aria-hidden />
          )}
        </Link>

        {/* Right — Helios 스타일 difference는 텍스트 영역만 (이미지에 쓰면 사라짐) */}
        <div
          className='relative flex flex-row flex-none content-center items-center gap-[270px] w-min h-min overflow-hidden opacity-100 p-0'
          style={{ mixBlendMode: 'difference' }}
        >
          <div className='relative flex flex-col flex-none content-start items-start gap-[3px] w-min max-w-[300px] h-min overflow-visible opacity-100 p-0'>
            <p className='text-white font-semibold'>Quick Links</p>
            <div className='group/nav relative flex flex-row items-center content-start w-full h-min gap-x-0.5 overflow-visible opacity-100 p-0'>
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
          <div className='relative hidden lg:flex flex-col flex-none content-start items-start gap-[3px] w-min max-w-[300px] h-min overflow-visible opacity-100 p-0'>
            <div className='relative flex flex-col justify-center whitespace-pre transform-none'>
              <p className='text-white font-semibold'>Based in Seoul, 한국</p>
            </div>
            <div className='relative flex flex-col justify-center whitespace-pre transform-none text-[#999]'>
              <p>Front-End Developer</p>
            </div>
          </div>
        </div>
      </nav>
      <div className='flex-none w-full h-px relative overflow-hidden bg-neutral-400/20 will-change-transform'></div>
    </motion.header>
  );
}
