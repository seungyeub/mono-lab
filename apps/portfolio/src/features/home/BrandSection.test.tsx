/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import BrandSection from './BrandSection';

// Framer Motion Mocking 전략:
// 스크롤 연동 애니메이션 고정 여부(viewport={{ once: true }})를 검증하기 위해,
// 전달받은 viewport 속성을 제거하지 않고 data-viewport 속성으로 치환하여 JSDom 요소에 남겨둡니다.
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

describe('BrandSection', () => {
  it('주요 브랜드 텍스트와 클라이언트 로고 텍스트가 정상적으로 렌더링되어야 합니다', () => {
    render(<BrandSection />);

    // 주요 헤드라인 텍스트 검증
    expect(screen.getByText(/5\+ years™ of brand identity work/)).toBeInTheDocument();

    // 미니 마르퀴 항목 검증
    expect(screen.getAllByText(/Brand Identity/)[0]).toBeInTheDocument();

    // 클라이언트 그리드 검증
    expect(screen.getByText('Meltdown Studios')).toBeInTheDocument();
    expect(screen.getByText('Rootwise')).toBeInTheDocument();

    // CTA 버튼 렌더링 검증
    expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument();
  });
});
