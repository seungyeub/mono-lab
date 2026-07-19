import React from 'react';
import { render } from '@testing-library/react';
import InteractiveCardCanvas from './InteractiveCardCanvas';

// JSDom에서는 WebGL(Three.js) 환경을 렌더링할 수 없으므로 관련 라이브러리들을 Mocking 합니다.
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='mock-canvas'>{children}</div>
  ),
}));

jest.mock('@react-three/drei', () => ({
  Environment: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='mock-environment'>{children}</div>
  ),
  Lightformer: () => <div data-testid='mock-lightformer' />,
}));

jest.mock('@react-three/rapier', () => ({
  Physics: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='mock-physics'>{children}</div>
  ),
}));

jest.mock('./Band', () => {
  return function MockBand() {
    return <div data-testid='mock-band' />;
  };
});

describe('InteractiveCardCanvas', () => {
  // 모바일 환경 드래그 스크롤 간섭 방지 로직 검증
  it('최상위 래퍼에 드래그 충돌 방지용 "touch-none" 클래스가 올바르게 적용되어야 합니다', () => {
    const { container } = render(<InteractiveCardCanvas />);

    // Canvas 외부를 감싸는 첫 번째 래퍼 div 요소
    const wrapper = container.firstChild as HTMLElement;

    // touch-pan-y가 아닌 touch-none이 있어야 스크롤과 3D 드래그 충돌이 발생하지 않음
    expect(wrapper).toHaveClass('touch-none');
    expect(wrapper).not.toHaveClass('touch-pan-y');
  });
});
