'use client';

import SectionLabel from '@/src/components/SectionLabel';
import { useCursorStore } from '@/src/store/useCursorStore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import RollingLink from '@/src/components/RollingText/RollingLink';

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
  {
    id: 6,
    title: 'Animal & Birds',
    category: 'Logo Design',
    image: '/images/projects/06.jpg',
    href: '/work/nutree',
    order: '06',
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
    <section data-testid='works-section' className='w-full relative flex flex-col pt-16'>
      <SectionLabel
        scene='02'
        leftLabel='© Featured Projects 프로젝트'
        rightLabel='Selected Works'
      />

      {/* 메인 콘텐츠 영역 */}
      <div className='site-container px-6 md:px-12 w-full pt-[60px]'>
        {/* Left/Right 부모는 기본 stretch(items-start 제거)로 두어 좌측 영역이 우측 끝까지 늘어나게 함 */}
        <div className='flex flex-col lg:flex-row gap-12 lg:gap-24 w-full relative'>
          {/* Left Column: 데스크톱에서 화면 전체 높이(h-screen)를 차지하며 top-0에 Sticky */}
          <div className='w-full lg:w-5/12'>
            <div className='lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center gap-10 lg:gap-12 z-10 py-10 lg:py-0'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-40px' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className='w-full font-semibold'
              >
                <h1 className='text-7xl md:text-8xl lg:text-9xl tracking-tight'>Works.</h1>
              </motion.div>
              <p className='text-gray-400 text-base md:text-lg'>
                모든 프로젝트는 추상적인 비전을 직관적이고 매끄러운 사용자 경험으로 구현해 내는
                과정입니다.
                <br />
                분명한 의도, 정교한 구현, 그리고 서비스의 완성도를 결정짓는 세심한 디테일을 바탕으로
                바닥부터 견고하게 서비스를 구축합니다.
              </p>
              {/* 모바일/태블릿(<1024px)에서는 하단 고정 버튼이 있으므로 숨김 처리 */}
              <div className='relative hidden lg:block'>
                <RollingLink
                  href='/work'
                  onMouseEnter={() => setCursorType('pointer')}
                  onMouseLeave={() => setCursorType('default')}
                  text='See All Works'
                  textClassName='font-bold tracking-tight'
                  className='inline-block border-2 border-white rounded-full px-5 py-2 text-[16px] md:text-[23px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300'
                />
              </div>
            </div>
          </div>

          {/* Right Column: 자연 스크롤. 시작 시 좌측 텍스트와 균형을 맞추기 위해 상단 여백 추가 */}
          <div className='w-full lg:w-7/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 lg:pt-[8vh]'>
            {/* Col 1 */}
            <div className='flex flex-col gap-12'>
              {leftColProjects.map((p, i) => (
                <ProjectCard key={p.id} project={p} delay={i * 0.1} aspectClass='aspect-[4/5]' />
              ))}
            </div>
            {/* Col 2 (Staggered) */}
            <div className='flex flex-col gap-12 pt-0 md:pt-16 lg:pt-0 xl:pt-16'>
              {rightColProjects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  delay={0.15 + i * 0.1}
                  aspectClass='aspect-[3/4]'
                />
              ))}
            </div>

            {/* 'See All Works' Button (모바일/태블릿 전용 하단 고정) */}
            <div className='col-span-1 md:col-span-2 lg:hidden flex justify-center pt-16 pb-8 sticky bottom-10 z-10 pointer-events-none'>
              <div className='pointer-events-auto'>
                <RollingLink
                  href='/work'
                  onMouseEnter={() => setCursorType('pointer')}
                  onMouseLeave={() => setCursorType('default')}
                  text='See All Works'
                  textClassName='font-bold tracking-tight'
                  className='inline-block bg-neutral-950/85 backdrop-blur-md border-2 border-white rounded-full px-5 py-2 text-[16px] md:text-[23px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
