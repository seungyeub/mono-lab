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
import DemonstrationsSection from '@/src/features/work/detail/DemonstrationsSection';
import ExploreCta from '@/src/features/work/detail/ExploreCta';
import FeaturesSection from '@/src/features/work/detail/FeaturesSection';
import ImpactSection from '@/src/features/work/detail/ImpactSection';
import ImplementationSection from '@/src/features/work/detail/ImplementationSection';
import TechStackSection from '@/src/features/work/detail/TechStackSection';
import WorkDetailHero from '@/src/features/work/detail/WorkDetailHero';
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

  // order 순서상 다음 프로젝트. 마지막이면 처음으로 돌아가 탐색이 끊기지 않게 한다.
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject =
    allProjects.length > 1 ? allProjects[(currentIndex + 1) % allProjects.length] : undefined;

  // 이미지는 실존하는 에셋만 렌더링한다 (에셋 미확보 상태에서도 placeholder 없이 동작)
  const heroCandidates = meta.carouselImages.length > 0 ? meta.carouselImages : [meta.image];
  const heroImages = filterExistingPublicImages(heroCandidates);
  const demonstrations = meta.demonstrations.map((demo) => ({
    ...demo,
    existingImages: filterExistingPublicImages(demo.images),
  }));

  return (
    <main data-testid='work-detail' className='min-h-screen w-full'>
      <WorkDetailHero meta={meta} heroImages={heroImages} />

      <div className='site-container w-full px-6 pb-24 md:px-12'>
        {/* MDX 서사 — 배경·과정을 산문으로 잇는 우리 사이트의 에디토리얼 축 */}
        <article className='mx-auto mt-16 max-w-3xl md:mt-24'>
          <MDXRemote source={content} components={mdxComponents} />
        </article>

        <TechStackSection techStack={meta.techStack} />
        <FeaturesSection features={meta.features} />
        <ImplementationSection implementation={meta.implementation} />
        <DemonstrationsSection demonstrations={demonstrations} />
        <ImpactSection impact={meta.impact} />
        <ExploreCta liveUrl={meta.liveUrl} github={meta.github} />
      </div>

      {/* ── Next Project — 순차 탐색 ── */}
      {nextProject && (
        <section className='border-t border-white/10 px-6 py-12 md:px-12 md:py-16'>
          <Link href={`/work/${nextProject.slug}`} className='group flex flex-col gap-3'>
            <span className='text-xs tracking-widest text-white/40 uppercase'>Next Project</span>
            <div className='flex flex-wrap items-baseline justify-between gap-3'>
              <h2 className='text-3xl font-medium tracking-tight transition-colors duration-300 group-hover:text-white/70 md:text-5xl'>
                {nextProject.meta.title}
              </h2>
              <span className='text-xs tracking-widest text-white/40 uppercase md:text-sm'>
                {nextProject.meta.category} →
              </span>
            </div>
          </Link>
        </section>
      )}

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
