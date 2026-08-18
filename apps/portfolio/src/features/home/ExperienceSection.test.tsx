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

  it('모든 경력의 type이 올바르게 표출되어야 합니다', () => {
    const { container } = render(<ExperienceSection />);

    // 각 회사의 type 검증 (회귀 방지: type → stack 변경, Junier 오타)
    expect(container.textContent).toContain('Co-Founder');
    expect(container.textContent).toContain('Junior');
    expect(container.textContent).toContain('Contractor');
    expect(container.textContent).toContain('Internship');

    // Junier 오타가 없어야 함
    expect(container.textContent).not.toContain('Junier');
  });

  it('딘코퍼레이션의 두 경력 기간이 모두 표출되어야 합니다', () => {
    const { container } = render(<ExperienceSection />);

    // 딘코퍼레이션의 두 근무 기간 검증
    expect(container.textContent).toContain('2019.02 - 2020.06');
    expect(container.textContent).toContain('2018.12 - 2019.01');
  });
});
