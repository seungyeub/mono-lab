import { reveal, type RevealVariant } from '@/lib/motion';

/**
 * 등장 효과의 값이 이 파일 하나에 모여 있으므로(P3-12), 여기서 값이 바뀌면 홈과
 * 목록의 여러 화면이 함께 바뀐다. 의도치 않은 변경을 잡기 위해 프리셋별 반환을 고정한다.
 */

const VARIANTS: RevealVariant[] = [
  'projectsCard',
  'gridCard',
  'displayTitle',
  'sectionTitle',
  'sectionLead',
  'listItem',
  'faqItem',
  'smallItem',
];

describe('reveal', () => {
  it.each(VARIANTS)('%s — 공통 구조를 갖춘다', (variant) => {
    const props = reveal(variant);

    expect(props.initial).toEqual({ opacity: 0, y: expect.any(Number) });
    expect(props.whileInView).toEqual({ opacity: 1, y: 0 });
    // 한 번만 재생한다 — 스크롤을 오르내릴 때마다 다시 나타나면 산만하다
    expect(props.viewport).toEqual({ once: true, margin: expect.any(String) });
    expect(props.transition).toMatchObject({ duration: expect.any(Number), delay: 0 });
  });

  it('delay를 넘기지 않으면 0이고, 넘기면 그대로 실린다', () => {
    expect(reveal('listItem')).toMatchObject({ transition: { delay: 0 } });
    expect(reveal('listItem', 0.24)).toMatchObject({ transition: { delay: 0.24 } });
  });

  it('projectsCard는 화면에 닿는 순간 1.0초로 시작한다 (P6 조정값)', () => {
    // 이전 값(-80px · 0.9초)에서는 카드가 이미 보이는 상태에서 시작해 빈 상자가 노출됐다
    const props = reveal('projectsCard');

    expect(props.initial).toEqual({ opacity: 0, y: 40 });
    expect(props.viewport).toMatchObject({ margin: '0px' });
    expect(props.transition).toMatchObject({ duration: 1 });
  });

  it('프리셋마다 margin과 duration이 독립적으로 유지된다', () => {
    const grid = reveal('gridCard');
    const display = reveal('displayTitle');

    expect(grid.viewport).toMatchObject({ margin: '-80px' });
    expect(grid.transition).toMatchObject({ duration: 0.7 });
    expect(display.viewport).toMatchObject({ margin: '-40px' });
    expect(display.transition).toMatchObject({ duration: 1.2 });
  });

  it('ease가 정의된 프리셋은 4개 수를 그대로 넘긴다', () => {
    expect(reveal('projectsCard').transition).toMatchObject({ ease: [0.16, 1, 0.3, 1] });
  });
});
