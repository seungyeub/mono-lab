'use client';

import { ComponentProps } from 'react';
import RollingText from './index';

interface RollingButtonProps extends ComponentProps<'button'> {
  text: string;
  textClassName?: string;
}

export default function RollingButton({
  text,
  textClassName,
  className = '',
  ...props
}: RollingButtonProps) {
  return (
    <button className={`group/roll ${className}`} {...props}>
      <RollingText text={text} className={textClassName} />
    </button>
  );
}
