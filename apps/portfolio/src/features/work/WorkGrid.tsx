'use client';

import { motion } from 'framer-motion';
import { useCursorStore } from '@/src/store/useCursorStore';
import Link from 'next/link';
import { useState } from 'react';

interface Project {
  slug: string;
  meta: {
    title: string;
    category: string;
    order: number;
    image: string;
  };
}

export default function WorkList({ projects }: { projects: Project[] }) {
  const setCursorType = useCursorStore((state) => state.setType);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    /* Split layout: 좌측 sticky info + 우측 스크롤 카드 */
    <div className="flex flex-col md:flex-row gap-0 md:gap-16 w-full">

      {/* ── LEFT: Sticky info panel ── */}
      <div className="hidden md:flex flex-col justify-between w-64 flex-shrink-0">
        <div className="sticky top-32 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              All Works
            </span>
            <span className="text-5xl font-medium tabular-nums">
              ({String(projects.length).padStart(2, '0')})
            </span>
          </div>

          <div className="flex flex-col gap-2 text-xs text-white/30 uppercase tracking-widest">
            <span>Brand Identity</span>
            <span>Logo Design</span>
            <span>Visual Systems</span>
          </div>

          {/* 현재 hover된 프로젝트 미리보기 */}
          <div
            className="overflow-hidden bg-[#1a1a1a] aspect-[4/5] w-full transition-opacity duration-300"
            style={{ opacity: hoveredSlug ? 1 : 0 }}
          >
            {hoveredSlug && (
              <div
                className="w-full h-full bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: `url(${projects.find((p) => p.slug === hoveredSlug)?.meta.image})`,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Scrollable project cards ── */}
      <div className="flex-1 flex flex-col gap-0">
        {projects.map((project, index) => {
          const isDimmed = hoveredSlug !== null && hoveredSlug !== project.slug;

          return (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                opacity: isDimmed ? 0.3 : 1,
                transition: 'opacity 0.25s ease',
              }}
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
                className="group flex items-center gap-6 md:gap-10 border-b border-white/10 py-8 md:py-10 w-full"
              >
                {/* 번호 */}
                <span className="text-xs text-white/30 font-mono tabular-nums w-8 flex-shrink-0">
                  ({String(project.meta.order).padStart(2, '0')})
                </span>

                {/* 제목 */}
                <h2 className="flex-1 text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                  {project.meta.title}
                </h2>

                {/* 카테고리 + 이미지 썸네일 (모바일용) */}
                <div className="flex items-center gap-6">
                  <span className="hidden md:block text-xs text-white/40 uppercase tracking-widest">
                    {project.meta.category}
                  </span>

                  {/* 모바일: 작은 썸네일 */}
                  <div className="block md:hidden w-16 h-16 overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url(${project.meta.image})` }}
                    />
                  </div>

                  {/* 화살표 */}
                  <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 text-lg">
                    ↗
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
