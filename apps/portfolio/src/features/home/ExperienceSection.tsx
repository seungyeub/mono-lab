'use client';

import SectionLabel from '@/src/components/SectionLabel';
import TagBar from '@/src/components/TagBar';
import WordRoller from '@/src/components/WordRoller';
import { motion } from 'framer-motion';

/** 롤링 헤드라인에 들어갈 단어 목록 */
const ROLLING_WORDS = ['Engineering.', 'Usability.', 'Accessibility.', 'Performance.'];

const TAGS = ['Product Development', 'Internal Systems', 'Enterprise Projects', 'Independent Work'];

const EXPERIENCES = [
  {
    company: '(주) 나비이',
    period: '2020.08 - 2025.08',
    role: 'FrontEnd Engineer',
    stack: 'Co-Founder',
  },
  {
    company: '(주) 딘코퍼레이션',
    period: '2018.12 - 2020.06',
    role: 'FrontEnd Engineer',
    stack: 'Junier',
  },
  {
    company: '(주) 티몬',
    period: '2018.07 - 2018.08',
    role: 'FrontEnd Engineer',
    stack: 'Internship',
  },
  {
    company: '(주) 코아리버',
    period: '2017.05 - 2018.06',
    role: 'Full Stack Engineer',
    stack: 'Junier',
  },
];

const ACHIEVEMENTS = [
  {
    certificate: '정보처리기사',
    date: '2015.10',
    organization: '한국산업인력공단',
    result: '취득',
  },
  {
    certificate: 'OCJP',
    date: '2016.03',
    organization: 'Oracle',
    result: '취득',
  },
];

export default function ExperienceSection() {
  return (
    <section className='flex w-full flex-col items-start pt-[80px] md:pt-[120px] xl:pt-[180px] gap-[60px] md:gap-[80px]'>
      <SectionLabel scene='03' leftLabel='© Experience 경력 / 자격증' rightLabel='Engineering' />

      {/* ── 롤링 헤드라인 ── */}
      <div className='site-container px-6 md:px-12 w-full'>
        <h2
          className='text-7xl md:text-8xl lg:text-9xl tracking-tight font-semibold'
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
          <div className='pb-4 md:pb-6 border-b border-white/20 text-lg md:text-xl font-bold uppercase'>
            <h3>경력</h3>
          </div>
          {EXPERIENCES.map((exp, index) => (
            <motion.div
              key={exp.company + index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className='grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-white/20 py-6 md:py-8'
            >
              {/* col 1 — 회사명 (lg+) / 회사명+기간 (< lg) */}
              <div className='flex flex-col gap-1'>
                <h4 className='text-base md:text-lg font-medium'>{exp.company}</h4>
                <span className='text-xs text-gray-500 font-mono lg:hidden'>{exp.period}</span>
              </div>
              {/* col 2 (소형) — 역할+지역, 오른쪽 정렬. lg 이상에서는 숨김 */}
              <div className='flex flex-col gap-1 text-right lg:hidden'>
                <span className='text-base md:text-lg font-medium text-gray-300'>{exp.role}</span>
                <span className='text-xs text-gray-500 uppercase tracking-widest'>
                  {exp.stack}
                </span>
              </div>
              {/* col 2 (lg+) — 기간 단독 */}
              <div className='hidden lg:flex items-center'>
                <span className='text-xs text-gray-500 font-mono'>{exp.period}</span>
              </div>
              {/* col 3 (lg+) — 역할 */}
              <div className='hidden lg:flex items-center'>
                <span className='text-gray-300 text-sm md:text-base'>{exp.role}</span>
              </div>
              {/* col 4 (lg+) — 지역, 오른쪽 정렬 */}
              <div className='hidden lg:flex items-center justify-end'>
                <span className='text-xs text-gray-500 uppercase tracking-widest'>
                  {exp.stack}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 자격증 리스트 ── */}
      <div className='site-container w-full px-6 md:px-12'>
        <div className='flex flex-col'>
          <div className='pb-4 md:pb-6 border-b border-white/20 text-lg md:text-xl font-bold uppercase'>
            <h3>자격증</h3>
          </div>
          {ACHIEVEMENTS.map((achievement, index) => (
            <motion.div
              key={achievement.certificate + index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className='grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-white/20 py-6 md:py-8'
            >
              {/* col 1 — 자격증명 (lg+) / 자격증명+연도 (< lg) */}
              <div className='flex flex-col gap-1'>
                <h4 className='text-base md:text-lg font-medium'>{achievement.certificate}</h4>
                <span className='text-xs text-gray-500 font-mono lg:hidden'>
                  {achievement.organization}
                </span>
              </div>
              {/* col 2 (소형) — 발급기관+결과, 오른쪽 정렬. lg 이상에서는 숨김 */}
              <div className='flex flex-col gap-1 text-right lg:hidden'>
                <span className='text-base md:text-lg font-medium text-gray-300'>
                  {achievement.date}
                </span>
                <span className='text-xs text-gray-500 uppercase tracking-widest'>
                  {achievement.result}
                </span>
              </div>
              {/* col 2 (lg+) — 취득연도 단독 */}
              <div className='hidden lg:flex items-center'>
                <span className='text-xs text-gray-500 font-mono'>{achievement.date}</span>
              </div>
              {/* col 3 (lg+) — 발급기관 */}
              <div className='hidden lg:flex items-center'>
                <span className='text-gray-300 text-sm md:text-base'>{achievement.organization}</span>
              </div>
              {/* col 4 (lg+) — 결과, 오른쪽 정렬 */}
              <div className='hidden lg:flex items-center justify-end'>
                <span className='text-xs text-gray-500 uppercase tracking-widest'>
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
