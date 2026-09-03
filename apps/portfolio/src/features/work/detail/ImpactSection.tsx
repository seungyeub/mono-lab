import type { ProjectImpact } from '@/src/lib/mdx';
import SectionHeading from './SectionHeading';

/**
 * Impact & Results — 좌: Key Metrics(라벨 ··· 큰 값 행), 우: Achievements(번호 목록).
 * 한쪽만 있으면 해당 카드만 1열로 렌더링한다.
 */
export default function ImpactSection({ impact }: { impact: ProjectImpact }) {
  const hasMetrics = impact.metrics.length > 0;
  const hasOutcomes = impact.outcomes.length > 0;

  if (!hasMetrics && !hasOutcomes) return null;

  return (
    <section className='mt-20 md:mt-28'>
      <SectionHeading
        eyebrow='Impact Analysis'
        title='Project Impact & Results'
        description='Real-world outcomes and measurable results'
      />
      <div className={`grid gap-4 md:gap-6 ${hasMetrics && hasOutcomes ? 'lg:grid-cols-2' : ''}`}>
        {hasMetrics && (
          <div className='rounded-xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-white/30 md:p-8'>
            <h3 className='mb-5 text-lg font-semibold md:text-xl'>Key Metrics</h3>
            <dl className='flex flex-col gap-3'>
              {impact.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className='flex items-baseline justify-between gap-4 rounded-lg border border-white/10 bg-black/40 px-4 py-3.5 transition-colors duration-300 hover:border-white/25'
                >
                  <dt className='text-xs tracking-widest text-white/40 uppercase'>
                    {metric.label}
                  </dt>
                  <dd className='text-right text-lg font-semibold md:text-xl'>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {hasOutcomes && (
          <div className='rounded-xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-white/30 md:p-8'>
            <h3 className='mb-5 text-lg font-semibold md:text-xl'>Achievements</h3>
            <ul className='flex flex-col gap-2.5'>
              {impact.outcomes.map((outcome, index) => (
                <li
                  key={outcome}
                  className='flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition-colors duration-300 hover:border-white/25'
                >
                  <span
                    aria-hidden
                    className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-[10px] text-white/60'
                  >
                    {index + 1}
                  </span>
                  <p className='text-xs leading-relaxed text-gray-400 md:text-sm'>{outcome}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
