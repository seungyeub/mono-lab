'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  // 래퍼가 opacity 0으로 시작하면 서버가 그린 본문 전체가 하이드레이션 전까지 보이지 않아
  // 첫 화면 텍스트 LCP가 JS 실행 완료 시점(스로틀 기준 약 6초)까지 밀린다(P3-11 실측).
  // 진입 효과는 위치 이동만 남기고 페이드는 뺀다.
  return (
    <motion.div
      initial={{ y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
