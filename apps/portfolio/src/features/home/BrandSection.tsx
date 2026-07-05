'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCursorStore } from '@/src/store/useCursorStore';

const CLIENTS = [
  { name: 'Meltdown Studios', sub: 'Visual Identity' },
  { name: 'Rootwise', sub: 'Brand Identity' },
  { name: 'Meridiem', sub: 'Visual System' },
  { name: 'Nutree Bakery', sub: 'Identity Design' },
  { name: 'Animal & Birds', sub: 'Logo Design' },
  { name: 'Studio North', sub: 'Brand Strategy' },
];

const MINI_MARQUEE = [
  'Brand Identity',
  'Logo Design',
  'Strategy',
  'Visual Systems',
  'Art Direction',
];

export default function BrandSection() {
  const setCursorType = useCursorStore((s) => s.setType);

  return (
    <section className='w-full'>
      <div className='grid min-h-[80vh] grid-cols-1 md:grid-cols-2'>
        {/* LEFT — 대형 이미지 슬롯 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2 }}
          className='relative min-h-[50vw] w-full overflow-hidden bg-[#111] md:min-h-full'
        >
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{ backgroundImage: "url('/images/brand.jpg')" }}
          />
          {/* placeholder */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='text-xs tracking-widest text-white/10 uppercase'>brand.jpg</span>
          </div>
        </motion.div>

        {/* RIGHT — 텍스트 + CTA + 클라이언트 그리드 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className='flex flex-col justify-between gap-10 px-8 py-12 md:px-12 md:py-16'
        >
          {/* 헤드라인 */}
          <h2 className='text-3xl leading-[1.1] font-medium tracking-tight md:text-4xl lg:text-5xl'>
            5+ years™ of brand identity work, sharp visual systems, and relentless attention to
            craft and detail.
          </h2>

          {/* CTA */}
          <Link
            href='/contact'
            onMouseEnter={() => setCursorType('pointer')}
            onMouseLeave={() => setCursorType('default')}
            className='self-start rounded-full border border-white/50 px-7 py-3 text-sm tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black'
          >
            Contact
          </Link>

          {/* 미니 마르퀴 */}
          <div className='overflow-hidden border-y border-white/10 py-2'>
            <div
              className='flex gap-8 text-[10px] tracking-[0.2em] whitespace-nowrap text-white/40 uppercase'
              style={{ animation: 'marquee-scroll 18s linear infinite' }}
            >
              {[...MINI_MARQUEE, ...MINI_MARQUEE].map((item, i) => (
                <span key={i} className='inline-flex items-center gap-8'>
                  {item} <span className='text-white/20'>✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* 클라이언트 로고 그리드 */}
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
            {CLIENTS.map((client) => (
              <div
                key={client.name}
                className='flex flex-col gap-1 border border-white/10 px-4 py-3 transition-colors duration-300 hover:border-white/30'
              >
                <span className='truncate text-sm font-medium'>{client.name}</span>
                <span className='text-[10px] tracking-widest text-white/30 uppercase'>
                  {client.sub}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
