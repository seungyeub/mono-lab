'use client';

import { useCursorStore } from '@/src/store/useCursorStore';
import { motion } from 'framer-motion';

import type { SkillItem } from '../skillsData';
import type { ColorMode } from './SkillIcon';
import SkillIcon from './SkillIcon';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface SkillGridProps {
  skills: SkillItem[];
  colorMode: ColorMode;
  /** stagger 애니메이션 시작 인덱스 오프셋 (카테고리가 여러 개일 때 연속성 부여) */
  indexOffset?: number;
}

// ─────────────────────────────────────────────
// Sub-component: SkillCard
// ─────────────────────────────────────────────

interface SkillCardProps {
  skill: SkillItem;
  colorMode: ColorMode;
  animationDelay: number;
}

function SkillCard({ skill, colorMode, animationDelay }: SkillCardProps) {
  const setCursorType = useCursorStore((s) => s.setType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-40px' }}
      transition={{ duration: 0.6, delay: animationDelay, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}
      onMouseEnter={() => setCursorType('pointer')}
      onMouseLeave={() => setCursorType('default')}
      className={[
        'group flex flex-col items-center justify-center gap-2',
        'rounded-lg border border-white/10 bg-white/[0.02]',
        'px-2 py-4 sm:py-5',
        'cursor-default transition-colors duration-200',
        'hover:border-white/25 hover:bg-white/[0.06]',
      ].join(' ')}
    >
      {/* 아이콘 — 카드 크기는 반응형이지만 아이콘은 28px 고정으로 일관성 유지 */}
      <SkillIcon skill={skill} colorMode={colorMode} size={28} />

      {/* 이름 */}
      <span
        className={[
          'w-full text-center leading-tight text-white/60',
          'text-[10px] sm:text-[11px] md:text-xs',
          'transition-colors duration-200',
          'group-hover:text-white/85',
          // 긴 이름은 줄바꿈 허용, 너무 길면 잘림 방지
          'line-clamp-2 break-words',
        ].join(' ')}
      >
        {skill.name}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Component: SkillGrid
// ─────────────────────────────────────────────

/**
 * SkillGrid — Layout A (카드 그리드)
 *
 * 기술 목록을 카드 그리드로 표시합니다.
 * 반응형: 모바일 3열 → 태블릿 4~5열 → 데스크탑 6~7열
 */
export default function SkillGrid({ skills, colorMode, indexOffset = 0 }: SkillGridProps) {
  return (
    <div
      className={[
        'grid gap-2.5 sm:gap-3',
        'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7',
      ].join(' ')}
    >
      {skills.map((skill, index) => (
        <SkillCard
          key={skill.name}
          skill={skill}
          colorMode={colorMode}
          animationDelay={(indexOffset + index) * 0.04}
        />
      ))}
    </div>
  );
}
