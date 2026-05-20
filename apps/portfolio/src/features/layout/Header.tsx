'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import RollingText from '@/src/components/RollingText';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/work', label: 'Work' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

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
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4 text-white"
      style={{ mixBlendMode: 'difference' }}
    >
      {/* ── 3-column grid matching Helios layout ── */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">

        {/* LEFT — Avatar (circular profile image) */}
        <Link
          href="/"
          className="block w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/20 flex-shrink-0"
        >
          <img
            src="/images/avatar.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              // avatar 없을 때 initials fallback
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* fallback ring if no image */}
          <div className="w-full h-full bg-white/10 rounded-full" />
        </Link>

        {/* CENTER — Quick Links nav */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-0.5 hidden md:block">
            Quick Links
          </span>
          <nav className="flex gap-4 md:gap-6 text-xs md:text-sm font-medium">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
              >
                <RollingText text={label} className="text-xs md:text-sm font-medium" />
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT — Meta text */}
        <div className="hidden md:flex flex-col items-end text-[11px] leading-snug text-white/70 flex-shrink-0">
          <span>Based in Seoul, 한국</span>
          <span>Logo / Brand Designer</span>
        </div>
      </div>
    </motion.header>
  );
}
