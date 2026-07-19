/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
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
    ...rest
  }: Record<string, unknown>) => rest;
  return {
    motion: {
      div: React.forwardRef(({ children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>, ref: React.ForwardedRef<any>) => (
        <div ref={ref} {...removeProps(rest)}>
          {children}
        </div>
      )),
      span: React.forwardRef(({ children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>, ref: React.ForwardedRef<any>) => (
        <span ref={ref} {...removeProps(rest)}>
          {children}
        </span>
      )),
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    useScroll: () => ({ scrollY: { onChange: jest.fn(), get: jest.fn(), getPrevious: jest.fn() } }),
    useTransform: () => ({}),
    useMotionValueEvent: jest.fn(),
  };
});

// Zustand 스토어 Mocking
jest.mock('@/src/store/useCursorStore');

describe('Footer', () => {
  const mockUseCursorStore = useCursorStore as unknown as jest.Mock;

  beforeEach(() => {
    mockUseCursorStore.mockImplementation((selector) => {
      const state = { setType: jest.fn() };
      return selector(state);
    });
  });

  // 시스템 커서 억제 클래스 존재 여부 검증
  it('거대 텍스트 영역에 시스템 커서 노출을 억제하는 "cursor-none" 클래스가 적용되어야 합니다', () => {
    render(<Footer />);

    // SEUNGYEUB 텍스트가 렌더링된 요소를 찾아 부모(motion.div)의 클래스를 확인합니다.
    const textElement = screen.getByText('SEUNGYEUB');
    const container = textElement.closest('div');

    // cursor-none 클래스가 추가되었는지 검증 (마우스 오버 시 시스템 커서 억제용)
    expect(container).toHaveClass('cursor-none');
    expect(container).not.toHaveClass('cursor-default');
  });
});
