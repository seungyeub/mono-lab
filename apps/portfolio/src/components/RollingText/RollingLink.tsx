'use client';

import Link from 'next/link';
import { ComponentProps } from 'react';
import RollingText from './index';

interface RollingLinkProps extends ComponentProps<typeof Link> {
  text: string;
  textClassName?: string;
  /** 글자 사이 지연(ms). RollingText로 그대로 넘긴다 */
  stagger?: number;
}

export default function RollingLink({
  text,
  textClassName,
  stagger,
  className = '',
  ...props
}: RollingLinkProps) {
  return (
    <Link className={`group/roll ${className}`} {...props}>
      <RollingText text={text} className={textClassName} stagger={stagger} />
    </Link>
  );
}
