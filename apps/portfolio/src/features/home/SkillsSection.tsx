'use client';

import SectionLabel from '@/components/SectionLabel';
import { reveal } from '@/lib/motion';
import TagBar from '@/components/TagBar';
import { motion } from 'framer-motion';

import SkillChips from '@/components/SkillChips';
import { SKILL_CATEGORIES, SKILL_TAGS } from '@/data/skillsData';

// ─────────────────────────────────────────────
// Main Component: SkillsSection
// ─────────────────────────────────────────────

export default function SkillsSection() {
  return (
    <section
      data-testid='skills-section'
      className='pt-section xl:pt-section-lg flex w-full flex-col items-start gap-10 sm:gap-[60px] md:gap-[80px]'
    >
      {/* ── SectionLabel ── */}
      <SectionLabel scene='03' leftLabel='© Technical Skills 기술 역량' rightLabel='Stack' />

      {/* ── 헤딩 + 설명 문단 ── */}
      <div className='site-container w-full px-6 md:px-12'>
        <motion.h2
          {...reveal('sectionTitle')}
          className='text-[44px] font-semibold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl'
        >
          Skills.
        </motion.h2>

        <motion.p
          {...reveal('sectionLead', 0.15)}
          className='mt-6 max-w-3xl text-base leading-relaxed text-pretty break-keep text-gray-400 md:text-lg'
        >
          서비스를 만들고 운영하는 전 과정의 기술입니다.{' '}
          {/* sm 미만에서는 줄을 바꾸지 않고 이어 쓴다 - 공백이 없으면 두 문장이 붙는다 */}
          <br className='hidden sm:block' />
          화면부터 서버와 데이터베이스, 배포와 인프라, 개발 도구와 AI까지 실제 프로젝트에서 써 온
          것만 모았습니다.
        </motion.p>
      </div>

      {/* ── TagBar ── */}
      {/* Skills만 md(768px) 미만에서 숨긴다. 태그가 5개라 좁은 화면에서 빽빽해지는데,
          Experience·Epilogue는 태그 수가 적어 그대로 둔다(2026-09-04 확정, P3-9).
          바 전체가 숨겨지므로 hideFromIndex는 더 이상 관여하지 않아 제거했다. */}
      <TagBar tags={SKILL_TAGS} className='hidden md:block' />

      {/* ── 카테고리별 스킬 목록 ── */}
      <div className='site-container w-full px-6 md:px-12'>
        <div className='flex flex-col gap-12 md:gap-16'>
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.title}>
              {/* 카테고리 헤딩 */}
              <motion.div
                {...reveal('smallItem')}
                className='border-line-strong mb-5 border-b pb-4 text-lg font-bold uppercase md:mb-6 md:pb-6 md:text-xl'
              >
                <h3>{category.title}</h3>
              </motion.div>

              <SkillChips skills={category.skills} categoryName={category.title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
