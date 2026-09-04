import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/src/lib/siteConfig';

/**
 * robots.txt — 전체 허용 + sitemap 위치 안내.
 *
 * 숨길 경로가 없는 공개 포트폴리오이므로 disallow는 두지 않는다.
 * 생성형 검색 크롤러(GPTBot 등)도 막지 않는다 — 이 사이트는 발견되는 것이 목적이다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
