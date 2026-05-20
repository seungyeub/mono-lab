'use client';

import { motion } from 'framer-motion';
import { useCursorStore } from '@/src/store/useCursorStore';
import Link from 'next/link';

const PROJECTS = [
  {
    id: 1,
    title: 'Rootwise Architects',
    category: 'Visual Identity',
    image: '/images/projects/01.jpg',
    href: '/work/rootwise',
  },
  {
    id: 2,
    title: 'Meltdown Studios',
    category: 'Visual Identity',
    image: '/images/projects/02.jpg',
    href: '/work/meltdown',
  },
  {
    id: 3,
    title: 'Meridiem',
    category: 'Brand Identity',
    image: '/images/projects/03.jpg',
    href: '/work/meridiem',
  },
  {
    id: 4,
    title: 'Nutree Bakery',
    category: 'Identity Design',
    image: '/images/projects/04.jpg',
    href: '/work/nutree',
  },
];

export default function FeaturedWorks() {
  const setCursorType = useCursorStore((state) => state.setType);

  return (
    <section className="w-full px-6 md:px-12 py-24 md:py-32 bg-[#0a0a0a]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight">Featured Works©</h2>
        <p className="max-w-md text-sm md:text-base text-gray-400">
          Every project is a chance to shape a brand from ground up, turning strategy and vision into cohesive visual identities — built with intent, precision, and the kind of detail that makes a brand feel considered and complete.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {PROJECTS.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col gap-4 ${index % 2 === 1 ? 'md:mt-24' : ''}`}
          >
            <Link 
              href={project.href}
              className="group overflow-hidden bg-[#1a1a1a] aspect-[4/5] md:aspect-[3/4] relative block"
              onMouseEnter={() => setCursorType('view')}
              onMouseLeave={() => setCursorType('default')}
            >
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                style={{ backgroundImage: `url(${project.image})` }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-10 text-white font-bold text-2xl tracking-widest break-all">
                  NO IMAGE YET
                </div>
              </div>
            </Link>
            
            <div className="flex justify-between items-end mt-2">
              <h3 className="text-xl font-medium">{project.title}</h3>
              <div className="text-sm text-gray-500 flex flex-col items-end">
                <span>(0{project.id})</span>
                <span>{project.category}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
