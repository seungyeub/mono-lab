/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import WorksSection from './WorksSection';

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

describe('WorksSection', () => {
  it('주요 타이틀 및 프로젝트 카드들이 올바르게 렌더링되어야 합니다', () => {
    render(<WorksSection />);

    // 타이틀 렌더링 검증
    expect(screen.getByText('Works.')).toBeInTheDocument();
    expect(screen.getByText(/Selected Works/i)).toBeInTheDocument();

    // 프로젝트 렌더링 검증
    expect(screen.getAllByText('Meltdown Studios')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Rootwise Architects')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Meridiem')[0]).toBeInTheDocument();
  });
});
