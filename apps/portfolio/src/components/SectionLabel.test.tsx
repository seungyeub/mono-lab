import { render, screen } from '@testing-library/react';
import SectionLabel from './SectionLabel';

describe('SectionLabel', () => {
  it('주어진 props(scene, leftLabel, rightLabel)가 화면에 올바르게 렌더링되어야 합니다', () => {
    render(<SectionLabel scene='01' leftLabel='EXPERIENCE' rightLabel='WORKS' />);

    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
    expect(screen.getByText('SCENE — 01')).toBeInTheDocument();
    expect(screen.getByText('WORKS')).toBeInTheDocument();
  });
});
