import type { MetadataRoute } from 'next';

import { getAllProjects } from '@/src/lib/mdx';
import { SITE_URL } from '@/src/lib/siteConfig';

/** 정적 라우트. `/gallery`는 `/resume`로 영구 리다이렉트되므로 싣지 않는다 */
const STATIC_ROUTES = [
  { path: '', priority: 1, changeFrequency: 'monthly' as const },
  { path: '/work', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/resume', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' as const },
];

/**
 * sitemap.xml — 프로젝트 상세는 MDX에서 동적으로 채운다.
 *
 * 목록을 손으로 관리하면 MDX를 추가했을 때 빠뜨리기 쉬우므로,
 * 상세 페이지를 정적 생성할 때 쓰는 `getAllProjects()`를 그대로 재사용한다.
 * 즉 생성되는 라우트와 sitemap이 같은 소스에서 나온다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // lastModified는 일부러 내보내지 않는다.
  // sitemap 프로토콜은 이 값을 "해당 페이지가 실제로 바뀐 날"로 요구하는데,
  // 생성 시각을 넣으면 재배포할 때마다 바뀌지 않은 페이지까지 수정된 것으로
  // 알리게 되어 크롤러가 이 신호를 신뢰하지 않게 된다.
  // MDX에 실제 수정일을 담게 되면 그때 다시 넣는다.
  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));

  const projectEntries = getAllProjects().map(({ slug }) => ({
    url: `${SITE_URL}/work/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...projectEntries];
}
