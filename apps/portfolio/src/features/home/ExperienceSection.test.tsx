/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render } from '@testing-library/react';
import ExperienceSection from './ExperienceSection';

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

describe('ExperienceSection', () => {
  it('경력 및 자격증 섹션과 주요 데이터가 정상적으로 표출되어야 합니다', () => {
    const { container } = render(<ExperienceSection />);

    // 타이틀 렌더링 검증
    expect(container.textContent).toContain('경력');
    expect(container.textContent).toContain('자격증');

    // 경력 항목 검증
    expect(container.textContent).toContain('(주) 나비이');
    expect(container.textContent).toContain('(주) 딘코퍼레이션');

    // 자격증 항목 검증
    expect(container.textContent).toContain('정보처리기사');
    expect(container.textContent).toContain('한국산업인력공단');
  });
});
