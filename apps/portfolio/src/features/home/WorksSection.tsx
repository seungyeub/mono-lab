'use client';

import RollingLink from '@/components/RollingText/RollingLink';
import { reveal } from '@/lib/motion';
import SectionLabel from '@/components/SectionLabel';
import type { ProjectCard } from '@/lib/mdx';
import { useCursorStore } from '@/store/useCursorStore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CardProps {
  project: ProjectCard;
  delay?: number;
  aspectClass?: string;
}

function ProjectCard({ project, delay = 0, aspectClass = 'aspect-[16/10]' }: CardProps) {
  const setCursorType = useCursorStore((s) => s.setType);

  return (
    <motion.div {...reveal('worksCard', delay)} className='flex flex-col gap-3'>
      <Link
        href={project.href}
        onMouseEnter={() => setCursorType('view')}
        onMouseLeave={() => setCursorType('default')}
        // 링크 안이 이미지·장식뿐일 때 스크린리더가 목적을 읽을 수 있게 이름을 준다
        aria-label={project.title}
        className={`group bg-surface-raised relative block overflow-hidden ${aspectClass}`}
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
            <span className='text-center text-sm tracking-widest text-white/50 uppercase transition-colors duration-300 group-hover:text-white/70'>
              {project.title}
            </span>
          </div>
        )}
      </Link>
      <div className='flex items-start justify-between'>
        <span className='text-sm font-medium md:text-base'>{project.title}</span>
        <div className='flex flex-col items-end text-right text-xs text-white/50'>
          <span>({String(project.order).padStart(2, '0')})</span>
          <span>{project.category}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorksSection({ projects }: { projects: ProjectCard[] }) {
  const setCursorType = useCursorStore((s) => s.setType);

  /**
   * 카드 시차는 같은 행에 두 장이 나란히 있을 때만 의미가 있다. 1열 구간에서 홀수
   * 카드에 지연이 붙으면 위아래 카드가 서로 다른 속도로 뜨는 것처럼 보인다.
   * 이 그리드는 `md`와 `xl`에서만 2열이다(`lg`는 좌측 텍스트와 나란히 놓느라 1열).
   * 초기값 false는 SSR(모바일 우선)과 맞춰 hydration 불일치를 피한다.
   */
  const [isTwoColumn, setIsTwoColumn] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      '(min-width: 768px) and (max-width: 1023px), (min-width: 1280px)',
    );
    const sync = () => setIsTwoColumn(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <section data-testid='works-section' className='relative flex w-full flex-col pt-16'>
      <SectionLabel
        scene='02'
        leftLabel='© Featured Projects 프로젝트'
        rightLabel='Selected Projects'
      />

      {/* 메인 콘텐츠 영역 */}
      <div className='site-container w-full px-6 pt-[60px] md:px-12'>
        {/* Left/Right 부모는 기본 stretch(items-start 제거)로 두어 좌측 영역이 우측 끝까지 늘어나게 함 */}
        <div className='relative flex w-full flex-col gap-12 lg:flex-row lg:gap-24'>
          {/*
            Left Column: 데스크톱에서 화면 전체 높이(h-screen)를 차지하며 top-0에 Sticky.

            1024~1279px에서만 좌우를 6:6으로 나눈다. 이 구간의 대제목("Projects." 128px, 478px)이
            5/12 열(1024px에서 387px)을 91px 벗어나 오른쪽 카드 쪽으로 밀고 들어갔다.
            글자 크기를 낮추는 대신 열 비율을 조정한 이유는, 브레이크포인트마다 대제목 크기가
            달라지면 같은 섹션이 화면 폭에 따라 다른 인상을 주기 때문이다.
            6:6이면 좌측 열의 오른쪽 끝이 곧 중앙선이라, 설명 문단에 max-width를 따로 걸지 않아도
            중앙을 넘지 않는다. xl(1280px) 이상은 기존 5:7 그대로다.
          */}
          <div className='w-full lg:w-6/12 xl:w-5/12'>
            <div className='z-10 flex flex-col justify-center gap-10 py-10 lg:sticky lg:top-0 lg:h-screen lg:gap-12 lg:py-0'>
              <motion.div {...reveal('displayTitle')} className='w-full font-semibold'>
                {/* 페이지의 h1은 Hero의 자기소개 한 문장이다. 섹션 제목은 h2로 둔다 —
                    시각 크기는 클래스로 유지하므로 화면은 그대로다 (P2-5) */}
                <h2 className='text-7xl tracking-tight md:text-8xl lg:text-9xl'>Projects.</h2>
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
                  href='/projects'
                  onMouseEnter={() => setCursorType('pointer')}
                  onMouseLeave={() => setCursorType('default')}
                  text='See All Projects'
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
          <div className='grid w-full grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 lg:w-6/12 lg:grid-cols-1 lg:gap-12 lg:pt-24 xl:w-7/12 xl:grid-cols-2 xl:gap-8'>
            {projects.map((p, i) => (
              <div key={p.slug} className={i % 2 === 1 ? 'md:pt-16 lg:pt-0 xl:pt-16' : undefined}>
                {/* 시차는 2열일 때 같은 행의 두 카드 사이에만 준다 — 순번 누적은 아래쪽
                    카드를 홀로 등장시키면서도 0.5초까지 기다리게 해 느리게 느껴졌다 */}
                <ProjectCard
                  project={p}
                  delay={isTwoColumn ? (i % 2) * 0.08 : 0}
                  aspectClass='aspect-[16/10]'
                />
              </div>
            ))}

            {/*
              1024px 미만에서는 좌측 컬럼의 버튼이 숨겨지므로 여기서 대신 노출한다.
              카드를 훑는 동안 계속 닿을 수 있도록 하단에 붙여 두고, 밝은 카드 위에
              겹쳐도 읽히도록 자체 배경과 blur를 준다.
            */}
            <div className='pointer-events-none sticky bottom-4 z-10 col-span-1 flex justify-center pt-16 pb-8 md:col-span-2 lg:hidden'>
              <div className='pointer-events-auto'>
                <RollingLink
                  href='/projects'
                  onMouseEnter={() => setCursorType('pointer')}
                  onMouseLeave={() => setCursorType('default')}
                  text='See All Projects'
                  textClassName='font-bold tracking-tight'
                  className='bg-surface/85 inline-block rounded-full border-2 border-white px-5 py-2 text-[16px] tracking-widest uppercase backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black md:text-[23px]'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
