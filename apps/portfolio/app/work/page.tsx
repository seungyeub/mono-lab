import { getAllProjects } from '@/src/lib/mdx';
import WorkGrid from '@/src/features/work/WorkGrid';

export const metadata = {
  title: 'Work | Brand Designer Portfolio',
  description: 'Selected brand identity, logo design, and visual system projects.',
};

export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <main className="min-h-screen w-full">
      {/* 페이지 헤더 */}
      <div className="px-6 md:px-12 pt-32 pb-12 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
            Selected Works©
          </h1>
          <p className="text-gray-400 max-w-sm text-sm md:text-base">
            Brand identities, visual systems,<br className="hidden md:block" /> and strategic design projects.
          </p>
        </div>
      </div>

      {/* Split Layout */}
      <div className="px-6 md:px-12 pt-12 pb-24">
        <WorkGrid projects={projects} />
      </div>
    </main>
  );
}
