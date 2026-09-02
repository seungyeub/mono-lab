import type { ProjectImplementation } from '@/src/lib/mdx';
import SectionHeading from './SectionHeading';

/**
 * Technical Implementation — 좌: Architecture(시스템 설계 한 줄 + Key Highlights 번호 목록),
 * 우: Code Snippet(터미널 크롬). 코드가 없으면 Architecture 카드만 1열로 렌더링한다.
 */
export default function ImplementationSection({
  implementation,
}: {
  implementation: ProjectImplementation;
}) {
  const hasArchitecture =
    Boolean(implementation.architecture) || implementation.highlights.length > 0;
  const hasCode = implementation.codeSnippet.length > 0;

  if (!hasArchitecture && !hasCode) return null;

  return (
    <section className='mt-20 md:mt-28'>
      <SectionHeading
        title='Technical Implementation'
        description='Architecture decisions and code highlights'
      />
      <div className={`grid gap-4 md:gap-6 ${hasArchitecture && hasCode ? 'lg:grid-cols-2' : ''}`}>
        {hasArchitecture && (
          <div className='rounded-xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-white/30 md:p-8'>
            <h3 className='mb-5 text-lg font-semibold md:text-xl'>Architecture</h3>

            {implementation.architecture && (
              <div className='mb-6 rounded-lg border border-white/10 bg-black/40 p-4'>
                <p className='mb-1.5 text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase'>
                  System Design
                </p>
                <p className='text-sm leading-relaxed font-medium md:text-base'>
                  {implementation.architecture}
                </p>
              </div>
            )}

            {implementation.highlights.length > 0 && (
              <div>
                <p className='mb-3 text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase'>
                  Key Highlights
                </p>
                <ul className='flex flex-col gap-2.5'>
                  {implementation.highlights.map((highlight, index) => (
                    <li
                      key={highlight}
                      className='flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition-colors duration-300 hover:border-white/25'
                    >
                      <span
                        aria-hidden
                        className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-[10px] text-white/60'
                      >
                        {index + 1}
                      </span>
                      <p className='text-xs leading-relaxed text-gray-400 md:text-sm'>
                        {highlight}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {hasCode && (
          <div className='rounded-xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-white/30 md:p-8'>
            <h3 className='mb-5 text-lg font-semibold md:text-xl'>Code Snippet</h3>

            {implementation.codeCaption && (
              <div className='mb-6 rounded-lg border border-white/10 bg-black/40 p-4'>
                <p className='mb-1.5 text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase'>
                  Implementation
                </p>
                <p className='text-sm leading-relaxed font-medium md:text-base'>
                  {implementation.codeCaption}
                </p>
              </div>
            )}

            {/* 코드의 출처·기여 경계를 코드 바로 위에서 밝힌다 (예: AI 페어 개발) */}
            {implementation.codeNote && (
              <p className='mb-3 border-l-2 border-white/25 pl-3 text-xs leading-relaxed text-white/50'>
                {implementation.codeNote}
              </p>
            )}

            {/* 터미널 크롬 — 신호등은 톤에 맞춰 회색조로 */}
            <div className='flex flex-col gap-3'>
              {implementation.codeSnippet.map((snippet) => (
                <div
                  key={snippet}
                  className='overflow-hidden rounded-lg border border-white/10 bg-black'
                >
                  <div className='flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-4 py-2.5'>
                    <span aria-hidden className='h-2.5 w-2.5 rounded-full bg-white/40' />
                    <span aria-hidden className='h-2.5 w-2.5 rounded-full bg-white/25' />
                    <span aria-hidden className='h-2.5 w-2.5 rounded-full bg-white/10' />
                  </div>
                  <pre className='overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-gray-300 md:text-xs'>
                    <code>{snippet}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
