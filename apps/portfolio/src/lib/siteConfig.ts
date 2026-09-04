/**
 * 사이트 전역 상수 — 절대 URL이 필요한 곳(canonical·sitemap·robots·OG·JSON-LD)의 단일 소스.
 *
 * 도메인을 여러 파일에 흩어 두면 하나만 고쳐졌을 때 canonical과 sitemap이
 * 서로 다른 호스트를 가리키게 되고, 그 상태는 크롤러에게만 보여서 늦게 발견된다.
 * 커스텀 도메인을 붙이면 여기 SITE_URL 하나만 바꾸면 된다.
 */
export const SITE_URL = 'https://seungyeub.vercel.app';

export const SITE_NAME = 'Seungyeub Baek';

export const SITE_TITLE = 'Seungyeub Baek | Frontend Engineer';

export const SITE_DESCRIPTION =
  'Next.js, React, TypeScript 기반으로 인터페이스와 시스템을 구축하는 프론트엔드 엔지니어 백승엽의 포트폴리오입니다.';

/** 링크 공유 시 미리보기에 쓰는 기본 이미지 (1200x630) */
export const OG_IMAGE = '/images/og-default.png';

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** 문서 언어. 카피 대부분이 한국어이므로 ko가 맞다 (P3-3) */
export const SITE_LOCALE = 'ko_KR';

export const SITE_LANG = 'ko';

/** JSON-LD Person에 싣는 공개 프로필 — Footer·Contact에 이미 노출된 것과 같아야 한다 */
export const SOCIAL_PROFILES = [
  'https://github.com/seungyeub',
  'https://www.linkedin.com/in/seungyeub-baek-23aa9016a/',
];

/** 절대 URL로 만든다. 경로가 이미 절대 URL이면 그대로 둔다. */
export function absoluteUrl(pathname: string): string {
  if (/^https?:\/\//.test(pathname)) return pathname;
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

interface PageOpenGraphInput {
  title: string;
  description: string;
  /** 사이트 루트 기준 경로 */
  path: string;
  type?: 'website' | 'article';
  /** 없으면 사이트 기본 이미지를 쓴다 */
  image?: string;
}

/**
 * 페이지용 Open Graph·Twitter 메타데이터를 만든다.
 *
 * **Next.js의 metadata 병합은 얕다.** 하위 페이지가 `openGraph`를 정의하면
 * 루트의 `openGraph`를 통째로 대체하므로 `images`·`siteName`·`locale`이
 * 사라진다. 페이지마다 손으로 채우면 반드시 빠뜨리는 것이 생기고,
 * 그 결과는 링크를 공유해 봐야만 드러난다.
 *
 * 그래서 공유 필드를 여기서 항상 채운다 — 페이지는 고유한 값만 넘기면 된다.
 */
export function buildPageOpenGraph({
  title,
  description,
  path,
  type = 'website',
  image,
}: PageOpenGraphInput) {
  const images = [
    {
      url: image ?? OG_IMAGE,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt: `${title} — ${SITE_NAME}`,
    },
  ];

  return {
    openGraph: {
      type,
      locale: SITE_LOCALE,
      siteName: SITE_TITLE,
      url: absoluteUrl(path),
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [image ?? OG_IMAGE],
    },
  };
}
