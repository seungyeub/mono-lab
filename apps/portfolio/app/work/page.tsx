import { getProjectCards } from '@/src/lib/mdx';
import WorkGrid from '@/src/features/work/WorkGrid';

export const metadata = {
  title: 'Work | Seungyeub Baek',
  description: 'Next.js, React, TypeScript 기반으로 작업한 프론트엔드 프로젝트 모음입니다.',
};

export default function WorkPage() {
  // 카드 데이터는 항상 getProjectCards를 거친다(P0-6) — 이미지 실존 여부도 여기서 온다
  const projects = getProjectCards();

  return (
    <main className='min-h-screen w-full'>
      {/* 페이지 헤더 */}
      <div className='border-b border-white/10 px-6 pt-32 pb-12 md:px-12'>
        <div className='flex flex-col justify-between gap-6 md:flex-row md:items-end'>
          <h1 className='text-4xl font-medium tracking-tight md:text-6xl'>Archive©</h1>
          <p className='max-w-sm text-sm text-gray-400 md:text-base'>
            웹 서비스와 앱, 사내 시스템과 데이터 파이프라인까지
            <br className='hidden md:block' /> 2017년부터 만들어 온 작업들입니다.
          </p>
        </div>
      </div>

      {/* Split Layout */}
      <div className='px-6 pt-12 pb-24 md:px-12'>
        <WorkGrid projects={projects} />
      </div>
    </main>
  );
}
