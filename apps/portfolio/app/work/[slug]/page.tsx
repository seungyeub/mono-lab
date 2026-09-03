import {
  filterExistingPublicImages,
  getAllProjects,
  getProjectBySlug,
  getProjectSeoMetadata,
  publicAssetExists,
} from '@/src/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DemonstrationsSection from '@/src/features/work/detail/DemonstrationsSection';
import ExploreCta from '@/src/features/work/detail/ExploreCta';
import FeaturesSection from '@/src/features/work/detail/FeaturesSection';
import ImpactSection from '@/src/features/work/detail/ImpactSection';
import ImplementationSection from '@/src/features/work/detail/ImplementationSection';
import ScrollToTop from '@/src/features/work/detail/ScrollToTop';
import SectionHeading from '@/src/features/work/detail/SectionHeading';
import TechStackSection from '@/src/features/work/detail/TechStackSection';
import WorkDetailHero from '@/src/features/work/detail/WorkDetailHero';
import { ComponentPropsWithoutRef } from 'react';
import type { Metadata } from 'next';

import JsonLd from '@/src/components/JsonLd';
import { absoluteUrl } from '@/src/lib/siteConfig';
import { buildBreadcrumbSchema, buildCreativeWorkSchema } from '@/src/lib/structuredData';

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
  if (!seo) return {};

  // 카드 이미지가 실제로 있을 때만 OG 이미지를 덮어쓴다.
  // 없는 경로를 내보내면 미리보기가 깨진 채로 공유된다 — 루트의 기본 이미지가 낫다.
  const { meta } = getProjectBySlug(slug);
  const ogImage =
    meta.image && publicAssetExists(meta.image) ? [absoluteUrl(meta.image)] : undefined;
  const canonical = `/work/${slug}`;

  return {
    ...seo,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: absoluteUrl(canonical),
      title: seo.title,
      description: seo.description,
      ...(ogImage ? { images: ogImage } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      ...(ogImage ? { images: ogImage } : {}),
    },
  };
}

const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className='mt-10 mb-4 text-2xl font-medium md:text-3xl' {...props} />
  ),
  // 산문 소제목을 다른 섹션의 번호 타일 문법과 맞춘다(CSS 카운터로 01·02 자동 부여).
  // 이전 스타일로 되돌리려면 이 h2를 단순 텍스트 버전으로 교체하고
  // article의 [counter-reset:story]와 SectionHeading(Project Story)을 제거하면 된다.
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className='mt-12 mb-4 flex items-center gap-3 text-xl font-medium text-gray-200 before:flex before:h-8 before:w-8 before:shrink-0 before:items-center before:justify-center before:rounded-md before:border before:border-white/15 before:font-mono before:text-[11px] before:font-normal before:text-white/60 before:content-[counter(story,decimal-leading-zero)] before:[counter-increment:story] md:text-2xl'
      {...props}
    />
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
      {/* 경로 계층과 작업물 정보. 저자는 루트에서 낸 Person을 @id로 참조한다 */}
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Archive', path: '/work' },
            { name: meta.title, path: `/work/${slug}` },
          ]),
          buildCreativeWorkSchema({
            slug,
            title: meta.title,
            category: meta.category,
            ...(meta.summary ? { summary: meta.summary } : {}),
            ...(meta.image && publicAssetExists(meta.image) ? { image: meta.image } : {}),
            techStack: meta.techStack,
          }),
        ]}
      />
      <ScrollToTop trigger={slug} />
      <WorkDetailHero meta={meta} heroImages={heroImages} />

      <div className='site-container w-full px-6 pb-24 md:px-12'>
        {/* MDX 서사 — 배경·과정을 산문으로 잇는 우리 사이트의 에디토리얼 축 */}
        <section className='mt-20 md:mt-28'>
          <SectionHeading
            eyebrow='Project Story'
            title='프로젝트 이야기'
            description='배경과 과정, 그리고 판단의 기록'
          />
          <article className='mx-auto max-w-3xl [counter-reset:story]'>
            <MDXRemote source={content} components={mdxComponents} />
          </article>
        </section>

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
    </main>
  );
}
