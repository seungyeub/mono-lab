import type { SkillItem } from '@/src/features/home/skillsData';
import { resolveTechSkills } from './techSkills';

/** resolveTechSkills는 입력 길이를 보존하는 전함수라 구조분해가 안전하다 — 타입에만 알려준다 */
const resolveTuple = <N extends string[]>(...names: N) =>
  resolveTechSkills(names) as { [K in keyof N]: SkillItem };

/** 정식 항목 이름으로 해석했을 때의 brandColor — 별칭이 그 항목에 닿았는지 확인하는 기준 */
const canonicalBrandColor = (canonicalName: string) =>
  resolveTechSkills([canonicalName])[0]!.brandColor;

describe('resolveTechSkills', () => {
  it('버전·괄호가 붙은 표기를 skillsData의 정식 항목으로 매핑한다', () => {
    const [nextjs, react, mysql, spring] = resolveTuple(
      'Next.js 14 (Pages Router)',
      'React 19',
      'MySQL 5.7',
      'Spring 4.3 (MVC/Security)',
    );

    // 표시 이름은 MDX 원문을 유지하고, 아이콘·브랜드 컬러만 정식 항목에서 가져온다
    expect(nextjs.name).toBe('Next.js 14 (Pages Router)');
    expect(nextjs.icon).not.toBeNull();
    expect(react.name).toBe('React 19');
    expect(react.brandColor).toBe('#61DAFB');
    expect(mysql.icon).not.toBeNull();
    expect(spring.icon).not.toBeNull();
  });

  it('별칭(TanStack Query→React Query, docker-compose→Docker 등)을 해석한다', () => {
    const [tanstack, compose, drf, yarn] = resolveTuple(
      'TanStack Query',
      'docker-compose',
      'Django REST Framework',
      'Yarn 4 (PnP)',
    );

    // React Query·yarn-berry는 skillsData에서 커스텀 SVG(customIconPath)를 쓰는 항목이다
    expect(tanstack.icon ?? tanstack.customIconPath).toBeTruthy();
    expect(compose.icon).not.toBeNull();
    expect(drf.icon).not.toBeNull();
    expect(yarn.icon ?? yarn.customIconPath).toBeTruthy();
  });

  it('skillsData에 없는 기술은 보강 아이콘 목록에서 해석한다', () => {
    const [php, postgres, vite] = resolveTuple('PHP', 'PostgreSQL', 'Vite');

    expect(php.icon).not.toBeNull();
    expect(postgres.icon).not.toBeNull();
    expect(vite.icon).not.toBeNull();
  });

  // frontmatter 표기를 다듬을 때 아이콘이 조용히 사라지지 않도록 고정한다
  it('풀어 쓴 표기도 정식 항목으로 해석한다', () => {
    const inputs = [
      'Docker Compose',
      'Stripe API',
      'Yarn Berry',
      'Ant Design Plots',
      'Google Maps API',
      'Google Maps Distance Matrix API',
      'Reactstrap (Bootstrap)',
    ] as const;
    const expectedCanonical = [
      'Docker',
      'Stripe',
      'yarn-berry',
      'Ant Design',
      'Google Maps',
      'Google Maps',
      'Bootstrap',
    ];

    const resolved = resolveTechSkills([...inputs]);

    // 표시 이름은 원문을 유지하되, 아이콘은 의도한 정식 항목에서 와야 한다.
    // 아이콘 유무만 보면 엉뚱한 항목에 붙어도 통과해버린다.
    expect(resolved.map((s) => s.name)).toEqual([...inputs]);
    expect(resolved.map((s) => s.brandColor)).toEqual(
      expectedCanonical.map((name) => canonicalBrandColor(name)),
    );
    resolved.forEach((s) => {
      expect(s.icon ?? s.customIconPath).toBeTruthy();
    });
  });

  it('어디에도 없는 기술은 글자 폴백용 항목으로 돌려준다', () => {
    const [kiwi] = resolveTuple('kiwipiepy');

    expect(kiwi.name).toBe('kiwipiepy');
    expect(kiwi.icon).toBeNull();
    expect(kiwi.customIconPath).toBeUndefined();
  });
});
