'use client';

import { motion } from 'framer-motion';

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

export default function ProfileSection() {
  return (
    <section className="w-full px-6 md:px-12 py-24 md:py-32 bg-[#0a0a0a] border-t border-white/10">
      <div className="flex flex-col mb-32">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8">Personal Profile©</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
          <div>
            <h3 className="text-lg md:text-xl uppercase tracking-widest text-gray-400">Brand Designer</h3>
          </div>
          <div>
            <p className="text-xl md:text-3xl font-medium leading-relaxed">
              Building brand systems with strategic clarity and visual precision. Delivering cohesive identities with structure, consistency, and intentional detail.
            </p>
            <p className="mt-8 text-gray-400 text-lg md:text-xl">
              I combine brand strategy with visual execution, turning positioning and research into complete identity systems that work across every touchpoint — clear, consistent, and built to last.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8">Experience©</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
          <div>
            <h3 className="text-lg md:text-xl uppercase tracking-widest text-gray-400">Brand Craft</h3>
          </div>
          <div className="flex flex-col gap-8 md:gap-12">
            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={exp.company + index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid grid-cols-2 gap-4 border-b border-white/10 pb-8"
              >
                <div className="flex flex-col gap-1">
                  <h4 className="text-lg md:text-xl font-medium">{exp.company}</h4>
                  <span className="text-sm text-gray-500 font-mono">{exp.period}</span>
                </div>
                <div className="flex flex-col gap-1 text-right md:text-left">
                  <span className="text-gray-300 md:text-lg">{exp.role}</span>
                  <span className="text-sm text-gray-500">{exp.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
