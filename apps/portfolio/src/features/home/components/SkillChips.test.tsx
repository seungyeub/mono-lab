import { render, screen } from '@testing-library/react';
import SkillChips from './SkillChips';

// framer-motion mock to prevent test warnings/errors
jest.mock('framer-motion', () => {
  const React = require('react');
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
  }: any) => rest;
  return {
    motion: {
      div: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <div ref={ref} {...removeProps(rest)}>
          {children}
        </div>
      )),
      li: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <li ref={ref} {...removeProps(rest)}>
          {children}
        </li>
      )),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('SkillChips', () => {
  it('renders correctly', () => {
    const skills = [
      { name: 'Skill 1', icon: null, brandColor: '#000', customIconPath: '/icon.svg' },
      { name: 'Skill 2', icon: () => <svg data-testid='mock-icon' />, brandColor: '#fff' },
    ];
    render(<SkillChips categoryName='Test' skills={skills} indexOffset={0} />);
    expect(screen.getByText('Skill 1')).toBeInTheDocument();
    expect(screen.getByText('Skill 2')).toBeInTheDocument();
  });
});
