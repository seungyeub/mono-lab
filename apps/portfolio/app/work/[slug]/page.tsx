import { getAllProjects, getProjectBySlug } from '@/src/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Marquee from '@/src/components/Marquee';
import EditorialDivider from '@/src/components/EditorialDivider';
import { ComponentPropsWithoutRef } from 'react';

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
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

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  let project;
  try {
    project = getProjectBySlug(params.slug);
  } catch {
    return notFound();
  }

  const { meta, content, slug } = project;
  const allProjects = getAllProjects();

  // 현재 프로젝트 제외 추천 2개
  const moreProjects = allProjects.filter((p) => p.slug !== slug).slice(0, 2);

  const META_ROWS = [
    { label: 'Category', value: meta.category },
    { label: 'Project', value: `(${String(meta.order).padStart(2, '0')})` },
    { label: 'Location', value: 'Seoul, 한국' },
  ];

  return (
    <main className='min-h-screen w-full'>
      {/* ── Full-width Hero Image ── */}
      <section className='relative h-[55vh] w-full overflow-hidden bg-[#1a1a1a] md:h-[75vh]'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{ backgroundImage: `url(${meta.image})` }}
        />
        {/* placeholder */}
        <div className='absolute inset-0 flex items-center justify-center text-xs tracking-widest text-white uppercase opacity-10'>
          {meta.image}
        </div>
        <div className='absolute inset-0 bg-gradient-to-t from-[var(--site-bg)]/60 to-transparent' />
      </section>

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

            {/* Live Website placeholder */}
            <a
              href='#'
              className='self-start rounded-full border border-white/30 px-6 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black'
            >
              Live Website ↗
            </a>

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

          {/* MDX article */}
          <article>
            <MDXRemote source={content} components={mdxComponents} />
          </article>

          {/* Extra image gallery slots (이미지 경로 기반) */}
          <div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-2'>
            {[
              `/images/work/${slug}/01.jpg`,
              `/images/work/${slug}/02.jpg`,
              `/images/work/${slug}/03.jpg`,
              `/images/work/${slug}/04.jpg`,
            ].map((imgPath) => (
              <div key={imgPath} className='relative aspect-[4/3] overflow-hidden bg-[#1a1a1a]'>
                <div
                  className='absolute inset-0 bg-cover bg-center'
                  style={{ backgroundImage: `url(${imgPath})` }}
                />
                {/* placeholder */}
                <div className='absolute inset-0 flex items-center justify-center p-2 text-center text-[9px] tracking-widest break-all text-white uppercase opacity-10'>
                  {imgPath}
                </div>
              </div>
            ))}
          </div>
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
            {moreProjects.map((p) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className='group flex flex-col gap-3'>
                <div className='relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]'>
                  <div
                    className='absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105'
                    style={{ backgroundImage: `url(${p.meta.image})` }}
                  />
                  <div className='absolute inset-0 flex items-center justify-center text-xs tracking-widest text-white uppercase opacity-10'>
                    {p.meta.title}
                  </div>
                </div>
                <div className='flex items-start justify-between'>
                  <span className='text-base font-medium'>{p.meta.title}</span>
                  <span className='text-xs text-white/40'>{p.meta.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
