import { render, screen } from '@testing-library/react';
import SectionLabel from './SectionLabel';

describe('SectionLabel', () => {
  it('renders correctly with given props', () => {
    render(
      <SectionLabel 
        scene="01" 
        leftLabel="Left Text" 
        rightLabel="Right Text" 
      />
    );

    expect(screen.getByText('Left Text')).toBeInTheDocument();
    expect(screen.getByText('SCENE — 01')).toBeInTheDocument();
    expect(screen.getByText('Right Text')).toBeInTheDocument();
  });
});
