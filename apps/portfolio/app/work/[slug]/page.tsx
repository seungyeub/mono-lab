import { getAllProjects, getProjectBySlug } from '@/src/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Marquee from '@/src/components/Marquee';
import EditorialDivider from '@/src/components/EditorialDivider';

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

const mdxComponents = {
  h1: (props: any) => <h1 className='text-2xl md:text-3xl font-medium mt-10 mb-4' {...props} />,
  h2: (props: any) => (
    <h2 className='text-xl md:text-2xl font-medium mt-8 mb-3 text-gray-200' {...props} />
  ),
  p: (props: any) => (
    <p className='text-base md:text-lg text-gray-400 leading-relaxed mb-5' {...props} />
  ),
  ul: (props: any) => (
    <ul
      className='list-disc list-inside text-base md:text-lg text-gray-400 mb-5 flex flex-col gap-1.5'
      {...props}
    />
  ),
  li: (props: any) => <li {...props} />,
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
      <section className='w-full h-[55vh] md:h-[75vh] relative overflow-hidden bg-[#1a1a1a]'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{ backgroundImage: `url(${meta.image})` }}
        />
        {/* placeholder */}
        <div className='absolute inset-0 flex items-center justify-center opacity-10 text-white text-xs uppercase tracking-widest'>
          {meta.image}
        </div>
        <div className='absolute inset-0 bg-gradient-to-t from-[var(--site-bg)]/60 to-transparent' />
      </section>

      {/* ── Split layout: sticky left + scrollable right ── */}
      <section className='flex flex-col md:flex-row gap-0 px-6 md:px-12 pt-16 pb-32'>
        {/* LEFT — Sticky meta panel */}
        <div className='hidden md:block w-72 flex-shrink-0'>
          <div className='sticky top-28 flex flex-col gap-10'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-2xl md:text-3xl font-medium tracking-tight'>{meta.title}</h1>
            </div>

            {/* Meta rows */}
            <div className='flex flex-col gap-0 border-t border-white/10'>
              {META_ROWS.map(({ label, value }) => (
                <div
                  key={label}
                  className='flex justify-between py-3 border-b border-white/10 text-sm'
                >
                  <span className='text-white/40 uppercase tracking-widest text-[10px]'>
                    {label}
                  </span>
                  <span className='text-white/80'>{value}</span>
                </div>
              ))}
            </div>

            {/* Live Website placeholder */}
            <a
              href='#'
              className='self-start border border-white/30 rounded-full px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300'
            >
              Live Website ↗
            </a>

            {/* Back to work */}
            <Link
              href='/work'
              className='text-xs text-white/30 uppercase tracking-widest hover:text-white transition-colors duration-200'
            >
              ← All Works
            </Link>
          </div>
        </div>

        {/* RIGHT — Scrollable content */}
        <div className='flex-1 md:pl-16 flex flex-col gap-10'>
          {/* Mobile title */}
          <div className='md:hidden flex flex-col gap-4 mb-4'>
            <h1 className='text-3xl font-medium'>{meta.title}</h1>
            <p className='text-sm text-white/40 uppercase tracking-widest'>{meta.category}</p>
          </div>

          {/* MDX article */}
          <article>
            <MDXRemote source={content} components={mdxComponents} />
          </article>

          {/* Extra image gallery slots (이미지 경로 기반) */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
            {[
              `/images/work/${slug}/01.jpg`,
              `/images/work/${slug}/02.jpg`,
              `/images/work/${slug}/03.jpg`,
              `/images/work/${slug}/04.jpg`,
            ].map((imgPath) => (
              <div key={imgPath} className='aspect-[4/3] bg-[#1a1a1a] relative overflow-hidden'>
                <div
                  className='absolute inset-0 bg-cover bg-center'
                  style={{ backgroundImage: `url(${imgPath})` }}
                />
                {/* placeholder */}
                <div className='absolute inset-0 flex items-center justify-center opacity-10 text-white text-[9px] uppercase tracking-widest break-all p-2 text-center'>
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

          <div className='px-6 md:px-12 pb-24 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
            {moreProjects.map((p) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className='group flex flex-col gap-3'>
                <div className='aspect-[3/4] bg-[#1a1a1a] relative overflow-hidden'>
                  <div
                    className='absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105'
                    style={{ backgroundImage: `url(${p.meta.image})` }}
                  />
                  <div className='absolute inset-0 flex items-center justify-center opacity-10 text-white text-xs uppercase tracking-widest'>
                    {p.meta.title}
                  </div>
                </div>
                <div className='flex justify-between items-start'>
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
