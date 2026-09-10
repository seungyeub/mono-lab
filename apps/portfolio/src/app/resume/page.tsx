import type { Metadata } from 'next';

import RollingLink from '@/components/RollingText/RollingLink';
import { SITE_NAME, buildPageOpenGraph } from '@/lib/siteConfig';
import { ACHIEVEMENTS, EXPERIENCES } from '@/data/experienceData';
import { SKILL_CATEGORIES } from '@/data/skillsData';
import { publicAssetExists } from '@/lib/mdx';

const DESCRIPTION =
  '프론트엔드 엔지니어 백승엽의 경력, 자격증, 기술 스택을 정리한 이력서 페이지입니다.';

// 제목에 사이트명을 넣지 않는다 — 루트 layout의 title.template가 한 번만 덧붙인다
export const metadata: Metadata = {
  title: 'Resume',
  description: DESCRIPTION,
  // canonical이 없으면 쿼리스트링이 붙은 주소가 별도 페이지로 색인될 수 있다
  alternates: { canonical: '/resume' },
  ...buildPageOpenGraph({
    title: `Resume | ${SITE_NAME}`,
    description: DESCRIPTION,
    path: '/resume',
  }),
};

// PDF 파일을 public 루트에 이 이름으로 추가하면 다운로드 버튼이 자동으로 노출된다
const RESUME_PDF_PATH = '/resume.pdf';

// 내려받은 파일이 다운로드 폴더에서 `resume.pdf`로 남으면 누구 이력서인지 알 수 없다
const RESUME_DOWNLOAD_NAME = 'Seungyeub-Baek-Resume.pdf';

export default function ResumePage() {
  const hasPdf = publicAssetExists(RESUME_PDF_PATH);

  return (
    <div className='site-container min-h-screen w-full px-6 pt-32 pb-24 md:px-12'>
      {/* ── 페이지 헤더 ── */}
      <div className='border-line flex flex-col justify-between gap-8 border-b pb-12 md:flex-row md:items-end'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl font-medium tracking-tight md:text-6xl'>Resume©</h1>
          <p className='mt-2 max-w-xl text-base text-gray-400 md:text-lg'>
            Next.js, React, TypeScript 기반으로 인터페이스와 시스템을 구축하는 프론트엔드 엔지니어
            백승엽입니다.
          </p>
        </div>
        {hasPdf && (
          // 파일 링크라 라우트 프리페치는 낭비다. next/link는 download 속성이 있으면
          // 클릭을 가로채지 않고 브라우저에 맡긴다(next/dist/client/app-dir/link.js)
          <RollingLink
            href={RESUME_PDF_PATH}
            download={RESUME_DOWNLOAD_NAME}
            prefetch={false}
            text='Download PDF'
            textClassName='font-bold tracking-tight'
            className='inline-block self-start rounded-full border-2 border-white px-5 py-2 text-[16px] tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black md:text-[23px]'
          />
        )}
      </div>

      {/* ── Experience ── */}
      <section className='mt-16 flex flex-col gap-6'>
        <h2 className='font-semibold text-white'>Experience</h2>
        <div className='border-line flex flex-col border-t'>
          {EXPERIENCES.map((exp) => (
            <div
              key={`${exp.company}-${exp.period}`}
              className='lg:grid-cols-experience border-line grid grid-cols-2 gap-4 border-b py-5 lg:items-center'
            >
              {/* col 1 — 회사명 (lg+) / 회사명+기간 (< lg) */}
              <div className='flex flex-col gap-1'>
                <span className='text-base font-medium md:text-lg'>{exp.company}</span>
                <span className='text-sm text-gray-400 lg:hidden'>{exp.period}</span>
              </div>
              {/* col 2 (소형) — 역할+고용형태, 오른쪽 정렬. lg 이상에서는 숨긴다 */}
              <div className='flex flex-col gap-1 text-right lg:hidden'>
                <span className='text-sm text-gray-400 md:text-base'>{exp.role}</span>
                <span className='text-sm text-white/50'>{exp.type}</span>
              </div>
              {/* 작은 화면에서 회사명과 한 묶음인 기간이 lg+에서도 바로 뒤에 온다 */}
              <span className='hidden text-sm text-gray-400 md:text-base lg:block'>
                {exp.period}
              </span>
              <span className='hidden text-sm text-gray-400 md:text-base lg:block'>{exp.role}</span>
              <span className='hidden text-sm text-white/50 lg:block lg:text-right'>
                {exp.type}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Certifications ── */}
      <section className='mt-16 flex flex-col gap-6'>
        <h2 className='font-semibold text-white'>Certifications</h2>
        <div className='border-line flex flex-col border-t'>
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.certificate}
              className='lg:grid-cols-experience border-line grid grid-cols-2 gap-4 border-b py-5 lg:items-center'
            >
              {/* col 1 — 자격증명 (lg+) / 자격증명+발급기관 (< lg) */}
              <div className='flex flex-col gap-1'>
                <span className='text-base font-medium md:text-lg'>{achievement.certificate}</span>
                <span className='text-sm text-gray-400 lg:hidden'>{achievement.organization}</span>
              </div>
              {/* col 2 (소형) — 취득일+결과, 오른쪽 정렬. lg 이상에서는 숨긴다 */}
              <div className='flex flex-col gap-1 text-right lg:hidden'>
                <span className='text-sm text-gray-400 md:text-base'>{achievement.date}</span>
                <span className='text-sm text-white/50'>{achievement.result}</span>
              </div>
              <span className='hidden text-sm text-gray-400 md:text-base lg:block'>
                {achievement.organization}
              </span>
              <span className='hidden text-sm text-gray-400 md:text-base lg:block'>
                {achievement.date}
              </span>
              <span className='hidden text-sm text-white/50 lg:block lg:text-right'>
                {achievement.result}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills ── */}
      <section className='mt-16 flex flex-col gap-6'>
        <h2 className='font-semibold text-white'>Skills</h2>
        <div className='border-line flex flex-col border-t'>
          {SKILL_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className='border-line grid grid-cols-1 gap-1 border-b py-5 md:grid-cols-[1fr_3fr] md:gap-4'
            >
              <span className='text-base font-medium md:text-lg'>{category.title}</span>
              <p className='text-sm leading-relaxed text-gray-400 md:text-base'>
                {category.skills.map((skill) => skill.name).join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
