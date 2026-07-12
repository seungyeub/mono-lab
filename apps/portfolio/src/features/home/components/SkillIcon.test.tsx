/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { render, screen } from '@testing-library/react';
import SkillIcon from './SkillIcon';

describe('SkillIcon', () => {
  it('커스텀 아이콘 경로가 제공된 경우 (예: Framer Motion) 정상적으로 렌더링되어야 합니다', () => {
    const { container } = render(
      <SkillIcon
        skill={{
          name: 'Framer Motion',
          icon: null,
          brandColor: '#0055FF',
          customIconPath: '/icons/framer-motion.svg',
        }}
        colorMode='brand'
      />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('리액트 컴포넌트 아이콘이 제공된 경우 정상적으로 렌더링되어야 합니다', () => {
    const MockReactIcon = () => <svg data-testid='mock-react-icon' />;
    const { container } = render(
      <SkillIcon
        skill={{ name: 'React', icon: MockReactIcon as any, brandColor: '#61DAFB' }}
        colorMode='brand'
      />,
    );
    expect(screen.getByTestId('mock-react-icon')).toBeInTheDocument();
  });
});
