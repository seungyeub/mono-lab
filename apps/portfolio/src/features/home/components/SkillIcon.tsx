'use client';

import { useState } from 'react';

import type { SkillItem } from '../skillsData';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ColorMode = 'mono' | 'brand' | 'interactive';

interface SkillIconProps {
  skill: SkillItem;
  colorMode: ColorMode;
  size?: number | string;
  className?: string;
}

// ─────────────────────────────────────────────
// Color helpers
// ─────────────────────────────────────────────

/** 색상 모드에 따른 아이콘 컬러를 결정합니다. */
function getIconColor(colorMode: ColorMode, brandColor: string, isHovered: boolean): string {
  switch (colorMode) {
    case 'mono':
      return '#ffffff';
    case 'brand':
      return brandColor;
    case 'interactive':
      return isHovered ? brandColor : '#666666';
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

/**
 * SkillIcon — 아이콘 래퍼 컴포넌트
 *
 * @icons-pack/react-simple-icons 컴포넌트와 커스텀 SVG를
 * 동일한 인터페이스로 렌더링합니다.
 *
 * 3가지 색상 모드 지원:
 * - mono: 모든 아이콘 #ffffff (모노크롬)
 * - brand: 각 아이콘 고유 브랜드 컬러
 * - interactive: 기본 #666666, hover 시 브랜드 컬러
 */
export default function SkillIcon({ skill, colorMode, size, className = '' }: SkillIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  const color = getIconColor(colorMode, skill.brandColor, isHovered);

  // size가 주어지면 인라인 스타일 적용, 없으면 className 기반 반응형 크기 사용
  const wrapperStyle = size ? { width: size, height: size } : undefined;

  const wrapperProps = {
    className: `inline-flex items-center justify-center transition-colors duration-300 ${className}`,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: wrapperStyle,
  };

  // SVG 내부 크기는 부모 컨테이너에 맞춤 (size가 없으면 100%)
  const innerSize = size ?? '100%';

  // ── npm 패키지 아이콘 (43/50) ──
  if (skill.icon) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = skill.icon as any; // Type override for innerSize="100%"
    return (
      <span {...wrapperProps}>
        <IconComponent color={color} size={innerSize} />
      </span>
    );
  }

  // ── 커스텀 SVG 아이콘 (7/50) ──
  if (skill.customIconPath) {
    return (
      <span {...wrapperProps}>
        <span
          className='block h-full w-full bg-contain bg-center bg-no-repeat'
          style={{ backgroundImage: `url(${skill.customIconPath})` }}
          aria-hidden='true'
        />
      </span>
    );
  }

  // ── fallback: 첫 글자 표시 ──
  return (
    <span {...wrapperProps}>
      <span
        className='flex h-full w-full items-center justify-center rounded-sm bg-white/10 font-mono text-xs font-bold'
        style={{ color }}
      >
        {skill.name.charAt(0).toUpperCase()}
      </span>
    </span>
  );
}
