import { EXPERIENCES } from '@/src/data/experienceData';
import { FAQS } from '@/src/data/faqData';
import { SITE_URL, absoluteUrl } from '@/src/lib/siteConfig';
import {
  buildBreadcrumbSchema,
  buildCreativeWorkSchema,
  buildFaqSchema,
  buildPersonSchema,
  buildWebSiteSchema,
} from '@/src/lib/structuredData';

/**
 * 구조화 데이터는 화면에 보이지 않아 눈으로 회귀를 잡을 수 없다.
 * 크롤러가 실제로 읽는 계약(절대 URL·@id 연결·화면과의 일치)만 좁게 고정한다.
 */

describe('structuredData', () => {
  describe('Person', () => {
    it('경력 항목이 화면의 Experience 데이터와 같은 개수다', () => {
      const person = buildPersonSchema();
      // 구조화 데이터에만 있고 화면에 없는 경력은 허위 주장이 된다
      expect(person.hasOccupation).toHaveLength(EXPERIENCES.length);
    });

    it('period 문자열을 ISO 연월로 바꾼다', () => {
      const person = buildPersonSchema();
      const roles = person.hasOccupation as { startDate?: string; endDate?: string }[];

      // '2020.08 - 2025.08' → 2020-08 / 2025-08
      expect(roles[0]?.startDate).toBe('2020-08');
      expect(roles[0]?.endDate).toBe('2025-08');
    });

    it('형식이 다른 period는 날짜 필드를 아예 만들지 않는다', () => {
      const person = buildPersonSchema();
      const roles = person.hasOccupation as Record<string, unknown>[];

      // 파싱 실패를 빈 문자열로 흘려보내면 크롤러가 잘못된 날짜를 읽는다
      roles.forEach((role) => {
        if ('startDate' in role) expect(role.startDate).toMatch(/^\d{4}-\d{2}$/);
        if ('endDate' in role) expect(role.endDate).toMatch(/^\d{4}-\d{2}$/);
      });
    });

    it('sameAs가 모두 절대 URL이다', () => {
      const person = buildPersonSchema();
      (person.sameAs as string[]).forEach((url) => expect(url).toMatch(/^https:\/\//));
    });
  });

  describe('WebSite', () => {
    it('publisher가 Person의 @id를 가리킨다', () => {
      const site = buildWebSiteSchema();
      const person = buildPersonSchema();

      // 두 스키마가 끊겨 있으면 검색엔진이 사이트와 사람을 별개로 본다
      expect((site.publisher as { '@id': string })['@id']).toBe(person['@id']);
    });
  });

  describe('FAQPage', () => {
    it('화면에 렌더링되는 문답 개수와 같다', () => {
      const faq = buildFaqSchema();
      expect(faq.mainEntity).toHaveLength(FAQS.length);
    });

    it('질문·답변 본문이 화면 데이터와 문자열까지 같다', () => {
      const faq = buildFaqSchema();
      const entities = faq.mainEntity as {
        name: string;
        acceptedAnswer: { text: string };
      }[];

      // 요약하거나 바꿔 쓰면 답변 엔진이 화면에 없는 문장을 인용하게 된다
      FAQS.forEach((source, index) => {
        expect(entities[index]?.name).toBe(source.q);
        expect(entities[index]?.acceptedAnswer.text).toBe(source.a);
      });
    });
  });

  describe('BreadcrumbList', () => {
    it('position이 1부터 순서대로 매겨지고 item이 절대 URL이다', () => {
      const crumb = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Archive', path: '/work' },
        { name: 'mono-lab', path: '/work/mono-lab' },
      ]);
      const items = crumb.itemListElement as { position: number; item: string }[];

      expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
      expect(items[2]?.item).toBe(`${SITE_URL}/work/mono-lab`);
      items.forEach((item) => expect(item.item).toMatch(/^https:\/\//));
    });
  });

  describe('CreativeWork', () => {
    const base = {
      slug: 'demo',
      title: 'Demo',
      category: 'Data Pipeline',
      techStack: ['React', 'TypeScript'],
    };

    it('author가 Person의 @id를 가리키고 URL이 절대 경로다', () => {
      const work = buildCreativeWorkSchema(base);

      expect((work.author as { '@id': string })['@id']).toBe(buildPersonSchema()['@id']);
      expect(work.url).toBe(`${SITE_URL}/work/demo`);
    });

    it('image를 주면 절대 URL로 바꾼다', () => {
      const work = buildCreativeWorkSchema({ ...base, image: '/images/projects/demo.webp' });
      expect(work.image).toBe(`${SITE_URL}/images/projects/demo.webp`);
    });

    it('선택 필드는 값이 없으면 키 자체를 만들지 않는다', () => {
      const work = buildCreativeWorkSchema({ ...base, techStack: [] });

      // 빈 문자열 키가 남으면 검색엔진이 빈 값을 그대로 읽는다
      expect(work).not.toHaveProperty('description');
      expect(work).not.toHaveProperty('image');
      expect(work).not.toHaveProperty('keywords');
    });
  });

  describe('absoluteUrl', () => {
    it('상대 경로를 사이트 URL 기준으로 만든다', () => {
      expect(absoluteUrl('/work')).toBe(`${SITE_URL}/work`);
      expect(absoluteUrl('work')).toBe(`${SITE_URL}/work`);
    });

    it('이미 절대 URL이면 그대로 둔다', () => {
      expect(absoluteUrl('https://example.com/a')).toBe('https://example.com/a');
    });
  });
});
