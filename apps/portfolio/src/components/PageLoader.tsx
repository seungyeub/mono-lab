'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PageLoader — 첫 방문 시 검정 오버레이 + 스피너가 ~1.5초 보인 뒤
 * 위로 슬라이드 아웃되며 콘텐츠를 reveal하는 로더.
 * sessionStorage를 이용해 같은 세션에서는 한 번만 표시.
 */
export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 같은 세션에서 재방문 시 로더 스킵
    const hasLoaded = sessionStorage.getItem('hasLoaded');
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasLoaded', 'true');
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key='page-loader'
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className='fixed inset-0 z-99999 flex items-center justify-center'
          style={{ backgroundColor: 'var(--site-bg)' }}
        >
          {/* 스피너 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className='h-8 w-8 rounded-full border-2 border-white/20 border-t-white'
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
