import {
  FEATURED_SLUGS,
  filterExistingPublicImages,
  getFeaturedProjectCards,
  getProjectCards,
  getProjectSeoMetadata,
  normalizeProjectMetadata,
  publicAssetExists,
} from './mdx';

describe('getProjectSeoMetadata', () => {
  it('returns title/description built from the project meta for an existing slug', () => {
    const result = getProjectSeoMetadata('app-review-tracker');

    expect(result).toEqual({
      title: 'App Review Tracker | Seungyeub Baek',
      description: 'App Review Tracker — Data Pipeline 프로젝트 상세입니다.',
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
    const tracker = cards.find((card) => card.slug === 'app-review-tracker');

    // 카드에 별도 하드코딩본을 두면 MDX와 어긋나므로(P0-6),
    // MDX frontmatter 원본 값이 변형 없이 그대로 실려야 한다.
    expect(tracker).toEqual({
      slug: 'app-review-tracker',
      title: 'App Review Tracker',
      category: 'Data Pipeline',
      order: 1,
      image: '/images/projects/app-review-tracker.jpg',
      imageExists: false,
      href: '/work/app-review-tracker',
    });
  });

  // 에셋이 없는 카드는 빈 상자가 아니라 제목을 읽히게 보여줘야 한다
  it('image 경로는 원본 그대로 두고 실존 여부만 따로 알린다', () => {
    const cards = getProjectCards();

    cards.forEach((card) => {
      expect(typeof card.imageExists).toBe('boolean');
      if (card.imageExists) expect(publicAssetExists(card.image)).toBe(true);
    });
  });
});

describe('normalizeProjectMetadata', () => {
  const BASE = {
    title: 'Meltdown Studios',
    category: 'Visual Identity',
    order: 2,
    image: '/images/projects/02.jpg',
  };

  it('keeps the existing required fields as-is', () => {
    const meta = normalizeProjectMetadata({ ...BASE, liveUrl: 'https://example.com' });

    expect(meta.title).toBe('Meltdown Studios');
    expect(meta.category).toBe('Visual Identity');
    expect(meta.order).toBe(2);
    expect(meta.image).toBe('/images/projects/02.jpg');
    expect(meta.liveUrl).toBe('https://example.com');
  });

  // 콘텐츠가 아직 비어 있어도 페이지가 .map/.length를 안전하게 쓸 수 있어야 한다
  it('defaults every new collection to an empty array or object', () => {
    const meta = normalizeProjectMetadata(BASE);

    expect(meta.techStack).toEqual([]);
    expect(meta.overview).toEqual([]);
    expect(meta.features).toEqual([]);
    expect(meta.demonstrations).toEqual([]);
    expect(meta.implementation).toEqual({ highlights: [], codeSnippet: [] });
    expect(meta.impact).toEqual({ metrics: [], outcomes: [] });
    expect(meta.summary).toBeUndefined();
    expect(meta.github).toBeUndefined();
  });

  it('carries structured content through when frontmatter provides it', () => {
    const meta = normalizeProjectMetadata({
      ...BASE,
      summary: '한 문단 설명',
      github: 'https://github.com/seungyeub/example',
      techStack: ['Next.js', 'TypeScript'],
      overview: [{ title: '문제', description: '설명' }],
      features: [{ title: '기능', description: '설명' }],
      implementation: { architecture: 'Next.js App Router', highlights: ['h1', 'h2'] },
      demonstrations: [{ title: '데모', images: ['/a.png'], description: '설명', outcome: '결과' }],
      impact: { metrics: [{ label: 'LCP', value: '1.2s' }], outcomes: ['성과'] },
    });

    expect(meta.summary).toBe('한 문단 설명');
    expect(meta.github).toBe('https://github.com/seungyeub/example');
    expect(meta.techStack).toEqual(['Next.js', 'TypeScript']);
    expect(meta.overview).toEqual([{ title: '문제', description: '설명' }]);
    expect(meta.features).toEqual([{ title: '기능', description: '설명' }]);
    expect(meta.implementation).toEqual({
      architecture: 'Next.js App Router',
      highlights: ['h1', 'h2'],
      codeSnippet: [],
    });
    expect(meta.demonstrations).toEqual([
      { title: '데모', images: ['/a.png'], description: '설명', outcome: '결과' },
    ]);
    expect(meta.impact).toEqual({ metrics: [{ label: 'LCP', value: '1.2s' }], outcomes: ['성과'] });
  });

  it('drops entries that are missing the fields the UI renders', () => {
    const meta = normalizeProjectMetadata({
      ...BASE,
      techStack: ['Next.js', '', 42],
      features: [{ title: '유효', description: '설명' }, { description: '제목 없음' }, null],
      overview: [{ title: '유효', description: '설명' }, { title: '' }],
      impact: {
        metrics: [{ label: 'LCP', value: '1.2s' }, { label: 'no value' }],
        outcomes: ['ok', ''],
      },
      demonstrations: [{ title: '유효', images: ['/a.png'] }, { images: ['/b.png'] }],
    });

    expect(meta.techStack).toEqual(['Next.js']);
    expect(meta.features).toEqual([{ title: '유효', description: '설명' }]);
    expect(meta.overview).toEqual([{ title: '유효', description: '설명' }]);
    expect(meta.impact.metrics).toEqual([{ label: 'LCP', value: '1.2s' }]);
    expect(meta.impact.outcomes).toEqual(['ok']);
    expect(meta.demonstrations).toEqual([{ title: '유효', images: ['/a.png'] }]);
  });

  it('tolerates completely malformed frontmatter', () => {
    const meta = normalizeProjectMetadata(undefined);

    expect(meta.techStack).toEqual([]);
    expect(meta.impact).toEqual({ metrics: [], outcomes: [] });
  });
});

describe('normalizeProjectMetadata — 리디자인 확장 필드', () => {
  const BASE = {
    title: 'T',
    category: 'C',
    order: 1,
    image: '/images/projects/t.jpg',
  };

  it('defaults carouselImages to an empty array', () => {
    expect(normalizeProjectMetadata(BASE).carouselImages).toEqual([]);
  });

  it('carries carouselImages and code snippet fields through', () => {
    const meta = normalizeProjectMetadata({
      ...BASE,
      carouselImages: ['/a.png', '', 3, '/b.png'],
      implementation: {
        highlights: ['h'],
        codeSnippet: 'const a = 1;\nconst b = 2;',
        codeCaption: '핵심 로직 요약',
      },
    });

    expect(meta.carouselImages).toEqual(['/a.png', '/b.png']);
    expect(meta.implementation.codeSnippet).toEqual(['const a = 1;\nconst b = 2;']);
    expect(meta.implementation.codeCaption).toBe('핵심 로직 요약');
  });

  it('codeSnippet은 단일 문자열로 써도 배열 1개로 정규화된다', () => {
    const meta = normalizeProjectMetadata({
      ...BASE,
      implementation: { codeSnippet: 'single block' },
    });

    expect(meta.implementation.codeSnippet).toEqual(['single block']);
  });

  it('codeSnippet 배열은 순서를 지키고 빈 항목만 걸러낸다', () => {
    const meta = normalizeProjectMetadata({
      ...BASE,
      implementation: { codeSnippet: ['block A', '', 'block B', 7] },
    });

    expect(meta.implementation.codeSnippet).toEqual(['block A', 'block B']);
  });

  it('codeSnippet이 없으면 빈 배열이다', () => {
    expect(normalizeProjectMetadata(BASE).implementation.codeSnippet).toEqual([]);
  });

  it('codeNote(코드 출처·기여 주석)를 통과시킨다', () => {
    const meta = normalizeProjectMetadata({
      ...BASE,
      implementation: { codeSnippet: 'x', codeNote: '코드 작성 주체는 AI' },
    });

    expect(meta.implementation.codeNote).toBe('코드 작성 주체는 AI');
  });
});

describe('getFeaturedProjectCards', () => {
  it('returns only the slugs listed in FEATURED_SLUGS, in that exact order', () => {
    const cards = getFeaturedProjectCards();

    expect(cards.map((c) => c.slug)).toEqual([...FEATURED_SLUGS]);
  });

  it('every featured slug resolves to a real project (오타·삭제 감지)', () => {
    const known = new Set(getProjectCards().map((c) => c.slug));

    FEATURED_SLUGS.forEach((slug) => {
      expect(known.has(slug)).toBe(true);
    });
  });

  it('exposes exactly six featured projects for the home showcase', () => {
    expect(FEATURED_SLUGS).toHaveLength(6);
  });
});
