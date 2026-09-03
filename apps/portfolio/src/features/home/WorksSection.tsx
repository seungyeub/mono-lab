'use client';

import RollingLink from '@/src/components/RollingText/RollingLink';
import SectionLabel from '@/src/components/SectionLabel';
import type { ProjectCard } from '@/src/lib/mdx';
import { useCursorStore } from '@/src/store/useCursorStore';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CardProps {
  project: ProjectCard;
  delay?: number;
  aspectClass?: string;
}

function ProjectCard({ project, delay = 0, aspectClass = 'aspect-[16/10]' }: CardProps) {
  const setCursorType = useCursorStore((s) => s.setType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className='flex flex-col gap-3'
    >
      <Link
        href={project.href}
        onMouseEnter={() => setCursorType('view')}
        onMouseLeave={() => setCursorType('default')}
        // 링크 안이 이미지·장식뿐일 때 스크린리더가 목적을 읽을 수 있게 이름을 준다
        aria-label={project.title}
        className={`group relative block overflow-hidden bg-[#1a1a1a] ${aspectClass}`}
      >
        {project.imageExists ? (
          <>
            {/* 캡쳐 비율이 프로젝트마다 달라(모바일 앱~와이드 웹) contain으로 잘림 없이 담는다 */}
            <div
              className='absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105'
              style={{ backgroundImage: `url(${project.image})` }}
            />
            <div className='absolute inset-0 flex items-center justify-center text-xs tracking-widest text-white uppercase opacity-10'>
              {project.title}
            </div>
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
        <span className='text-sm font-medium md:text-base'>{project.title}</span>
        <div className='flex flex-col items-end text-right text-xs text-white/40'>
          <span>({String(project.order).padStart(2, '0')})</span>
          <span>{project.category}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorksSection({ projects }: { projects: ProjectCard[] }) {
  const setCursorType = useCursorStore((s) => s.setType);

  return (
    <section data-testid='works-section' className='relative flex w-full flex-col pt-16'>
      <SectionLabel
        scene='02'
        leftLabel='© Featured Projects 프로젝트'
        rightLabel='Selected Works'
      />

      {/* 메인 콘텐츠 영역 */}
      <div className='site-container w-full px-6 pt-[60px] md:px-12'>
        {/* Left/Right 부모는 기본 stretch(items-start 제거)로 두어 좌측 영역이 우측 끝까지 늘어나게 함 */}
        <div className='relative flex w-full flex-col gap-12 lg:flex-row lg:gap-24'>
          {/* Left Column: 데스크톱에서 화면 전체 높이(h-screen)를 차지하며 top-0에 Sticky */}
          <div className='w-full lg:w-5/12'>
            <div className='z-10 flex flex-col justify-center gap-10 py-10 lg:sticky lg:top-0 lg:h-screen lg:gap-12 lg:py-0'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className='w-full font-semibold'
              >
                <h1 className='text-7xl tracking-tight md:text-8xl lg:text-9xl'>Works.</h1>
              </motion.div>
              <p className='text-base text-gray-400 md:text-lg'>
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
                  className='inline-block rounded-full border-2 border-white px-5 py-2 text-[16px] tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black md:text-[23px]'
                />
              </div>
            </div>
          </div>

          {/* Right Column: 자연 스크롤. 시작 시 좌측 텍스트와 균형을 맞추기 위해 상단 여백 추가 */}
          {/*
            좌/우 컬럼으로 배열을 나눠 렌더링하면 1열이 되는 모바일에서 두 컬럼이 세로로
            이어붙어 순서가 01 → 04 → 06 → 09 → 03 …으로 뒤섞인다. 순서대로 한 번만 깔고,
            2열이 되는 구간에서만 짝수 번째 카드를 내려 계단식 배치를 만든다.
          */}
          <div className='grid w-full grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 lg:w-7/12 lg:grid-cols-1 lg:gap-12 lg:pt-24 xl:grid-cols-2 xl:gap-8'>
            {projects.map((p, i) => (
              <div key={p.slug} className={i % 2 === 1 ? 'md:pt-16 lg:pt-0 xl:pt-16' : undefined}>
                <ProjectCard project={p} delay={i * 0.1} aspectClass='aspect-[16/10]' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
