'use client';

import SectionLabel from '@/src/components/SectionLabel';
import TagBar from '@/src/components/TagBar';
import { motion } from 'framer-motion';

import SkillChips from './components/SkillChips';
import { SKILL_CATEGORIES, SKILL_TAGS } from './skillsData';

// ─────────────────────────────────────────────
// Main Component: SkillsSection
// ─────────────────────────────────────────────

export default function SkillsSection() {
  return (
    <section
      data-testid='skills-section'
      className='flex w-full flex-col items-start gap-10 pt-[140px] sm:gap-[60px] md:gap-[80px] md:pt-[120px] xl:pt-[180px]'
    >
      {/* ── SectionLabel ── */}
      <SectionLabel scene='03' leftLabel='© Technical Skills 기술 역량' rightLabel='Stack' />

      {/* ── 헤딩 + 설명 문단 ── */}
      <div className='site-container w-full px-6 md:px-12'>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className='text-[44px] font-semibold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl'
        >
          Skills.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className='mt-6 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg'
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
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: catIndex * 0.05 }}
                className='mb-5 border-b border-white/20 pb-4 text-lg font-bold uppercase md:mb-6 md:pb-6 md:text-xl'
              >
                <h3>{category.title}</h3>
              </motion.div>

              <SkillChips
                skills={category.skills}
                categoryName={category.title}
                indexOffset={catIndex * 3}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
