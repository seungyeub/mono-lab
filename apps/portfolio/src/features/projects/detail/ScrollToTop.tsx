'use client';

import { useEffect } from 'react';

/**
 * 상세 페이지는 항상 맨 위에서 시작하게 한다.
 * Next Project로 이어 넘어갈 때는 같은 라우트 세그먼트라 스크롤이 그대로 남고,
 * 뒤로 갔다 다시 들어와도 브라우저가 이전 위치를 복원해 글 중간부터 보인다.
 * key로 slug를 받아 프로젝트가 바뀔 때마다 상단으로 되돌린다.
 */
export default function ScrollToTop({ trigger }: { trigger: string }) {
  useEffect(() => {
    // 브라우저의 스크롤 복원이 우리 스크롤 뒤에 실행되는 경우가 있어 다음 프레임에서 한 번 더 맞춘다
    window.scrollTo(0, 0);
    const frame = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(frame);
  }, [trigger]);

  return null;
}
