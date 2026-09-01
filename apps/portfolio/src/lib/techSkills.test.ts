import { resolveTechSkills } from './techSkills';

describe('resolveTechSkills', () => {
  it('버전·괄호가 붙은 표기를 skillsData의 정식 항목으로 매핑한다', () => {
    const [nextjs, react, mysql, spring] = resolveTechSkills([
      'Next.js 14 (Pages Router)',
      'React 19',
      'MySQL 5.7',
      'Spring 4.3 (MVC/Security)',
    ]);

    // 표시 이름은 MDX 원문을 유지하고, 아이콘·브랜드 컬러만 정식 항목에서 가져온다
    expect(nextjs.name).toBe('Next.js 14 (Pages Router)');
    expect(nextjs.icon).not.toBeNull();
    expect(react.name).toBe('React 19');
    expect(react.brandColor).toBe('#61DAFB');
    expect(mysql.icon).not.toBeNull();
    expect(spring.icon).not.toBeNull();
  });

  it('별칭(TanStack Query→React Query, docker-compose→Docker 등)을 해석한다', () => {
    const [tanstack, compose, drf, yarn] = resolveTechSkills([
      'TanStack Query',
      'docker-compose',
      'Django REST Framework',
      'Yarn 4 (PnP)',
    ]);

    // React Query·yarn-berry는 skillsData에서 커스텀 SVG(customIconPath)를 쓰는 항목이다
    expect(tanstack.icon ?? tanstack.customIconPath).toBeTruthy();
    expect(compose.icon).not.toBeNull();
    expect(drf.icon).not.toBeNull();
    expect(yarn.icon ?? yarn.customIconPath).toBeTruthy();
  });

  it('skillsData에 없는 기술은 보강 아이콘 목록에서 해석한다', () => {
    const [php, postgres, vite] = resolveTechSkills(['PHP', 'PostgreSQL', 'Vite']);

    expect(php.icon).not.toBeNull();
    expect(postgres.icon).not.toBeNull();
    expect(vite.icon).not.toBeNull();
  });

  it('어디에도 없는 기술은 글자 폴백용 항목으로 돌려준다', () => {
    const [kiwi] = resolveTechSkills(['kiwipiepy']);

    expect(kiwi.name).toBe('kiwipiepy');
    expect(kiwi.icon).toBeNull();
    expect(kiwi.customIconPath).toBeUndefined();
  });
});
