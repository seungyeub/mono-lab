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
      span: React.forwardRef(
        (
          { children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>,
          ref: React.ForwardedRef<any>,
        ) => (
          <span ref={ref} {...removeProps(rest)}>
            {children}
          </span>
        ),
      ),
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    useScroll: () => ({ scrollY: { onChange: jest.fn(), get: jest.fn(), getPrevious: jest.fn() } }),
    useTransform: () => ({}),
    useMotionValueEvent: jest.fn(),
  };
});

// MDX(getProjectCards)에서 넘어오는 형태와 동일한 카드 데이터
const PROJECT_CARDS = [
  {
    slug: 'rootwise',
    title: 'Rootwise Architects',
    category: 'Visual Identity',
    order: 1,
    image: '/images/projects/01.jpg',
    href: '/work/rootwise',
  },
  {
    slug: 'meltdown',
    title: 'Meltdown Studios',
    category: 'Visual Identity',
    order: 2,
    image: '/images/projects/02.jpg',
    href: '/work/meltdown',
  },
  {
    slug: 'meridiem',
    title: 'Meridiem',
    category: 'Brand Identity',
    order: 3,
    image: '/images/projects/03.jpg',
    href: '/work/meridiem',
  },
];

describe('WorksSection', () => {
  it('주요 타이틀 및 전달받은 프로젝트 카드들이 올바르게 렌더링되어야 합니다', () => {
    render(<WorksSection projects={PROJECT_CARDS} />);

    // 타이틀 렌더링 검증
    expect(screen.getByText('Works.')).toBeInTheDocument();
    expect(screen.getByText(/Selected Works/i)).toBeInTheDocument();

    // 프로젝트 렌더링 검증
    expect(screen.getAllByText('Meltdown Studios')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Rootwise Architects')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Meridiem')[0]).toBeInTheDocument();
  });

  it('카드 순번은 MDX order를 2자리로 표기해야 합니다', () => {
    render(<WorksSection projects={PROJECT_CARDS} />);

    expect(screen.getByText('(01)')).toBeInTheDocument();
    expect(screen.getByText('(02)')).toBeInTheDocument();
    expect(screen.getByText('(03)')).toBeInTheDocument();
  });

  it('모든 카드 링크가 상세 페이지를 가리켜야 합니다(죽은 링크 방지)', () => {
    render(<WorksSection projects={PROJECT_CARDS} />);

    // 카드 링크만 추출 (See All Works 버튼은 /work 으로 별도 존재)
    const cardLinks = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
      .filter((href) => href !== '/work');

    expect(cardLinks).toEqual(['/work/rootwise', '/work/meridiem', '/work/meltdown']);
    expect(cardLinks).not.toContain('#');
  });
});
