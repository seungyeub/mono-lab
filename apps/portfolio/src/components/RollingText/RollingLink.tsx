'use client';

import Link from 'next/link';
import { ComponentProps } from 'react';
import RollingText from './index';

interface RollingLinkProps extends ComponentProps<typeof Link> {
  text: string;
  textClassName?: string;
}

export default function RollingLink({ text, textClassName, className = '', ...props }: RollingLinkProps) {
  return (
    <Link className={`group/roll ${className}`} {...props}>
      <RollingText text={text} className={textClassName} />
    </Link>
  );
}
