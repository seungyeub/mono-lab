'use client';

import { motion } from 'framer-motion';
import { useCursorStore } from '@/src/store/useCursorStore';
import Link from 'next/link';

const PROJECTS = [
  { id: 1, title: 'Meltdown Studios',   category: 'Visual Identity', image: '/images/projects/01.jpg', href: '/work/meltdown',  col: 'left',   order: '01' },
  { id: 2, title: 'Rootwise Architects',category: 'Brand Identity',  image: '/images/projects/02.jpg', href: '/work/rootwise', col: 'right',  order: '02' },
  { id: 3, title: 'Meridiem',           category: 'Visual System',   image: '/images/projects/03.jpg', href: '/work/meridiem', col: 'center', order: '03' },
  { id: 4, title: 'Nutree Bakery',      category: 'Identity Design', image: '/images/projects/04.jpg', href: '/work/nutree',   col: 'left',   order: '04' },
  { id: 5, title: 'Animal & Birds',     category: 'Logo Design',     image: '/images/projects/05.jpg', href: '/work/nutree',   col: 'right',  order: '05' },
];

const leftProjects   = PROJECTS.filter((p) => p.col === 'left');
const centerProjects = PROJECTS.filter((p) => p.col === 'center');
const rightProjects  = PROJECTS.filter((p) => p.col === 'right');

interface CardProps {
  project: typeof PROJECTS[0];
  delay?: number;
  aspectClass?: string;
}

function ProjectCard({ project, delay = 0, aspectClass = 'aspect-[3/4]' }: CardProps) {
  const setCursorType = useCursorStore((s) => s.setType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3"
    >
      <Link
        href={project.href}
        onMouseEnter={() => setCursorType('view')}
        onMouseLeave={() => setCursorType('default')}
        className={`group relative block overflow-hidden bg-[#1a1a1a] ${aspectClass}`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          style={{ backgroundImage: `url(${project.image})` }}
        />
        {/* placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 text-white text-xs uppercase tracking-widest">
          {project.title}
        </div>
      </Link>
      <div className="flex justify-between items-start">
        <span className="text-sm md:text-base font-medium">{project.title}</span>
        <div className="text-xs text-white/40 text-right flex flex-col items-end">
          <span>({project.order})</span>
          <span>{project.category}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedWorks() {
  const setCursorType = useCursorStore((s) => s.setType);

  return (
    <section className="w-full bg-[#0a0a0a] pb-24 md:pb-32">
      {/* 대형 마르퀴 제목 */}
      <div className="overflow-hidden border-y border-white/10 py-4 mb-12 md:mb-16">
        <div
          className="flex whitespace-nowrap gap-8"
          style={{ animation: 'marquee-scroll 22s linear infinite' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="text-[clamp(2.5rem,8vw,7rem)] font-medium tracking-tight leading-none text-white/[0.07] uppercase flex-shrink-0"
            >
              Featured Works© —&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* 비대칭 3열 레이아웃 */}
      <div className="px-6 md:px-12">
        {/* Desktop: 3열 비대칭 */}
        <div className="hidden md:grid grid-cols-[1fr_0.8fr_1fr] gap-6 lg:gap-8 items-start">
          {/* 좌측 컬럼 */}
          <div className="flex flex-col gap-6 lg:gap-8 pt-0">
            {leftProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} delay={i * 0.1} aspectClass="aspect-[3/4]" />
            ))}
          </div>

          {/* 중앙 컬럼 — 상단 오프셋으로 스태거 */}
          <div className="flex flex-col gap-6 lg:gap-8 pt-24">
            {centerProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} delay={0.15 + i * 0.1} aspectClass="aspect-[2/3]" />
            ))}
          </div>

          {/* 우측 컬럼 — 중간 오프셋 */}
          <div className="flex flex-col gap-6 lg:gap-8 pt-12">
            {rightProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} delay={0.2 + i * 0.1} aspectClass="aspect-[3/4]" />
            ))}
          </div>
        </div>

        {/* Mobile: 1열 */}
        <div className="flex flex-col gap-8 md:hidden">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} delay={i * 0.05} aspectClass="aspect-[4/5]" />
          ))}
        </div>

        {/* See Works CTA */}
        <div className="flex justify-center mt-16 md:mt-20">
          <Link
            href="/work"
            onMouseEnter={() => setCursorType('pointer')}
            onMouseLeave={() => setCursorType('default')}
            className="border border-white/40 rounded-full px-10 py-4 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            See All Works
          </Link>
        </div>
      </div>
    </section>
  );
}
