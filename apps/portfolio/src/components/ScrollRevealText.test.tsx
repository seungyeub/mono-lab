/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render } from '@testing-library/react';
import ScrollRevealText from './ScrollRevealText';
import { useScroll, useTransform } from 'framer-motion';

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
      span: React.forwardRef(({ children, ...rest }: any, ref: any) => (
        <span ref={ref} {...removeProps(rest)}>
          {children}
        </span>
      )),
    },
    useScroll: jest.fn(() => ({
      scrollYProgress: {
        onChange: jest.fn(),
        get: jest.fn(),
        getPrevious: jest.fn(),
      },
    })),
    // useTransform mock: return a dummy value
    useTransform: jest.fn(() => 1),
  };
});

describe('ScrollRevealText', () => {
  it('전달된 lines 배열의 문장들이 올바르게 단어 단위로 쪼개져 렌더링되어야 합니다', () => {
    const { container } = render(
      <ScrollRevealText
        lines={['보이지 않는 탄탄한 구조와', '타협하지 않는 시각적 섬세함을 결합해']}
      />,
    );

    // '보이지', '않는', '탄탄한', '구조와', '타협하지', '시각적', '섬세함을', '결합해' - 총 9단어 (않는 중복)
    expect(container.textContent).toContain('보이지');
    expect(container.textContent).toContain('탄탄한');
    expect(container.textContent).toContain('구조와');
    expect(container.textContent).toContain('타협하지');
    expect(container.textContent).toContain('섬세함을');
    expect(container.textContent).toContain('결합해');

    // useScroll과 useTransform이 정상적으로 호출되었는지 검증
    expect(useScroll).toHaveBeenCalled();
    expect(useTransform).toHaveBeenCalledTimes(9); // 각 단어마다 한 번씩 호출됨
  });
});
