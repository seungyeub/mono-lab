/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import FAQSection from './FAQSection';

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
    useScroll: () => ({ scrollY: { onChange: jest.fn(), get: jest.fn(), getPrevious: jest.fn() } }),
    useTransform: () => ({}),
    useMotionValueEvent: jest.fn(),
  };
});

describe('FAQSection', () => {
  it('FAQ 타이틀과 주요 질문 텍스트가 정상적으로 렌더링되어야 합니다', () => {
    render(<FAQSection />);

    // 타이틀 렌더링 검증
    expect(screen.getByText('FAQ.')).toBeInTheDocument();

    // 주요 질문 렌더링 검증
    expect(screen.getByText('주로 사용하는 기술 스택은 무엇인가요?')).toBeInTheDocument();
    expect(screen.getByText('인터페이스는 어떤 방식으로 개발하시나요?')).toBeInTheDocument();
  });
});
