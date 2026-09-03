import { render, screen } from '@testing-library/react';
import type { ProjectCard } from '@/src/lib/mdx';
import WorkGrid from './WorkGrid';

/**
 * WorkGrid는 2열이 되는 구간에서만 카드 리빌에 열 위치 지연을 준다.
 * 모바일은 카드마다 별도 행이라 지연이 붙으면 짝수·홀수가 다른 속도로 뜨는 것처럼
 * 보이므로, 미디어 쿼리 결과에 따라 delay가 달라지는 계약을 고정한다.
 */

const PROJECTS: ProjectCard[] = [
  {
    slug: 'app-review-tracker',
    title: 'App Review Tracker',
    category: 'Data Pipeline',
    order: 1,
    image: '/images/projects/app-review-tracker.webp',
    imageExists: true,
    href: '/work/app-review-tracker',
  },
  {
    slug: 'kti',
    title: 'KTI 홈페이지 리뉴얼',
    category: 'Website Renewal',
    order: 3,
    image: '/images/projects/kti.webp',
    imageExists: true,
    href: '/work/kti',
  },
  {
    slug: 'yoga-editor',
    title: 'YogaEditor',
    category: 'Rich Text Editor',
    order: 2,
    image: '/images/projects/yoga-editor.jpg',
    imageExists: false,
    href: '/work/yoga-editor',
  },
];

/** framer-motion의 transition을 DOM 속성으로 드러내 지연 값을 검증할 수 있게 한다 */
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      transition,
      whileInView,
      viewport,
      initial,
      animate,
      ...rest
    }: Record<string, unknown> & { children?: React.ReactNode }) => (
      <div
        data-delay={(transition as { delay?: number } | undefined)?.delay}
        data-reveal={whileInView ? 'whileInView' : undefined}
        data-viewport-once={(viewport as { once?: boolean } | undefined)?.once ? 'true' : undefined}
        data-has-initial={initial ? 'true' : undefined}
        data-mount-animate={animate ? 'true' : undefined}
        {...rest}
      >
        {children}
      </div>
    ),
  },
}));

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>();
  const removeEventListener = jest.fn((_: string, cb: () => void) => listeners.delete(cb));

  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: jest.fn((_: string, cb: () => void) => listeners.add(cb)),
    removeEventListener,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  return { removeEventListener };
}

/** 카드 래퍼의 data-delay를 순서대로 읽는다 */
function cardDelays() {
  return screen
    .getAllByRole('link')
    .map((link) => link.closest('[data-delay]')?.getAttribute('data-delay'))
    .filter((v): v is string => v !== undefined && v !== null);
}

describe('WorkGrid', () => {
  it('모바일(1열)에서는 모든 카드의 지연이 0이다', () => {
    mockMatchMedia(false);
    render(<WorkGrid projects={PROJECTS} />);

    // 카드마다 별도 행이므로 열 위치 지연이 붙으면 안 된다
    expect(cardDelays()).toEqual(['0', '0', '0']);
  });

  it('2열 구간에서는 홀수 인덱스 카드만 지연된다', () => {
    mockMatchMedia(true);
    render(<WorkGrid projects={PROJECTS} />);

    // 같은 행의 두 장을 좌 → 우로 어긋나게 한다
    expect(cardDelays()).toEqual(['0', '0.08', '0']);
  });

  it('카드는 마운트가 아니라 뷰포트 진입 시 한 번만 리빌한다', () => {
    mockMatchMedia(false);
    render(<WorkGrid projects={PROJECTS} />);

    const wrappers = screen
      .getAllByRole('link')
      .map((link) => link.closest('[data-delay]'))
      .filter((el): el is HTMLElement => el !== null);

    wrappers.forEach((el) => {
      expect(el).toHaveAttribute('data-reveal', 'whileInView');
      expect(el).toHaveAttribute('data-viewport-once', 'true');
      expect(el).toHaveAttribute('data-has-initial', 'true');
      // animate를 쓰면 화면 밖 카드가 이미 끝난 채로 스크롤된다
      expect(el).not.toHaveAttribute('data-mount-animate');
    });
  });

  it('언마운트 시 미디어 쿼리 리스너를 정리한다', () => {
    const { removeEventListener } = mockMatchMedia(false);
    const { unmount } = render(<WorkGrid projects={PROJECTS} />);

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('전달받은 순서 그대로 렌더링하고 죽은 링크를 만들지 않는다', () => {
    mockMatchMedia(false);
    render(<WorkGrid projects={PROJECTS} />);

    const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'));

    expect(hrefs).toEqual(['/work/app-review-tracker', '/work/kti', '/work/yoga-editor']);
    expect(hrefs).not.toContain('#');
  });
});
