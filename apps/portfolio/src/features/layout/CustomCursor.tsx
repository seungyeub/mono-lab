'use client';

import { useCursorStore } from '@/src/store/useCursorStore';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const cursorType = useCursorStore((state) => state.type);
  const setCursorType = useCursorStore((state) => state.setType);
  const pathname = usePathname();

  // 페이지 이동 시 커서 상태를 항상 default로 리셋
  useEffect(() => {
    setCursorType('default');
  }, [pathname, setCursorType]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
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
  }, [isVisible]);

  if (!isVisible) return null;

  // view 상태는 크기가 커지며 "VIEW" 텍스트 표시
  const isView = cursorType === 'view';
  const isPointer = cursorType === 'pointer';

  const size = isPointer ? 48 : 16;
  const offset = size / 2;

  return (
    <motion.div
      className='fixed top-0 left-0 rounded-full pointer-events-none z-9999 flex items-center justify-center'
      animate={{
        x: mousePosition.x - offset,
        y: mousePosition.y - offset,
        width: size,
        height: size,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        mixBlendMode: 'difference',
      }}
      transition={{
        type: 'spring',
        stiffness: 900,
        damping: 20,
        mass: 0.1,
      }}
    >
      <AnimatePresence>
        {isView && (
          <motion.span
            key='view-label'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className='absolute bg-white px-5 py-2 rounded-full text-black text-[16px] md:text-[23px] font-bold uppercase tracking-tight select-none whitespace-nowrap'
          >
            View
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
