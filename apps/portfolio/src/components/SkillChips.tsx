'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { reveal } from '@/lib/motion';
import { useState } from 'react';

import type { SkillItem } from '@/data/skillsData';
import SkillIcon from './SkillIcon';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface SkillChipsProps {
  skills: SkillItem[];
  categoryName?: string;
  /**
   * 리빌 애니메이션 사용 여부. 홈처럼 훑어보는 화면에서는 켜고,
   * 상세처럼 읽는 화면에서는 꺼서 스크롤 중 요소가 떠오르지 않게 한다.
   */
  animate?: boolean;
}

// ─────────────────────────────────────────────
// Sub-component: SkillChip
// ─────────────────────────────────────────────

interface SkillChipProps {
  skill: SkillItem;
  categoryName?: string;
  animationDelay: number;
  animate: boolean;
}

function SkillChip({ skill, categoryName, animationDelay, animate }: Readonly<SkillChipProps>) {
  const [isHovered, setIsHovered] = useState(false);

  // 끄면 motion 속성을 아예 넘기지 않아 정적으로 렌더링된다
  const revealProps = animate ? reveal('smallItem', animationDelay) : {};

  return (
    <motion.div
      {...revealProps}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className={[
        'group relative inline-flex items-center gap-2',
        'border-line rounded-full border bg-white/[0.02]',
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
              'border-line rounded-xl border bg-neutral-900/60 backdrop-blur-xl',
              'pointer-events-none p-6 shadow-2xl',
            ].join(' ')}
          >
            <SkillIcon skill={skill} colorMode='brand' size={48} />
            <div className='flex flex-col items-center gap-1.5 text-center'>
              <span className='text-[15px] font-bold tracking-wider text-white uppercase'>
                {skill.name}
              </span>
              {categoryName && (
                <span className='text-label tracking-label font-mono text-white/50 uppercase'>
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
          'text-label sm:text-xs md:text-[13px]',
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

export default function SkillChips({
  skills,
  categoryName,
  animate = true,
}: Readonly<SkillChipsProps>) {
  return (
    <div className='flex flex-wrap gap-2 sm:gap-2.5'>
      {skills.map((skill, index) => (
        <SkillChip
          key={skill.name}
          skill={skill}
          categoryName={categoryName}
          // 같은 분류 안의 순번으로만 준다 — 분류 순번까지 더하면 뒤쪽 분류는 첫 칩부터 늦게 떴다.
          // 상한은 여러 줄로 감긴 칩이 화면 안에서 오래 기다리지 않게 하려는 것
          animationDelay={Math.min(index, 8) * 0.03}
          animate={animate}
        />
      ))}
    </div>
  );
}
