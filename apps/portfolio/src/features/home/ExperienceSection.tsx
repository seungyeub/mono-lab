'use client';

import SectionLabel from '@/components/SectionLabel';
import { reveal } from '@/lib/motion';
import TagBar from '@/components/TagBar';
import WordRoller from '@/components/WordRoller';
import { ACHIEVEMENTS, EXPERIENCES } from '@/data/experienceData';
import { motion } from 'framer-motion';

/** 롤링 헤드라인에 들어갈 단어 목록 */
const ROLLING_WORDS = ['Engineering.', 'Usability.', 'Accessibility.', 'Performance.'];

const TAGS = ['Product Development', 'Internal Systems', 'Enterprise Projects', 'Independent Work'];

export default function ExperienceSection() {
  return (
    <section
      data-testid='experience-section'
      className='pt-section xl:pt-section-lg flex w-full flex-col items-start gap-10 sm:gap-[60px] md:gap-[80px]'
    >
      <SectionLabel scene='04' leftLabel='© Experience 경력 / 자격증' rightLabel='Practice' />

      {/* ── 롤링 헤드라인 ── */}
      <div className='site-container w-full px-6 md:px-12'>
        <h2
          className='text-[44px] font-semibold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl'
          aria-label={`Years of ${ROLLING_WORDS.join(' / ')}`}
        >
          <WordRoller words={ROLLING_WORDS} interval={2000} staggerMs={48} duration={0.4} />
        </h2>
      </div>

      {/* ── 태그 바 ── */}
      <TagBar tags={TAGS} />

      {/* ── 경력 리스트 ── */}
      <div className='site-container w-full px-6 md:px-12'>
        <div className='flex flex-col'>
          <div className='border-line-strong border-b pb-4 text-lg font-bold uppercase md:pb-6 md:text-xl'>
            <h3>경력</h3>
          </div>
          {EXPERIENCES.map((exp, index) => (
            <motion.div
              key={exp.company + index}
              {...reveal('listItem')}
              className='lg:grid-cols-experience border-line-strong grid grid-cols-2 gap-4 border-b py-6 md:py-8'
            >
              {/* col 1 — 회사명 (lg+) / 회사명+기간 (< lg) */}
              <div className='flex flex-col gap-1'>
                <h4 className='text-base font-medium md:text-lg'>{exp.company}</h4>
                <span className='font-mono text-xs text-gray-400 lg:hidden'>{exp.period}</span>
              </div>
              {/* col 2 (소형) — 역할+지역, 오른쪽 정렬. lg 이상에서는 숨김 */}
              <div className='flex flex-col gap-1 text-right lg:hidden'>
                <span className='text-base font-medium text-gray-300 md:text-lg'>{exp.role}</span>
                <span className='text-xs tracking-widest text-white/50 uppercase'>{exp.type}</span>
              </div>
              {/* col 2 (lg+) — 기간 단독 */}
              <div className='hidden items-center lg:flex'>
                <span className='font-mono text-xs text-gray-400'>{exp.period}</span>
              </div>
              {/* col 3 (lg+) — 역할 */}
              <div className='hidden items-center lg:flex'>
                <span className='text-sm text-gray-300 md:text-base'>{exp.role}</span>
              </div>
              {/* col 4 (lg+) — 지역, 오른쪽 정렬 */}
              <div className='hidden items-center justify-end lg:flex'>
                <span className='text-xs tracking-widest text-white/50 uppercase'>{exp.type}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 자격증 리스트 ── */}
      <div className='site-container w-full px-6 md:px-12'>
        <div className='flex flex-col'>
          <div className='border-line-strong border-b pb-4 text-lg font-bold uppercase md:pb-6 md:text-xl'>
            <h3>자격증</h3>
          </div>
          {ACHIEVEMENTS.map((achievement, index) => (
            <motion.div
              key={achievement.certificate + index}
              {...reveal('listItem')}
              className='lg:grid-cols-experience border-line-strong grid grid-cols-2 gap-4 border-b py-6 md:py-8'
            >
              {/* col 1 — 자격증명 (lg+) / 자격증명+연도 (< lg) */}
              <div className='flex flex-col gap-1'>
                <h4 className='text-base font-medium md:text-lg'>{achievement.certificate}</h4>
                <span className='font-mono text-xs text-gray-400 lg:hidden'>
                  {achievement.organization}
                </span>
              </div>
              {/* col 2 (소형) — 발급기관+결과, 오른쪽 정렬. lg 이상에서는 숨김 */}
              <div className='flex flex-col gap-1 text-right lg:hidden'>
                <span className='text-base font-medium text-gray-300 md:text-lg'>
                  {achievement.date}
                </span>
                <span className='text-xs tracking-widest text-white/50 uppercase'>
                  {achievement.result}
                </span>
              </div>
              {/* col 2 (lg+) — 발급기관. 작은 화면에서 자격증명과 한 묶음이므로 여기서도 바로 뒤에 온다 */}
              <div className='hidden items-center lg:flex'>
                <span className='text-sm text-gray-300 md:text-base'>
                  {achievement.organization}
                </span>
              </div>
              {/* col 3 (lg+) — 취득연도 */}
              <div className='hidden items-center lg:flex'>
                <span className='font-mono text-xs text-gray-400'>{achievement.date}</span>
              </div>
              {/* col 4 (lg+) — 결과, 오른쪽 정렬 */}
              <div className='hidden items-center justify-end lg:flex'>
                <span className='text-xs tracking-widest text-white/50 uppercase'>
                  {achievement.result}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
