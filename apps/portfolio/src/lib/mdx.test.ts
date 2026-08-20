import {
  filterExistingPublicImages,
  getProjectCards,
  getProjectSeoMetadata,
  publicAssetExists,
} from './mdx';

describe('getProjectSeoMetadata', () => {
  it('returns title/description built from the project meta for an existing slug', () => {
    const result = getProjectSeoMetadata('meltdown');

    expect(result).toEqual({
      title: 'Meltdown Studios | Seungyeub Baek',
      description: 'Meltdown Studios — Visual Identity 프로젝트 상세입니다.',
    });
  });

  it('returns null for a slug that does not exist', () => {
    const result = getProjectSeoMetadata('non-existent-project-slug');

    expect(result).toBeNull();
  });
});

describe('filterExistingPublicImages', () => {
  it('keeps only paths that actually exist under public/', () => {
    // avatar.jpg는 Header에서 사용 중인 실존 에셋, 나머지는 존재하지 않는 경로
    const result = filterExistingPublicImages([
      '/images/avatar.jpg',
      '/images/projects/02.jpg',
      '/images/work/meltdown/01.jpg',
    ]);

    expect(result).toEqual(['/images/avatar.jpg']);
  });

  it('returns an empty array when no path exists', () => {
    const result = filterExistingPublicImages([
      '/images/work/meltdown/01.jpg',
      '/images/work/meltdown/02.jpg',
    ]);

    expect(result).toEqual([]);
  });

  it('returns an empty array for an empty input', () => {
    expect(filterExistingPublicImages([])).toEqual([]);
  });

  it('rejects directory paths even when they exist under public/', () => {
    // /images는 실존하는 디렉토리지만 일반 파일이 아니므로 거부되어야 한다
    const result = filterExistingPublicImages(['/images']);

    expect(result).toEqual([]);
  });

  it('rejects paths that traverse outside of public/', () => {
    // package.json은 실존하는 파일이지만 public 바깥이므로 반드시 거부되어야 한다
    const result = filterExistingPublicImages(['../package.json', '/../package.json']);

    expect(result).toEqual([]);
  });
});

describe('publicAssetExists', () => {
  it('returns true for a regular file that exists under public/', () => {
    expect(publicAssetExists('/images/avatar.jpg')).toBe(true);
  });

  it('returns false for a file that does not exist', () => {
    expect(publicAssetExists('/resume-not-uploaded-yet.pdf')).toBe(false);
  });

  it('returns false for an existing directory', () => {
    expect(publicAssetExists('/images')).toBe(false);
  });

  it('returns false for paths that traverse outside of public/', () => {
    expect(publicAssetExists('../package.json')).toBe(false);
  });
});

describe('getProjectCards', () => {
  it('derives cards from MDX so that every card links to a real detail page', () => {
    const cards = getProjectCards();

    // 하드코딩 배열에 있던 href='#' 같은 죽은 링크가 생길 수 없어야 한다
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      expect(card.href).toBe(`/work/${card.slug}`);
    });
  });

  it('orders cards by the MDX order field', () => {
    const cards = getProjectCards();
    const orders = cards.map((card) => card.order);

    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('carries MDX metadata through without altering it', () => {
    const cards = getProjectCards();
    const rootwise = cards.find((card) => card.slug === 'rootwise');

    // WorksSection 하드코딩본은 category를 'Brand Identity', image를 02.jpg로
    // 잘못 갖고 있었다. MDX 원본 값이 그대로 실려야 한다.
    expect(rootwise).toEqual({
      slug: 'rootwise',
      title: 'Rootwise Architects',
      category: 'Visual Identity',
      order: 1,
      image: '/images/projects/01.jpg',
      href: '/work/rootwise',
    });
  });
});
