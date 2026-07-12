/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { render, screen } from '@testing-library/react';
import SkillsSection from './SkillsSection';

// framer-motion mock
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
    ...rest
  }: any) => rest;

  return {
    motion: {
      div: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <div ref={ref} {...removeProps(rest)}>
          {children}
        </div>
      )),
      h2: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <h2 ref={ref} {...removeProps(rest)}>
          {children}
        </h2>
      )),
      p: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <p ref={ref} {...removeProps(rest)}>
          {children}
        </p>
      )),
      li: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <li ref={ref} {...removeProps(rest)}>
          {children}
        </li>
      )),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useScroll: () => ({ scrollY: { onChange: jest.fn(), get: jest.fn(), getPrevious: jest.fn() } }),
    useTransform: () => ({}),
    useMotionValueEvent: jest.fn(),
  };
});

// IntersectionObserver mock
beforeAll(() => {
  window.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

describe('SkillsSection', () => {
  it('Skills 타이틀과 핵심 기술 스택이 화면에 렌더링되어야 합니다', () => {
    render(<SkillsSection />);

    expect(screen.getByText('Skills.')).toBeInTheDocument();

    // 특정 카테고리가 렌더링되었는지 확인 (예: Frontend, Backend 등)
    expect(screen.getAllByText('Frontend')[0]).toBeInTheDocument();

    // 주요 기술 스택이 표출되는지 확인
    expect(screen.getAllByText('React.js')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Next.js')[0]).toBeInTheDocument();
    expect(screen.getAllByText('TypeScript')[0]).toBeInTheDocument();
  });
});
