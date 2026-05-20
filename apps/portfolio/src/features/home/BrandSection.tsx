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

const MINI_MARQUEE = ['Brand Identity', 'Logo Design', 'Strategy', 'Visual Systems', 'Art Direction'];

export default function BrandSection() {
  const setCursorType = useCursorStore((s) => s.setType);

  return (
    <section className="w-full bg-[#0a0a0a]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">

        {/* LEFT — 대형 이미지 슬롯 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative w-full min-h-[50vw] md:min-h-full overflow-hidden bg-[#111]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/brand.jpg')" }}
          />
          {/* placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/10 text-xs uppercase tracking-widest">brand.jpg</span>
          </div>
        </motion.div>

        {/* RIGHT — 텍스트 + CTA + 클라이언트 그리드 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between px-8 md:px-12 py-12 md:py-16 gap-10"
        >
          {/* 헤드라인 */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1]">
            5+ years™ of brand identity work, sharp visual systems, and relentless attention to craft and detail.
          </h2>

          {/* CTA */}
          <Link
            href="/contact"
            onMouseEnter={() => setCursorType('pointer')}
            onMouseLeave={() => setCursorType('default')}
            className="self-start border border-white/50 rounded-full px-7 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            Contact
          </Link>

          {/* 미니 마르퀴 */}
          <div className="overflow-hidden border-y border-white/10 py-2">
            <div
              className="flex gap-8 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-white/40"
              style={{ animation: 'marquee-scroll 18s linear infinite' }}
            >
              {[...MINI_MARQUEE, ...MINI_MARQUEE].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-8">
                  {item} <span className="text-white/20">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* 클라이언트 로고 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CLIENTS.map((client) => (
              <div
                key={client.name}
                className="border border-white/10 px-4 py-3 flex flex-col gap-1 hover:border-white/30 transition-colors duration-300"
              >
                <span className="text-sm font-medium truncate">{client.name}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/30">{client.sub}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
