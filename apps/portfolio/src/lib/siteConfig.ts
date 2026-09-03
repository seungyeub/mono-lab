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
