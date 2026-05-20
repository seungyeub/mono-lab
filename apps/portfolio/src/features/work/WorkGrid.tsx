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

export default function WorkGrid({ projects }: { projects: Project[] }) {
  const setCursorType = useCursorStore((state) => state.setType);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-16 w-full">

      {/* ── LEFT: Sticky info panel ── */}
      <div className="hidden md:flex flex-col w-56 flex-shrink-0">
        <div className="sticky top-32 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">All Works</span>
            <span className="text-5xl font-medium tabular-nums">
              ({String(projects.length).padStart(2, '0')})
            </span>
          </div>

          <div className="flex flex-col gap-2 text-[10px] text-white/25 uppercase tracking-widest">
            <span>Brand Identity</span>
            <span>Logo Design</span>
            <span>Visual Systems</span>
          </div>

          {/* hover preview */}
          <motion.div
            animate={{ opacity: hoveredSlug ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-[#1a1a1a] aspect-[3/4] w-full"
          >
            {hoveredSlug && (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${projects.find((p) => p.slug === hoveredSlug)?.meta.image})`,
                }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT: Large thumbnail cards ── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {projects.map((project, index) => {
          const isDimmed = hoveredSlug !== null && hoveredSlug !== project.slug;

          return (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ opacity: isDimmed ? 0.35 : 1, transition: 'opacity 0.25s ease' }}
              className={`flex flex-col gap-3 ${index % 2 === 1 ? 'md:mt-16' : ''}`}
            >
              <Link
                href={`/work/${project.slug}`}
                onMouseEnter={() => { setCursorType('view'); setHoveredSlug(project.slug); }}
                onMouseLeave={() => { setCursorType('default'); setHoveredSlug(null); }}
                className="group relative block overflow-hidden bg-[#1a1a1a] aspect-[3/4]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  style={{ backgroundImage: `url(${project.meta.image})` }}
                />
                {/* overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                {/* placeholder */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 text-white text-xs uppercase tracking-widest">
                  {project.meta.title}
                </div>
              </Link>

              <div className="flex justify-between items-start">
                <h3 className="text-base md:text-lg font-medium">{project.meta.title}</h3>
                <div className="text-xs text-white/40 text-right flex flex-col items-end gap-0.5">
                  <span>({String(project.meta.order).padStart(2, '0')})</span>
                  <span>{project.meta.category}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
