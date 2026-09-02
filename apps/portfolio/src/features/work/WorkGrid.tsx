'use client';

import { motion } from 'framer-motion';
import { useCursorStore } from '@/src/store/useCursorStore';
import Link from 'next/link';
import { useState } from 'react';
import type { ProjectCard } from '@/src/lib/mdx';

export default function WorkGrid({ projects }: { projects: ProjectCard[] }) {
  const setCursorType = useCursorStore((state) => state.setType);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <div className='flex w-full flex-col gap-0 md:flex-row md:gap-16'>
      {/* ── LEFT: Sticky info panel ── */}
      <div className='hidden w-56 flex-shrink-0 flex-col md:flex'>
        <div className='sticky top-32 flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <span className='text-[10px] tracking-[0.2em] text-white/40 uppercase'>All Works</span>
            <span className='text-5xl font-medium tabular-nums'>
              ({String(projects.length).padStart(2, '0')})
            </span>
          </div>

          <div className='flex flex-col gap-2 text-[10px] tracking-widest text-white/25 uppercase'>
            <span>Brand Identity</span>
            <span>Logo Design</span>
            <span>Visual Systems</span>
          </div>

          {/* hover preview */}
          <motion.div
            animate={{ opacity: hoveredSlug ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className='aspect-[16/10] w-full overflow-hidden bg-[#1a1a1a]'
          >
            {hoveredSlug && (
              <div
                className='h-full w-full bg-contain bg-center bg-no-repeat'
                style={{
                  backgroundImage: `url(${projects.find((p) => p.slug === hoveredSlug)?.image})`,
                }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT: Large thumbnail cards ── */}
      <div className='grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 md:gap-8'>
        {projects.map((project, index) => {
          const isDimmed = hoveredSlug !== null && hoveredSlug !== project.slug;

          return (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                opacity: isDimmed ? 0.35 : 1,
                transition: 'opacity 0.25s ease',
              }}
              className={`flex flex-col gap-3 ${index % 2 === 1 ? 'md:mt-16' : ''}`}
            >
              <Link
                href={`/work/${project.slug}`}
                onMouseEnter={() => {
                  setCursorType('view');
                  setHoveredSlug(project.slug);
                }}
                onMouseLeave={() => {
                  setCursorType('default');
                  setHoveredSlug(null);
                }}
                className='group relative block aspect-[16/10] overflow-hidden bg-[#1a1a1a]'
              >
                {project.imageExists ? (
                  <>
                    {/* 캡쳐 비율이 제각각이라 contain으로 잘림 없이 담는다 */}
                    <div
                      className='absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105'
                      style={{ backgroundImage: `url(${project.image})` }}
                    />
                    {/* overlay on hover */}
                    <div className='absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10' />
                  </>
                ) : (
                  // 에셋 미확보 프로젝트 — 빈 상자 대신 제목을 읽히게 둔다
                  <div className='absolute inset-0 flex items-center justify-center px-6'>
                    <span className='text-center text-sm tracking-widest text-white/40 uppercase transition-colors duration-300 group-hover:text-white/70'>
                      {project.title}
                    </span>
                  </div>
                )}
              </Link>

              <div className='flex items-start justify-between'>
                <h3 className='text-base font-medium md:text-lg'>{project.title}</h3>
                <div className='flex flex-col items-end gap-0.5 text-right text-xs text-white/40'>
                  <span>({String(project.order).padStart(2, '0')})</span>
                  <span>{project.category}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
