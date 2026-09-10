'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * 운영체제의 "동작 줄이기" 설정을 framer-motion 전체에 알린다.
 * 설정을 켠 사용자에게는 등장·롤링 같은 transform·opacity 애니메이션이 즉시 완료되고,
 * 켜지 않은 방문자에게는 아무 변화가 없다.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion='user'>{children}</MotionConfig>;
}
