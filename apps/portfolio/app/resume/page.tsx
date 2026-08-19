import { ACHIEVEMENTS, EXPERIENCES } from '@/src/data/experienceData';
import { SKILL_CATEGORIES } from '@/src/features/home/skillsData';
import { publicAssetExists } from '@/src/lib/mdx';

export const metadata = {
  title: 'Resume | Seungyeub Baek',
  description: '프론트엔드 엔지니어 백승엽의 경력, 자격증, 기술 스택을 정리한 이력서 페이지입니다.',
};

// PDF 파일을 public 루트에 이 이름으로 추가하면 다운로드 버튼이 자동으로 노출된다
const RESUME_PDF_PATH = '/resume.pdf';

export default function ResumePage() {
  const hasPdf = publicAssetExists(RESUME_PDF_PATH);

  return (
    <main className='min-h-screen w-full px-6 pt-32 pb-24 md:px-12'>
      {/* ── 페이지 헤더 ── */}
      <div className='flex flex-col justify-between gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl font-medium tracking-tight md:text-6xl'>Resume©</h1>
          <p className='mt-2 max-w-xl text-base text-gray-400 md:text-lg'>
            Next.js, React, TypeScript 기반으로 인터페이스와 시스템을 구축하는 프론트엔드 엔지니어
            백승엽입니다.
          </p>
        </div>
        {hasPdf && (
          <a
            href={RESUME_PDF_PATH}
            download
            className='self-start rounded-full border border-white/30 px-6 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black'
          >
            Download PDF ↓
          </a>
        )}
      </div>

      {/* ── Experience ── */}
      <section className='mt-16 flex flex-col gap-6'>
        <h2 className='text-xs font-medium tracking-widest text-white/40 uppercase'>Experience</h2>
        <div className='flex flex-col border-t border-white/10'>
          {EXPERIENCES.map((exp) => (
            <div
              key={`${exp.company}-${exp.period}`}
              className='md:grid-cols-experience grid grid-cols-1 gap-1 border-b border-white/10 py-5 md:items-center md:gap-4'
            >
              <span className='text-base font-medium md:text-lg'>{exp.company}</span>
              <span className='text-sm text-gray-400 md:text-base'>{exp.role}</span>
              <span className='text-sm text-gray-400 md:text-base'>{exp.period}</span>
              <span className='text-sm text-white/40 md:text-right'>{exp.type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Certifications ── */}
      <section className='mt-16 flex flex-col gap-6'>
        <h2 className='text-xs font-medium tracking-widest text-white/40 uppercase'>
          Certifications
        </h2>
        <div className='flex flex-col border-t border-white/10'>
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.certificate}
              className='md:grid-cols-experience grid grid-cols-1 gap-1 border-b border-white/10 py-5 md:items-center md:gap-4'
            >
              <span className='text-base font-medium md:text-lg'>{achievement.certificate}</span>
              <span className='text-sm text-gray-400 md:text-base'>{achievement.organization}</span>
              <span className='text-sm text-gray-400 md:text-base'>{achievement.date}</span>
              <span className='text-sm text-white/40 md:text-right'>{achievement.result}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills ── */}
      <section className='mt-16 flex flex-col gap-6'>
        <h2 className='text-xs font-medium tracking-widest text-white/40 uppercase'>Skills</h2>
        <div className='flex flex-col border-t border-white/10'>
          {SKILL_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className='grid grid-cols-1 gap-1 border-b border-white/10 py-5 md:grid-cols-[1fr_3fr] md:gap-4'
            >
              <span className='text-base font-medium md:text-lg'>{category.title}</span>
              <p className='text-sm leading-relaxed text-gray-400 md:text-base'>
                {category.skills.map((skill) => skill.name).join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
