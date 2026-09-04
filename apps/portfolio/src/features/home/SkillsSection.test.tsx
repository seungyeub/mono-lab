/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { render, screen } from '@testing-library/react';
import SkillsSection from './SkillsSection';
import { SKILL_TAGS } from './skillsData';

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
  }: Record<string, unknown>) => rest;

  return {
    motion: {
      div: React.forwardRef(
        (
          { children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>,
          ref: React.ForwardedRef<any>,
        ) => (
          <div ref={ref} {...removeProps(rest)}>
            {children}
          </div>
        ),
      ),
      h2: React.forwardRef(
        (
          { children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>,
          ref: React.ForwardedRef<any>,
        ) => (
          <h2 ref={ref} {...removeProps(rest)}>
            {children}
          </h2>
        ),
      ),
      p: React.forwardRef(
        (
          { children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>,
          ref: React.ForwardedRef<any>,
        ) => (
          <p ref={ref} {...removeProps(rest)}>
            {children}
          </p>
        ),
      ),
      li: React.forwardRef(
        (
          { children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>,
          ref: React.ForwardedRef<any>,
        ) => (
          <li ref={ref} {...removeProps(rest)}>
            {children}
          </li>
        ),
      ),
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
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

  it('TagBar를 md(768px) 미만에서 통째로 숨긴다 (P3-9)', () => {
    const { container } = render(<SkillsSection />);
    const bar = container.querySelector('ul')?.closest('div.hidden');

    // 좁은 화면에서 태그 5개가 빽빽해지는 문제라 바 전체를 숨긴다.
    // Experience·Epilogue는 이 클래스를 받지 않아 그대로 노출된다.
    expect(bar).not.toBeNull();
    expect(bar).toHaveClass('hidden', 'md:block');
  });

  it('태그 5개를 모두 렌더링한다', () => {
    render(<SkillsSection />);

    // 바가 보이는 구간(768px 이상)은 sm도 넘으므로 li의 sm:block이 적용돼
    // 개별 태그가 숨겨지는 일은 없다 — 5개가 항상 함께 보인다
    SKILL_TAGS.forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    });
  });
});
