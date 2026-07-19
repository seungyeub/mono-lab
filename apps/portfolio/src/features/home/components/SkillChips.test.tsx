/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { render, screen } from '@testing-library/react';
import SkillChips from './SkillChips';

// framer-motion mock to prevent test warnings/errors
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
    whileHover,
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
  };
});

describe('SkillChips', () => {
  it('전달된 스킬 객체들의 이름이 올바르게 렌더링되어야 합니다', () => {
    const skills = [
      { name: 'React', icon: null, brandColor: '#61DAFB', customIconPath: '/icons/react.svg' },
      { name: 'TypeScript', icon: () => <svg data-testid='ts-icon' />, brandColor: '#3178C6' },
    ];
    render(<SkillChips categoryName='Frontend' skills={skills} indexOffset={0} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
