'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import type { SkillItem } from '../skillsData';
import SkillIcon from './SkillIcon';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface SkillChipsProps {
  skills: SkillItem[];
  categoryName?: string;
  /** stagger 애니메이션 시작 인덱스 오프셋 */
  indexOffset?: number;
}

// ─────────────────────────────────────────────
// Sub-component: SkillChip
// ─────────────────────────────────────────────

interface SkillChipProps {
  skill: SkillItem;
  categoryName?: string;
  animationDelay: number;
}

function SkillChip({ skill, categoryName, animationDelay }: SkillChipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: animationDelay, ease: 'easeOut' }}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className={[
        'group relative inline-flex items-center gap-2',
        'rounded-full border border-white/10 bg-white/[0.02]',
        // 모바일: 작게 / sm+: 중간 / md+: 넉넉하게
        'px-2.5 py-1.5 sm:px-3.5 sm:py-2',
        'cursor-none transition-colors duration-200',
        'hover:border-white/25 hover:bg-white/[0.06]',
      ].join(' ')}
    >
      {/* ── 툴팁 (Hover Card) ── */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={[
              'absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2',
              'flex w-[200px] flex-col items-center justify-center gap-4',
              'rounded-xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl',
              'pointer-events-none p-6 shadow-2xl',
            ].join(' ')}
          >
            <SkillIcon skill={skill} colorMode='brand' size={48} />
            <div className='flex flex-col items-center gap-1.5 text-center'>
              <span className='text-[15px] font-bold tracking-wider text-white uppercase'>
                {skill.name}
              </span>
              {categoryName && (
                <span className='font-mono text-[10px] tracking-widest text-white/40 uppercase'>
                  {categoryName}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 아이콘: 모바일 14px, 데스크톱 16px를 CSS 클래스로 제어 (컴포넌트 단일화) */}
      <SkillIcon
        skill={skill}
        colorMode='brand'
        className='h-[14px] w-[14px] sm:h-[16px] sm:w-[16px]'
      />

      {/* 이름 */}
      <span
        className={[
          'leading-none whitespace-nowrap text-white/60',
          'text-[10px] sm:text-xs md:text-[13px]',
          'transition-colors duration-200',
          'group-hover:text-white', // 호버 시 텍스트 하얗게
        ].join(' ')}
      >
        {skill.name}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Component: SkillChips
// ─────────────────────────────────────────────

export default function SkillChips({ skills, categoryName, indexOffset = 0 }: SkillChipsProps) {
  return (
    <div className='flex flex-wrap gap-2 sm:gap-2.5'>
      {skills.map((skill, index) => (
        <SkillChip
          key={skill.name}
          skill={skill}
          categoryName={categoryName}
          animationDelay={(indexOffset + index) * 0.04}
        />
      ))}
    </div>
  );
}
