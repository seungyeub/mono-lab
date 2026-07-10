import { render, screen } from '@testing-library/react';
import SkillsSection from './SkillsSection';

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
    ...rest
  }: any) => rest;
  return {
    motion: {
      div: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <div ref={ref} {...removeProps(rest)}>
          {children}
        </div>
      )),
      h2: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <h2 ref={ref} {...removeProps(rest)}>
          {children}
        </h2>
      )),
      p: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <p ref={ref} {...removeProps(rest)}>
          {children}
        </p>
      )),
      li: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <li ref={ref} {...removeProps(rest)}>
          {children}
        </li>
      )),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useScroll: () => ({ scrollY: { onChange: jest.fn(), get: jest.fn(), getPrevious: jest.fn() } }),
    useTransform: () => ({}),
    useMotionValueEvent: jest.fn(),
  };
});

// IntersectionObserver mock for framer-motion whileInView
beforeAll(() => {
  window.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

describe('SkillsSection', () => {
  it('renders correctly', () => {
    render(<SkillsSection />);
    expect(screen.getByText('Skills.')).toBeInTheDocument();
    expect(screen.getByTestId('skills-section')).toBeInTheDocument();
  });
});
