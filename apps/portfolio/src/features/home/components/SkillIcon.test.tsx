/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { render, screen } from '@testing-library/react';
import SkillIcon from './SkillIcon';

describe('SkillIcon', () => {
  it('renders correctly with custom icon path', () => {
    const { container } = render(
      <SkillIcon
        skill={{
          name: 'Custom Skill',
          icon: null,
          brandColor: '#fff',
          customIconPath: '/icons/custom.svg',
        }}
        colorMode='brand'
      />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders correctly with simple icon', () => {
    const MockIcon = () => <svg data-testid='mock-icon' />;
    const { container } = render(
      <SkillIcon
        skill={{ name: 'React', icon: MockIcon as any, brandColor: '#61DAFB' }}
        colorMode='brand'
      />,
    );
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });
});
