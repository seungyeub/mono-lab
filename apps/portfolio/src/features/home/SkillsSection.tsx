'use client';

import SectionLabel from '@/src/components/SectionLabel';
import TagBar from '@/src/components/TagBar';
import { motion } from 'framer-motion';
import { useState } from 'react';

import SkillChips from './components/SkillChips';
import type { ColorMode } from './components/SkillIcon';
import SkillGrid from './components/SkillGrid';
import { SKILL_CATEGORIES, SKILL_TAGS } from './skillsData';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type LayoutMode = 'grid' | 'chips';

// ─────────────────────────────────────────────
// Sub-component: CompareToggle (임시 — Phase 4에서 제거)
// ─────────────────────────────────────────────

interface CompareToggleProps {
  layout: LayoutMode;
  colorMode: ColorMode;
  onLayoutChange: (v: LayoutMode) => void;
  onColorChange: (v: ColorMode) => void;
}

function CompareToggle({ layout, colorMode, onLayoutChange, onColorChange }: CompareToggleProps) {
  const btnBase = 'px-3 py-1 rounded text-xs font-mono transition-colors duration-150';
  const active = 'bg-white text-black';
  const inactive = 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/80';

  return (
    <div className='fixed bottom-6 left-1/2 z-50 -translate-x-1/2'>
      <div className='flex items-center gap-3 rounded-full border border-white/20 bg-neutral-900/90 px-4 py-2 backdrop-blur-md shadow-2xl'>
        {/* 레이아웃 토글 */}
        <div className='flex items-center gap-1'>
          <button
            className={`${btnBase} ${layout === 'grid' ? active : inactive}`}
            onClick={() => onLayoutChange('grid')}
          >
            Grid
          </button>
          <button
            className={`${btnBase} ${layout === 'chips' ? active : inactive}`}
            onClick={() => onLayoutChange('chips')}
          >
            Chips
          </button>
        </div>

        {/* 구분선 */}
        <div className='h-4 w-px bg-white/20' />

        {/* 색상 모드 토글 */}
        <div className='flex items-center gap-1'>
          <button
            className={`${btnBase} ${colorMode === 'mono' ? active : inactive}`}
            onClick={() => onColorChange('mono')}
          >
            Mono
          </button>
          <button
            className={`${btnBase} ${colorMode === 'brand' ? active : inactive}`}
            onClick={() => onColorChange('brand')}
          >
            Brand
          </button>
          <button
            className={`${btnBase} ${colorMode === 'interactive' ? active : inactive}`}
            onClick={() => onColorChange('interactive')}
          >
            Hover
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component: SkillsSection
// ─────────────────────────────────────────────

export default function SkillsSection() {
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [colorMode, setColorMode] = useState<ColorMode>('interactive');

  return (
    <section
      data-testid='skills-section'
      className='flex w-full flex-col items-start pt-[140px] md:pt-[120px] xl:pt-[180px] gap-10 sm:gap-[60px] md:gap-[80px]'
    >
      {/* ── SectionLabel ── */}
      <SectionLabel scene='03' leftLabel='© Technical Skills 기술 역량' rightLabel='Stack' />

      {/* ── 헤딩 + 설명 문단 ── */}
      <div className='site-container w-full px-6 md:px-12'>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className='text-[44px] sm:text-7xl md:text-8xl lg:text-9xl tracking-tight font-semibold'
        >
          Skills.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className='mt-6 max-w-2xl text-base md:text-lg text-gray-400 leading-relaxed'
        >
          프론트엔드를 중심으로 백엔드, 인프라, 디자인까지 서비스의 전체 생애주기를 다루는 기술
          역량입니다.
          <br className='hidden sm:block' />
          단순한 도구 나열이 아닌, 실무에서 검증된 기술 스택입니다.
        </motion.p>
      </div>

      {/* ── TagBar ── */}
      <TagBar tags={SKILL_TAGS} hideFromIndex={3} />

      {/* ── 카테고리별 스킬 목록 ── */}
      <div className='site-container w-full px-6 md:px-12'>
        <div className='flex flex-col gap-12 md:gap-16'>
          {SKILL_CATEGORIES.map((category, catIndex) => (
            <div key={category.title}>
              {/* 카테고리 헤딩 */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-40px' }}
                transition={{ duration: 0.5, delay: catIndex * 0.05 }}
                className='pb-4 md:pb-6 mb-5 md:mb-6 border-b border-white/20 text-lg md:text-xl font-bold uppercase'
              >
                <h3>{category.title}</h3>
              </motion.div>

              {/* 레이아웃 토글에 따라 Grid 또는 Chips 렌더링 */}
              {layout === 'grid' ? (
                <SkillGrid
                  skills={category.skills}
                  colorMode={colorMode}
                  indexOffset={catIndex * 3}
                />
              ) : (
                <SkillChips
                  skills={category.skills}
                  colorMode={colorMode}
                  categoryName={category.title}
                  indexOffset={catIndex * 3}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 비교 토글 UI (임시 — Phase 4에서 제거) ── */}
      <CompareToggle
        layout={layout}
        colorMode={colorMode}
        onLayoutChange={setLayout}
        onColorChange={setColorMode}
      />
    </section>
  );
}
