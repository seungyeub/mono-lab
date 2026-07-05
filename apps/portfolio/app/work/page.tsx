import { getAllProjects } from '@/src/lib/mdx';
import WorkGrid from '@/src/features/work/WorkGrid';

export const metadata = {
  title: 'Work | Brand Designer Portfolio',
  description: 'Selected brand identity, logo design, and visual system projects.',
};

export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <main className='min-h-screen w-full'>
      {/* 페이지 헤더 */}
      <div className='border-b border-white/10 px-6 pt-32 pb-12 md:px-12'>
        <div className='flex flex-col justify-between gap-6 md:flex-row md:items-end'>
          <h1 className='text-4xl font-medium tracking-tight md:text-6xl'>Selected Works©</h1>
          <p className='max-w-sm text-sm text-gray-400 md:text-base'>
            Brand identities, visual systems,
            <br className='hidden md:block' /> and strategic design projects.
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
