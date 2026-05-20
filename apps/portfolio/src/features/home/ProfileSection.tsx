'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const EXPERIENCES = [
  {
    company: 'Freelancer',
    period: '2021 - present',
    role: 'Logo & Brand Designer',
    location: 'Seoul, Korea',
  },
  {
    company: 'Taktical Digital',
    period: '2025-2026',
    role: 'Brand Designer',
    location: 'New York, USA',
  },
  {
    company: 'Meetzed',
    period: '2020 - 2022',
    role: 'Brand Designer',
    location: 'USA',
  },
  {
    company: 'Crease Design Works',
    period: '2025-2026',
    role: 'Brand Designer',
    location: 'Seoul, Korea',
  },
];

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
  scrollYProgress: any;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.12, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
    </motion.span>
  );
}

export default function ProfileSection() {
  return (
    <section className="w-full px-6 md:px-12 py-24 md:py-32">
      {/* Personal Profile */}
      <div className="flex flex-col mb-32">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8">Personal Profile©</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
          <div>
            <h3 className="text-lg md:text-xl uppercase tracking-widest text-gray-400">
              Brand Designer
            </h3>
          </div>
          <div className="flex flex-col gap-8">
            <ScrollRevealText
              text="Building brand systems with strategic clarity and visual precision. Delivering cohesive identities with structure, consistency, and intentional detail."
              className="text-xl md:text-3xl font-medium leading-relaxed"
            />
            <ScrollRevealText
              text="I combine brand strategy with visual execution, turning positioning and research into complete identity systems that work across every touchpoint — clear, consistent, and built to last."
              className="text-gray-400 text-lg md:text-xl"
            />
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="flex flex-col">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8">Experience©</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
          <div>
            <h3 className="text-lg md:text-xl uppercase tracking-widest text-gray-400">
              Brand Craft
            </h3>
          </div>
          <div className="flex flex-col gap-0">
            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={exp.company + index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="grid grid-cols-2 gap-4 border-b border-white/10 py-6 md:py-8"
              >
                <div className="flex flex-col gap-1">
                  <h4 className="text-base md:text-lg font-medium">{exp.company}</h4>
                  <span className="text-xs text-gray-500 font-mono">{exp.period}</span>
                </div>
                <div className="flex flex-col gap-1 text-right md:text-left">
                  <span className="text-gray-300 text-sm md:text-base">{exp.role}</span>
                  <span className="text-xs text-gray-500">{exp.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
