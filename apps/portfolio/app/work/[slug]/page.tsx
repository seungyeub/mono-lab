import {
  filterExistingPublicImages,
  getAllProjects,
  getProjectBySlug,
  getProjectSeoMetadata,
} from '@/src/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Marquee from '@/src/components/Marquee';
import EditorialDivider from '@/src/components/EditorialDivider';
import { ComponentPropsWithoutRef } from 'react';
import type { Metadata } from 'next';

type ProjectDetailParams = { slug: string };

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProjectDetailParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = getProjectSeoMetadata(slug);
  return seo ?? {};
}

const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className='mt-10 mb-4 text-2xl font-medium md:text-3xl' {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className='mt-8 mb-3 text-xl font-medium text-gray-200 md:text-2xl' {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className='mb-5 text-base leading-relaxed text-gray-400 md:text-lg' {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className='mb-5 flex list-inside list-disc flex-col gap-1.5 text-base text-gray-400 md:text-lg'
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => <li {...props} />,
};

/**
 * 상세 페이지 본문 섹션 공통 껍데기.
 * frontmatter가 비면 섹션 자체를 렌더링하지 않아 빈 제목만 남는 일이 없다(P0-3 계약).
 */
function WorkSection({
  title,
  isEmpty,
  children,
}: {
  title: string;
  isEmpty: boolean;
  children: React.ReactNode;
}) {
  if (isEmpty) return null;

  return (
    <section className='flex flex-col gap-6 border-t border-white/10 pt-10'>
      <h2 className='text-xs font-medium tracking-widest text-white/40 uppercase'>{title}</h2>
      {children}
    </section>
  );
}

export default async function ProjectDetail({ params }: { params: Promise<ProjectDetailParams> }) {
  const { slug: paramSlug } = await params;

  let project;
  try {
    project = getProjectBySlug(paramSlug);
  } catch {
    return notFound();
  }

  const { meta, content, slug } = project;
  const allProjects = getAllProjects();

  // 현재 프로젝트 제외 추천 2개
  const moreProjects = allProjects.filter((p) => p.slug !== slug).slice(0, 2);

  // 실존하는 이미지 에셋만 렌더링 대상으로 삼는다 (에셋 미확보 상태에서도 placeholder 없이 동작)
  const [heroImage] = filterExistingPublicImages([meta.image]);
  const galleryImages = filterExistingPublicImages(
    ['01', '02', '03', '04'].map((n) => `/images/work/${slug}/${n}.jpg`),
  );

  const META_ROWS = [
    { label: 'Category', value: meta.category },
    { label: 'Project', value: `(${String(meta.order).padStart(2, '0')})` },
    { label: 'Location', value: 'Seoul, 한국' },
  ];

  return (
    <main className='min-h-screen w-full'>
      {/* ── Full-width Hero Image (실존 에셋이 있을 때만 렌더링) ── */}
      {heroImage && (
        <section className='relative h-[55vh] w-full overflow-hidden bg-[#1a1a1a] md:h-[75vh]'>
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-[var(--site-bg)]/60 to-transparent' />
        </section>
      )}

      {/* ── Split layout: sticky left + scrollable right ── */}
      <section className='flex flex-col gap-0 px-6 pt-16 pb-32 md:flex-row md:px-12'>
        {/* LEFT — Sticky meta panel */}
        <div className='hidden w-72 flex-shrink-0 md:block'>
          <div className='sticky top-28 flex flex-col gap-10'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-2xl font-medium tracking-tight md:text-3xl'>{meta.title}</h1>
            </div>

            {/* Meta rows */}
            <div className='flex flex-col gap-0 border-t border-white/10'>
              {META_ROWS.map(({ label, value }) => (
                <div
                  key={label}
                  className='flex justify-between border-b border-white/10 py-3 text-sm'
                >
                  <span className='text-[10px] tracking-widest text-white/40 uppercase'>
                    {label}
                  </span>
                  <span className='text-white/80'>{value}</span>
                </div>
              ))}
            </div>

            {/* Live Website CTA — frontmatter에 liveUrl이 있을 때만 렌더링 */}
            {meta.liveUrl && (
              <a
                href={meta.liveUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='self-start rounded-full border border-white/30 px-6 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black'
              >
                Live Website ↗
              </a>
            )}

            {/* Back to work */}
            <Link
              href='/work'
              className='text-xs tracking-widest text-white/30 uppercase transition-colors duration-200 hover:text-white'
            >
              ← All Works
            </Link>
          </div>
        </div>

        {/* RIGHT — Scrollable content */}
        <div className='flex flex-1 flex-col gap-10 md:pl-16'>
          {/* Mobile title */}
          <div className='mb-4 flex flex-col gap-4 md:hidden'>
            <h1 className='text-3xl font-medium'>{meta.title}</h1>
            <p className='text-sm tracking-widest text-white/40 uppercase'>{meta.category}</p>
          </div>

          {/* 한 문단 요약 — Hero 바로 아래에서 프로젝트를 한 눈에 설명한다 */}
          {meta.summary && (
            <p className='max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl'>
              {meta.summary}
            </p>
          )}

          {/* MDX article */}
          <article>
            <MDXRemote source={content} components={mdxComponents} />
          </article>

          {/* ── Project Overview ── */}
          <WorkSection title='Project Overview' isEmpty={meta.overview.length === 0}>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              {meta.overview.map((item) => (
                <div key={item.title} className='flex flex-col gap-2'>
                  <h3 className='text-base font-medium md:text-lg'>{item.title}</h3>
                  <p className='text-sm leading-relaxed text-gray-400 md:text-base'>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </WorkSection>

          {/* ── Technology Stack ── */}
          <WorkSection title='Technology Stack' isEmpty={meta.techStack.length === 0}>
            <ul className='flex flex-wrap gap-2'>
              {meta.techStack.map((tech) => (
                <li
                  key={tech}
                  className='rounded-full border border-white/20 px-4 py-1.5 text-xs tracking-wide text-white/80 md:text-sm'
                >
                  {tech}
                </li>
              ))}
            </ul>
          </WorkSection>

          {/* ── Key Features ── */}
          <WorkSection title='Key Features' isEmpty={meta.features.length === 0}>
            <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2'>
              {meta.features.map((feature) => (
                <div
                  key={feature.title}
                  className='flex flex-col gap-2 border-l border-white/10 pl-4'
                >
                  <h3 className='text-base font-medium md:text-lg'>{feature.title}</h3>
                  <p className='text-sm leading-relaxed text-gray-400 md:text-base'>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </WorkSection>

          {/* ── Technical Implementation ── */}
          <WorkSection
            title='Technical Implementation'
            isEmpty={
              !meta.implementation.architecture && meta.implementation.highlights.length === 0
            }
          >
            {meta.implementation.architecture && (
              <p className='text-base leading-relaxed text-gray-300 md:text-lg'>
                {meta.implementation.architecture}
              </p>
            )}
            {meta.implementation.highlights.length > 0 && (
              <ul className='flex flex-col gap-2.5'>
                {meta.implementation.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className='flex gap-3 text-sm leading-relaxed text-gray-400 md:text-base'
                  >
                    <span aria-hidden className='mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40' />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </WorkSection>

          {/* ── Demonstrations ── */}
          <WorkSection title='Demonstrations' isEmpty={meta.demonstrations.length === 0}>
            <div className='flex flex-col gap-12'>
              {meta.demonstrations.map((demo) => {
                // 스크린샷은 아직 확보되지 않을 수 있으므로 실존하는 것만 렌더링한다
                const demoImages = filterExistingPublicImages(demo.images);

                return (
                  <div key={demo.title} className='flex flex-col gap-4'>
                    <h3 className='text-base font-medium md:text-lg'>{demo.title}</h3>

                    {demo.description && (
                      <p className='text-sm leading-relaxed text-gray-400 md:text-base'>
                        {demo.description}
                      </p>
                    )}

                    {demoImages.length > 0 && (
                      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        {demoImages.map((imgPath) => (
                          <div
                            key={imgPath}
                            className='relative aspect-[4/3] overflow-hidden bg-[#1a1a1a]'
                          >
                            <div
                              className='absolute inset-0 bg-cover bg-center'
                              style={{ backgroundImage: `url(${imgPath})` }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {demo.outcome && (
                      <p className='border-l-2 border-white/30 pl-4 text-sm text-white/80 md:text-base'>
                        {demo.outcome}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </WorkSection>

          {/* ── Impact & Results ── */}
          <WorkSection
            title='Impact & Results'
            isEmpty={meta.impact.metrics.length === 0 && meta.impact.outcomes.length === 0}
          >
            {meta.impact.metrics.length > 0 && (
              <dl className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
                {meta.impact.metrics.map((metric) => (
                  <div key={metric.label} className='flex flex-col gap-1'>
                    <dt className='text-[10px] tracking-widest text-white/40 uppercase'>
                      {metric.label}
                    </dt>
                    <dd className='text-xl font-medium md:text-2xl'>{metric.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {meta.impact.outcomes.length > 0 && (
              <ul className='flex flex-col gap-2.5'>
                {meta.impact.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className='flex gap-3 text-sm leading-relaxed text-gray-400 md:text-base'
                  >
                    <span aria-hidden className='mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40' />
                    {outcome}
                  </li>
                ))}
              </ul>
            )}
          </WorkSection>

          {/* Extra image gallery — 실존 에셋이 있을 때만 렌더링 */}
          {galleryImages.length > 0 && (
            <div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-2'>
              {galleryImages.map((imgPath) => (
                <div key={imgPath} className='relative aspect-[4/3] overflow-hidden bg-[#1a1a1a]'>
                  <div
                    className='absolute inset-0 bg-cover bg-center'
                    style={{ backgroundImage: `url(${imgPath})` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── More Works ── */}
      {moreProjects.length > 0 && (
        <>
          <EditorialDivider left='More Works' center='Continue Exploring' right='→' />

          {/* "More Works©" 마르퀴 */}
          <Marquee
            items={['More Works©', 'Next Projects', 'See Also']}
            speed={40}
            textClassName='text-white/[0.06] text-[clamp(2rem,8vw,7rem)] font-medium'
            className='border-none py-2'
          />

          <div className='grid grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-2 md:gap-8 md:px-12'>
            {moreProjects.map((p) => {
              const [cardImage] = filterExistingPublicImages([p.meta.image]);
              return (
                <Link key={p.slug} href={`/work/${p.slug}`} className='group flex flex-col gap-3'>
                  <div className='relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]'>
                    {cardImage ? (
                      <div
                        className='absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105'
                        style={{ backgroundImage: `url(${cardImage})` }}
                      />
                    ) : (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='px-4 text-center text-sm tracking-widest text-white/40 uppercase transition-colors duration-300 group-hover:text-white/70'>
                          {p.meta.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className='flex items-start justify-between'>
                    <span className='text-base font-medium'>{p.meta.title}</span>
                    <span className='text-xs text-white/40'>{p.meta.category}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
