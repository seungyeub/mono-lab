'use client';

import { useState } from 'react';

const CAPABILITIES = [
  {
    id: '01',
    title: 'Brand Strategy',
    description:
      'Discovery, positioning, audience research, and competitive analysis. The strategic foundation before any design begins.',
  },
  {
    id: '02',
    title: 'Logo Design',
    description:
      'Marks, wordmarks, and logomark systems built to work at every scale and across every application.',
  },
  {
    id: '03',
    title: 'Brand Identity',
    description:
      'Complete visual systems. Typography, color, layout rules, and usage guidelines that keep everything consistent.',
  },
  {
    id: '04',
    title: 'Brand Guidelines',
    description:
      'The rulebook that ensures your brand shows up correctly everywhere. Documented, organized, and ready to hand off.',
  },
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className='w-full px-6 py-24 md:px-12 md:py-32'>
      <div className='mb-16 flex flex-col gap-4'>
        <h2 className='text-3xl font-medium tracking-tight md:text-5xl'>Capabilities©</h2>
        <div className='mt-4 flex flex-wrap gap-8 text-xs tracking-widest text-gray-400 uppercase md:text-sm'>
          <span>Precise</span>
          <span>Structured</span>
          <span>Focused</span>
          <span>Visual Language</span>
        </div>
      </div>

      <div className='flex flex-col border-t border-white/10 pt-12'>
        {CAPABILITIES.map((service, index) => {
          // 다른 항목이 hovered 중이면 이 항목을 dim 처리
          const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

          return (
            <div
              key={service.title}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                opacity: isDimmed ? 0.35 : 1,
                transition: 'opacity 0.25s ease',
              }}
              className='grid grid-cols-1 gap-4 border-b border-white/10 py-8 md:grid-cols-12 md:gap-8 md:py-12'
            >
              <div className='mt-1 font-mono text-sm text-gray-500 md:col-span-1'>{service.id}</div>
              <div className='md:col-span-4'>
                <h3 className='text-xl font-medium md:text-2xl'>{service.title}</h3>
              </div>
              <div className='md:col-span-7'>
                <p className='text-base text-gray-400 md:text-lg'>{service.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
