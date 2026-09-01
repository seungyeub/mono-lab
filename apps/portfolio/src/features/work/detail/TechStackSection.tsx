import SectionHeading from './SectionHeading';

/** Technology Stack — 기술명 타일 그리드. 아이콘 매핑은 보류하고 모노 타이포로 표현한다. */
export default function TechStackSection({ techStack }: { techStack: string[] }) {
  if (techStack.length === 0) return null;

  return (
    <section className='mt-20 md:mt-28'>
      <SectionHeading title='Technology Stack' description='이 프로젝트를 구성한 기술들' />
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4'>
        {techStack.map((tech) => (
          <div
            key={tech}
            className='rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-center transition-colors duration-300 hover:border-white/30'
          >
            <span className='font-mono text-xs text-white/80 md:text-sm'>{tech}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
