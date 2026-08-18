import { getProjectSeoMetadata } from './mdx';

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
