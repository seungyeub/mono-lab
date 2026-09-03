import { EXPERIENCES } from '@/src/data/experienceData';
import { FAQS } from '@/src/data/faqData';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
} from '@/src/lib/siteConfig';

/**
 * schema.org 구조화 데이터 빌더.
 *
 * 모두 화면에 이미 있는 내용만 옮긴다 — 구조화 데이터에만 있고 본문에 없는 주장은
 * 검색엔진이 스팸으로 볼 수 있고, 무엇보다 사실이 어긋나기 시작하는 지점이다.
 */

/** `2020.08 - 2025.08` → `{ start: '2020-08', end: '2025-08' }`. 형식이 다르면 undefined */
function parsePeriod(period: string): { start?: string; end?: string } {
  const match = /^(\d{4})\.(\d{2})\s*-\s*(\d{4})\.(\d{2})$/.exec(period.trim());
  if (!match) return {};
  const [, sy, sm, ey, em] = match;
  return { start: `${sy}-${sm}`, end: `${ey}-${em}` };
}

/** 사람 — 이 사이트의 주체. 경력은 화면의 Experience 표와 같은 데이터를 쓴다 */
export function buildPersonSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: SITE_NAME,
    alternateName: '백승엽',
    url: SITE_URL,
    jobTitle: 'Frontend Engineer',
    description: SITE_DESCRIPTION,
    sameAs: SOCIAL_PROFILES,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Seoul',
      addressCountry: 'KR',
    },
    knowsAbout: ['Frontend Engineering', 'React', 'Next.js', 'TypeScript', 'Web Accessibility'],
    hasOccupation: EXPERIENCES.map((experience) => {
      const { start, end } = parsePeriod(experience.period);
      return {
        '@type': 'OrganizationRole',
        roleName: experience.role,
        ...(start ? { startDate: start } : {}),
        ...(end ? { endDate: end } : {}),
        memberOf: {
          '@type': 'Organization',
          name: experience.company,
        },
      };
    }),
  };
}

/** 사이트 자체 */
export function buildWebSiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    inLanguage: 'ko-KR',
    publisher: { '@id': `${SITE_URL}/#person` },
  };
}

/**
 * 홈의 FAQ 섹션.
 * 답변 엔진이 그대로 인용할 수 있는 형태라 AEO에서 가장 효율이 높은 항목이다.
 */
export function buildFaqSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

/** 프로젝트 상세 — 경로 계층을 크롤러에게 알린다 */
export function buildBreadcrumbSchema(
  trail: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

/** 프로젝트 상세 본문 — 저자와 기술 키워드를 명시한다 */
export function buildCreativeWorkSchema(project: {
  slug: string;
  title: string;
  category: string;
  summary?: string;
  image?: string;
  techStack: string[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': absoluteUrl(`/work/${project.slug}#work`),
    name: project.title,
    url: absoluteUrl(`/work/${project.slug}`),
    genre: project.category,
    inLanguage: 'ko-KR',
    ...(project.summary ? { description: project.summary } : {}),
    ...(project.image ? { image: absoluteUrl(project.image) } : {}),
    ...(project.techStack.length > 0 ? { keywords: project.techStack.join(', ') } : {}),
    author: { '@id': `${SITE_URL}/#person` },
  };
}
