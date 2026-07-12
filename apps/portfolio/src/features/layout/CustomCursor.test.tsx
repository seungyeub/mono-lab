/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import CustomCursor from './CustomCursor';
import { useCursorStore } from '@/src/store/useCursorStore';

// Framer Motion Mocking
jest.mock('framer-motion', () => {
  const removeProps = ({
    initial,
    whileInView,
    viewport,
    transition,
    delay,
    animate,
    exit,
    layout,
    layoutId,
    whileHover,
    ...rest
  }: any) => rest;
  return {
    motion: {
      div: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <div ref={ref} {...removeProps(rest)}>
          {children}
        </div>
      )),
      span: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <span ref={ref} {...removeProps(rest)}>
          {children}
        </span>
      )),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Next.js 라우터 Mocking
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Zustand 스토어 Mocking
jest.mock('@/src/store/useCursorStore');

describe('CustomCursor', () => {
  const mockUseCursorStore = useCursorStore as unknown as jest.Mock;
  const mockSetType = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 상태 변화에 따라 조건부 텍스트 렌더링 검증
  it('스토어 상태가 "view"일 때 "View" 텍스트가 올바르게 렌더링되어야 합니다', () => {
    mockUseCursorStore.mockImplementation((selector) => {
      const state = { type: 'view', setType: mockSetType };
      return selector(state);
    });

    render(<CustomCursor />);

    // 마우스 이벤트 발생시켜 isVisible을 true로 변경
    act(() => {
      fireEvent.mouseMove(window);
    });

    expect(screen.getByText('View')).toBeInTheDocument();
  });

  // 상태 변화에 따라 조건부 텍스트 렌더링 검증
  it('스토어 상태가 "drag"일 때 "Drag" 텍스트가 올바르게 렌더링되어야 합니다', () => {
    mockUseCursorStore.mockImplementation((selector) => {
      const state = { type: 'drag', setType: mockSetType };
      return selector(state);
    });

    render(<CustomCursor />);

    act(() => {
      fireEvent.mouseMove(window);
    });

    expect(screen.getByText('Drag')).toBeInTheDocument();
  });

  // 모바일 환경 방어 로직 (CSS 클래스) 존재 여부 검증
  it('터치 기기에서 렌더링을 막는 CSS 클래스가 포함되어야 합니다', () => {
    mockUseCursorStore.mockImplementation((selector) => {
      const state = { type: 'default', setType: mockSetType };
      return selector(state);
    });

    const { container } = render(<CustomCursor />);

    act(() => {
      fireEvent.mouseMove(window);
    });

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('[@media(hover:hover)_and_(pointer:fine)]:flex');
    expect(wrapper).toHaveClass('hidden');
  });
});
