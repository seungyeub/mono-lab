'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

interface SectionLabelProps {
  scene: string;
  leftLabel: string;
  rightLabel: string;
  className?: string;
}

export default function SectionLabel({
  scene,
  leftLabel,
  rightLabel,
  className,
}: SectionLabelProps) {
  const { scrollY } = useScroll();
  const [headerHidden, setHeaderHidden] = useState(false);

  // Header.tsx와 완전히 동일한 스크롤 동기화 로직 적용
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (previous === undefined) return;
    if (latest > previous && latest > 150) {
      setHeaderHidden(true);
    } else {
      setHeaderHidden(false);
    }
  });

  return (
    <motion.div
      className={`pointer-events-none sticky z-20 w-full ${className || ''}`.trim()}
      animate={{ top: headerHidden ? 0 : 99 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className='w-full bg-neutral-950 text-[13px]'>
        <div className='flex flex-col gap-2.5 overflow-hidden'>
          <div className='h-px w-full bg-transparent' />
          <div className='site-container flex items-center justify-between px-6 text-white/70 uppercase md:px-12'>
            <h6 className='flex-1 text-left whitespace-pre text-white'>{leftLabel}</h6>
            <h6 className='hidden flex-1 text-center whitespace-pre text-white/40 md:block'>
              SCENE — {scene}
            </h6>
            <h6 className='hidden flex-1 text-right whitespace-pre min-[360px]:block'>
              {rightLabel}
            </h6>
          </div>
          <div className='h-px w-full bg-white/15' />
        </div>
      </div>
    </motion.div>
  );
}
