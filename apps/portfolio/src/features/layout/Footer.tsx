'use client';

import { useCursorStore } from '@/src/store/useCursorStore';

export default function Footer() {
  const setCursorType = useCursorStore((state) => state.setType);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full px-6 md:px-12 py-24 md:py-32 bg-[#0a0a0a] border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 text-white relative">
      <div className="flex flex-col gap-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight">PORTFOLIO WRAP©</h2>
        
        <div className="flex flex-wrap gap-8 text-xs md:text-sm text-gray-400 uppercase tracking-widest">
          <span>Independent</span>
          <span>Brand Focus</span>
          <span>Strategic</span>
          <span>Detail-Driven</span>
        </div>

        <p className="text-xl md:text-2xl font-medium leading-relaxed">
          I build cohesive brand identities by combining strategic positioning with visual precision — helping startups and businesses show up clearly, consistently, and with intention.
        </p>
      </div>

      <div className="flex flex-col items-start md:items-end gap-12 mt-12 md:mt-0">
        <button
          onClick={scrollToTop}
          onMouseEnter={() => setCursorType('pointer')}
          onMouseLeave={() => setCursorType('default')}
          className="text-lg md:text-xl uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-2"
        >
          BACK TO TOP ↗
        </button>
      </div>
    </footer>
  );
}
