'use client';

import SectionLabel from '@/src/components/SectionLabel';
import { useCursorStore } from '@/src/store/useCursorStore';
import { motion, type MotionValue, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import RollingLink from '@/src/components/RollingText/RollingLink';
import { useRef } from 'react';

/** 단어별 scroll-reveal — 스크롤에 따라 앞부터 순서대로 밝아집니다 */
function ScrollRevealText({ text, className = '' }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'end 0.4'],
  });

  return (
    <p ref={containerRef} className={`flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;

        return (
          <WordReveal
            key={i}
            word={word}
            scrollYProgress={scrollYProgress}
            start={start}
            end={end}
          />
        );
      })}
    </p>
  );
}

function WordReveal({
  word,
  scrollYProgress,
  start,
  end,
}: {
  word: string;
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.12, 1]);

  return (
    <motion.span style={{ opacity }} className='inline-block'>
      {word}
    </motion.span>
  );
}

const PROJECTS = [
  {
    id: 1,
    title: 'Meltdown Studios',
    category: 'Visual Identity',
    image: '/images/projects/01.jpg',
    href: '/work/meltdown',
    order: '01',
  },
  {
    id: 2,
    title: 'Rootwise Architects',
    category: 'Brand Identity',
    image: '/images/projects/02.jpg',
    href: '/work/rootwise',
    order: '02',
  },
  {
    id: 3,
    title: 'Meridiem',
    category: 'Visual System',
    image: '/images/projects/03.jpg',
    href: '/work/meridiem',
    order: '03',
  },
  {
    id: 4,
    title: 'Nutree Bakery',
    category: 'Identity Design',
    image: '/images/projects/04.jpg',
    href: '/work/nutree',
    order: '04',
  },
  {
    id: 5,
    title: 'Animal & Birds',
    category: 'Logo Design',
    image: '/images/projects/05.jpg',
    href: '/work/nutree',
    order: '05',
  },
];

interface CardProps {
  project: (typeof PROJECTS)[0];
  delay?: number;
  aspectClass?: string;
}

function ProjectCard({ project, delay = 0, aspectClass = 'aspect-[3/4]' }: CardProps) {
  const setCursorType = useCursorStore((s) => s.setType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className='flex flex-col gap-3'
    >
      <Link
        href={project.href}
        onMouseEnter={() => setCursorType('view')}
        onMouseLeave={() => setCursorType('default')}
        className={`group relative block overflow-hidden bg-[#1a1a1a] ${aspectClass}`}
      >
        <div
          className='absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105'
          style={{ backgroundImage: `url(${project.image})` }}
        />
        <div className='absolute inset-0 flex items-center justify-center opacity-10 text-white text-xs uppercase tracking-widest'>
          {project.title}
        </div>
      </Link>
      <div className='flex justify-between items-start'>
        <span className='text-sm md:text-base font-medium'>{project.title}</span>
        <div className='text-xs text-white/40 text-right flex flex-col items-end'>
          <span>({project.order})</span>
          <span>{project.category}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorksSection() {
  const setCursorType = useCursorStore((s) => s.setType);

  const leftColProjects = PROJECTS.filter((_, i) => i % 2 === 0);
  const rightColProjects = PROJECTS.filter((_, i) => i % 2 !== 0);

  return (
    <section className='w-full pt-[80px] md:pt-[120px] pb-24 md:pb-32'>
      <SectionLabel
        scene='02'
        leftLabel='© Featured Projects 프로젝트'
        rightLabel='Selected Works'
      />

      <div className='site-container px-6 md:px-12 w-full mt-12 md:mt-24'>
        <div className='flex flex-col lg:flex-row gap-12 lg:gap-24 items-start'>
          {/* Left Column: Sticky Profile */}
          <div className='w-full lg:w-5/12 lg:sticky lg:top-32 flex flex-col gap-8'>
            <ScrollRevealText
              text='Building brand systems with strategic clarity and visual precision. Delivering cohesive identities with structure, consistency, and intentional detail.'
              className='text-2xl md:text-3xl lg:text-4xl font-medium leading-tight'
            />
            <ScrollRevealText
              text='I combine brand strategy with visual execution, turning positioning and research into complete identity systems that work across every touchpoint — clear, consistent, and built to last.'
              className='text-gray-400 text-base md:text-lg lg:text-xl'
            />

            <div className='mt-8 hidden lg:block'>
              <RollingLink
                href='/work'
                onMouseEnter={() => setCursorType('pointer')}
                onMouseLeave={() => setCursorType('default')}
                text='See Works'
                textClassName='font-bold tracking-tight'
                className='inline-block border-2 border-white rounded-full px-5 py-2 text-[16px] md:text-[23px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300'
              />
            </div>
          </div>

          {/* Right Column: Scrolling Works Grid */}
          <div className='w-full lg:w-7/12'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'>
              {/* Col 1 */}
              <div className='flex flex-col gap-12'>
                {leftColProjects.map((p, i) => (
                  <ProjectCard key={p.id} project={p} delay={i * 0.1} aspectClass='aspect-[4/5]' />
                ))}
              </div>
              {/* Col 2 (Staggered) */}
              <div className='flex flex-col gap-12 pt-0 md:pt-16'>
                {rightColProjects.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    delay={0.15 + i * 0.1}
                    aspectClass='aspect-[3/4]'
                  />
                ))}
              </div>
            </div>

            {/* Mobile View All Button */}
            <div className='mt-16 flex justify-center lg:hidden'>
              <RollingLink
                href='/work'
                onMouseEnter={() => setCursorType('pointer')}
                onMouseLeave={() => setCursorType('default')}
                text='See Works'
                textClassName='font-bold tracking-tight'
                className='inline-block border-2 border-white rounded-full px-5 py-2 text-[16px] md:text-[23px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
