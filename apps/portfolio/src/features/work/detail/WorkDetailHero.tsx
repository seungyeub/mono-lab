import Link from 'next/link';
import type { ProjectMetadata } from '@/src/lib/mdx';
import ImageCarousel from './ImageCarousel';

/**
 * 상세 페이지 Hero — 레퍼런스의 중앙 정렬 구성(라벨 → 제목 → 요약 → 프레임 카드)을
 * 우리 톤으로 옮긴 것. 프레임 카드는 좌측 캐러셀 + 우측 Project Overview 2열이며,
 * overview 데이터가 없으면 캐러셀 단독(1열)로 렌더링한다.
 */
export default function WorkDetailHero({
  meta,
  heroImages,
}: {
  meta: ProjectMetadata;
  heroImages: string[];
}) {
  const hasOverview = meta.overview.length > 0;

  return (
    <section className='site-container w-full px-6 pt-10 md:px-12 md:pt-14'>
      {/* 복귀 링크 */}
      <Link
        href='/work'
        className='inline-flex items-center gap-2 text-xs tracking-widest text-white/40 uppercase transition-colors duration-200 hover:text-white'
      >
        ← All Works
      </Link>

      {/* 중앙 헤드라인 */}
      <div className='mx-auto mt-10 flex max-w-4xl flex-col items-center gap-5 text-center md:mt-14'>
        <span className='inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase'>
          <span aria-hidden className='h-1 w-1 animate-pulse rounded-full bg-white/70' />
          Featured Project
        </span>
        <h1 className='text-3xl font-semibold tracking-tight md:text-5xl'>{meta.title}</h1>
        {meta.summary && (
          <p className='max-w-3xl text-base leading-relaxed text-gray-400 md:text-lg'>
            {meta.summary}
          </p>
        )}
        <p className='text-[11px] tracking-[0.2em] text-white/30 uppercase'>
          {meta.category} · ({String(meta.order).padStart(2, '0')}) · Seoul, 한국
        </p>
      </div>

      {/* 프레임 카드: 캐러셀 + Overview */}
      <div className='mx-auto mt-10 max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors duration-500 hover:border-white/20 sm:p-6 md:mt-14 md:p-10'>
        <div className={`grid items-center gap-6 md:gap-10 ${hasOverview ? 'lg:grid-cols-2' : ''}`}>
          <ImageCarousel images={heroImages} fallbackLabel={meta.title} />

          {hasOverview && (
            <div>
              <h2 className='mb-5 text-xl font-semibold tracking-tight md:text-2xl'>
                Project Overview
              </h2>
              <div className='flex flex-col gap-5'>
                {meta.overview.map((item, index) => (
                  <div key={item.title} className='flex items-start gap-3'>
                    <span
                      aria-hidden
                      className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/15 font-mono text-[10px] text-white/60'
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className='text-sm font-semibold md:text-base'>{item.title}</h3>
                      <p className='mt-1 text-xs leading-relaxed text-gray-400 md:text-sm'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
