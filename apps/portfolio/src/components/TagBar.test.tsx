import { render, screen } from '@testing-library/react';

import TagBar from './TagBar';

/**
 * TagBar는 Skills·Experience·Epilogue 세 곳이 공유한다.
 * Skills만 좁은 화면에서 숨기기로 했으므로(P3-9), 그 구분이 호출부의 className으로
 * 이뤄진다는 계약을 고정한다 — 컴포넌트 자체가 반응형을 결정하면 나머지 두 곳까지
 * 같이 바뀐다.
 */
describe('TagBar', () => {
  const TAGS = ['Frontend', 'Backend & DB', 'DevOps & Infra', 'Tooling & Config', 'AI Tools'];

  it('전달된 태그를 순서대로 모두 렌더링한다', () => {
    render(<TagBar tags={TAGS} />);

    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items).toEqual(TAGS);
  });

  it('className을 최상위 요소에 붙여 호출부가 표시 여부를 정할 수 있다', () => {
    const { container } = render(<TagBar tags={TAGS} className='hidden md:block' />);
    const root = container.firstElementChild;

    // Skills가 md 미만에서 숨기는 방식이다. 컴포넌트를 고치지 않고 호출부에서 제어한다.
    expect(root).toHaveClass('hidden', 'md:block');
  });

  it('className을 주지 않으면 숨김 클래스가 붙지 않는다', () => {
    const { container } = render(<TagBar tags={TAGS} />);
    const root = container.firstElementChild;

    // Experience·Epilogue는 그대로 보여야 한다
    expect(root).not.toHaveClass('hidden');
  });

  it('hideFromIndex 이상의 태그에만 sm 미만 숨김 클래스를 준다', () => {
    render(<TagBar tags={TAGS} hideFromIndex={3} />);
    const items = screen.getAllByRole('listitem');

    expect(items[2]).not.toHaveClass('hidden');
    expect(items[3]).toHaveClass('hidden', 'sm:block');
  });
});
