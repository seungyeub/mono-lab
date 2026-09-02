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
    slug: 'app-review-tracker',
    title: 'App Review Tracker',
    category: 'Data Pipeline',
    order: 1,
    image: '/images/projects/app-review-tracker.jpg',
    imageExists: false,
    href: '/work/app-review-tracker',
  },
  {
    slug: 'yoga-editor',
    title: 'YogaEditor',
    category: 'Rich Text Editor',
    order: 2,
    image: '/images/projects/yoga-editor.jpg',
    imageExists: false,
    href: '/work/yoga-editor',
  },
  {
    slug: 'kti',
    title: 'KTI 홈페이지 리뉴얼',
    category: 'Website Renewal',
    order: 3,
    image: '/images/projects/kti.jpg',
    imageExists: false,
    href: '/work/kti',
  },
];

describe('WorksSection', () => {
  it('주요 타이틀 및 전달받은 프로젝트 카드들이 올바르게 렌더링되어야 합니다', () => {
    render(<WorksSection projects={PROJECT_CARDS} />);

    // 타이틀 렌더링 검증
    expect(screen.getByText('Works.')).toBeInTheDocument();
    expect(screen.getByText(/Selected Works/i)).toBeInTheDocument();

    // 프로젝트 렌더링 검증
    expect(screen.getAllByText('App Review Tracker')[0]).toBeInTheDocument();
    expect(screen.getAllByText('YogaEditor')[0]).toBeInTheDocument();
    expect(screen.getAllByText('KTI 홈페이지 리뉴얼')[0]).toBeInTheDocument();
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

    // 좌/우 2열 배치(짝수 인덱스 좌, 홀수 인덱스 우) 순서 기준
    expect(cardLinks).toEqual(['/work/app-review-tracker', '/work/kti', '/work/yoga-editor']);
    expect(cardLinks).not.toContain('#');
  });
});
