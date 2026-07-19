'use client';

import { useCursorStore } from '@/src/store/useCursorStore';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorType = useCursorStore((state) => state.type);
  const setCursorType = useCursorStore((state) => state.setType);
  const pathname = usePathname();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 페이지 이동 시 커서 상태를 항상 default로 리셋
  useEffect(() => {
    setCursorType('default');
  }, [pathname, setCursorType]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  // view 상태는 크기가 커지며 "VIEW" 텍스트 표시
  const isView = cursorType === 'view';
  const isGrab = cursorType === 'grab';
  const isPointer = cursorType === 'pointer';

  const size = isPointer ? 48 : 16;
  const offset = size / 2;

  return (
    <motion.div
      className='pointer-events-none fixed top-0 left-0 z-9999 hidden items-center justify-center rounded-full [@media(hover:hover)_and_(pointer:fine)]:flex'
      style={{
        x: mouseX,
        y: mouseY,
      }}
      animate={{
        width: size,
        height: size,
        marginLeft: -offset,
        marginTop: -offset,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        mixBlendMode: 'difference',
      }}
      transition={{
        width: { type: 'spring', stiffness: 900, damping: 20, mass: 0.1 },
        height: { type: 'spring', stiffness: 900, damping: 20, mass: 0.1 },
        marginLeft: { type: 'spring', stiffness: 900, damping: 20, mass: 0.1 },
        marginTop: { type: 'spring', stiffness: 900, damping: 20, mass: 0.1 },
      }}
    >
      <AnimatePresence>
        {(isView || isGrab) && (
          <motion.span
            key='view-grab-label'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className='absolute rounded-full bg-white px-5 py-2 text-[16px] font-bold tracking-tight whitespace-nowrap text-black uppercase select-none md:text-[23px]'
          >
            {isGrab ? 'Grab' : 'View'}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
