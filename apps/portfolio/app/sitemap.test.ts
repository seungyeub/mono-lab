import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { getAllProjects } from '@/src/lib/mdx';
import { SITE_URL } from '@/src/lib/siteConfig';

/**
 * sitemap·robots는 화면에 없어 눈으로 회귀를 잡을 수 없고,
 * 잘못돼도 크롤러에게만 보인다. 계약을 테스트로 고정한다.
 */

describe('sitemap', () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it('MDX 프로젝트를 하나도 빠뜨리지 않는다', () => {
    // 목록을 손으로 관리하면 MDX 추가 시 누락된다 — 같은 소스에서 나와야 한다
    getAllProjects().forEach(({ slug }) => {
      expect(urls).toContain(`${SITE_URL}/work/${slug}`);
    });
  });

  it('정적 라우트를 모두 담는다', () => {
    expect(urls).toEqual(
      expect.arrayContaining([
        SITE_URL,
        `${SITE_URL}/work`,
        `${SITE_URL}/resume`,
        `${SITE_URL}/contact`,
      ]),
    );
  });

  it('리다이렉트되는 구 경로는 싣지 않는다', () => {
    // /gallery는 /resume로 301된다 — 색인시키면 중복 신호가 된다
    expect(urls).not.toContain(`${SITE_URL}/gallery`);
  });

  it('모든 URL이 사이트 도메인의 절대 경로이고 중복이 없다', () => {
    urls.forEach((url) => expect(url.startsWith(`${SITE_URL}`)).toBe(true));
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('lastModified를 내보내지 않는다', () => {
    // 생성 시각을 넣으면 재배포마다 모든 페이지가 수정된 것으로 알려져
    // 크롤러가 이 신호를 신뢰하지 않게 된다 (sitemaps.org 프로토콜)
    entries.forEach((entry) => expect(entry.lastModified).toBeUndefined());
  });

  it('priority가 0과 1 사이이고 홈이 가장 높다', () => {
    entries.forEach((entry) => {
      expect(entry.priority).toBeGreaterThanOrEqual(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
    });

    const home = entries.find((entry) => entry.url === SITE_URL);
    expect(home?.priority).toBe(1);
  });
});

describe('robots', () => {
  const result = robots();

  it('sitemap 위치를 절대 URL로 알린다', () => {
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it('전체 크롤링을 허용한다', () => {
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules?.userAgent).toBe('*');
    expect(rules?.allow).toBe('/');
    // 공개 포트폴리오라 숨길 경로가 없다 — disallow가 생기면 의도한 변경인지 확인해야 한다
    expect(rules?.disallow).toBeUndefined();
  });
});
