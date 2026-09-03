'use client';

import { motion } from 'framer-motion';
import { useCursorStore } from '@/src/store/useCursorStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ProjectCard } from '@/src/lib/mdx';

export default function WorkGrid({ projects }: { projects: ProjectCard[] }) {
  const setCursorType = useCursorStore((state) => state.setType);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  /**
   * 2열이 되는 구간에서만 열 위치로 지연을 준다. 모바일은 카드마다 별도 행이라
   * 지연이 붙으면 짝수·홀수가 서로 다른 속도로 뜨는 것처럼 보인다.
   * 초기값 false는 SSR(모바일 우선)과 일치시켜 hydration 불일치를 피한다.
   */
  const [isTwoColumn, setIsTwoColumn] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsTwoColumn(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  const hovered = projects.find((p) => p.slug === hoveredSlug);

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

          {/* 고정 카테고리 라벨 대신, 가리키는 프로젝트의 정보를 보여준다 */}
          <div className='flex min-h-[3.5rem] flex-col gap-1'>
            {hovered ? (
              <>
                <span className='text-[10px] tracking-widest text-white/40 uppercase'>
                  {hovered.category}
                </span>
                <span className='text-sm leading-snug font-medium'>{hovered.title}</span>
              </>
            ) : (
              <span className='text-[10px] leading-relaxed tracking-widest text-white/25 uppercase'>
                Hover a project
                <br />
                to preview
              </span>
            )}
          </div>

          {/* hover preview */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className='aspect-[16/10] w-full overflow-hidden bg-[#1a1a1a]'
          >
            {hovered?.imageExists && (
              <div
                className='h-full w-full bg-contain bg-center bg-no-repeat'
                style={{ backgroundImage: `url(${hovered.image})` }}
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
              // 마운트 시 한꺼번에 돌면 화면 밖 카드는 이미 끝난 채로 스크롤된다 —
              // 뷰포트 진입 시점에 리빌하고, 2열일 때만 같은 행의 두 장을 좌→우로 어긋나게 한다
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                delay: isTwoColumn ? (index % 2) * 0.08 : 0,
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
                // 이미지가 있으면 링크 안이 배경·장식뿐이라 스크린리더가 목적 없는 링크로 읽는다
                aria-label={project.title}
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
