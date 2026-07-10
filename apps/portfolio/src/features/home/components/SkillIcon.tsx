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
  size?: number;
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
export default function SkillIcon({ skill, colorMode, size = 24, className = '' }: SkillIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  const color = getIconColor(colorMode, skill.brandColor, isHovered);

  const wrapperProps = {
    className: `inline-flex items-center justify-center transition-colors duration-300 ${className}`,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: { width: size, height: size },
  };

  // ── npm 패키지 아이콘 (43/50) ──
  if (skill.icon) {
    const IconComponent = skill.icon;
    return (
      <span {...wrapperProps}>
        <IconComponent color={color} size={size} />
      </span>
    );
  }

  // ── 커스텀 SVG 아이콘 (7/50) ──
  // 원본 SVG의 색상을 그대로 렌더링하기 위해 background-image를 사용합니다.
  // (mask-image를 사용하면 단색 실루엣으로 처리됨)
  if (skill.customIconPath) {
    return (
      <span {...wrapperProps}>
        <span
          style={{
            display: 'inline-block',
            width: size,
            height: size,
            backgroundImage: `url(${skill.customIconPath})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
          aria-hidden='true'
        />
      </span>
    );
  }

  // ── fallback: 첫 글자 표시 ──
  return (
    <span {...wrapperProps}>
      <span
        className='flex items-center justify-center rounded-sm bg-white/10 font-mono text-xs font-bold'
        style={{ width: size, height: size, color }}
      >
        {skill.name.charAt(0).toUpperCase()}
      </span>
    </span>
  );
}
