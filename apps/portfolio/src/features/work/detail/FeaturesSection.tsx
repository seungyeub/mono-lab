import type { ProjectTextItem } from '@/src/lib/mdx';
import SectionHeading from './SectionHeading';

/** Key Features — 번호 타일 + 제목 + 설명 카드 2열. 아이콘 대신 번호로 위계를 표현한다. */
export default function FeaturesSection({ features }: { features: ProjectTextItem[] }) {
  if (features.length === 0) return null;

  return (
    <section className='mt-20 md:mt-28'>
      <SectionHeading title='Key Features' description='What makes this project special' />
      <div className='grid gap-4 sm:grid-cols-2 md:gap-6'>
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className='rounded-xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-white/30 md:p-8'
          >
            <span
              aria-hidden
              className='mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 font-mono text-xs text-white/60'
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className='mb-2 text-lg font-semibold md:text-xl'>{feature.title}</h3>
            <p className='text-sm leading-relaxed text-gray-400 md:text-base'>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
