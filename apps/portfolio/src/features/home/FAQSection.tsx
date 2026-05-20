'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'What types of projects do you take on?',
    a: 'I work primarily on brand identity, logo design, and visual systems for startups, studios, and growing businesses. If you need a cohesive, strategic brand built from the ground up, we\'re a good fit.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Most brand identity projects take between 4 to 8 weeks depending on scope. A logo-only project can be done in 2 to 3 weeks. I\'ll give you a clear timeline during our initial conversation.',
  },
  {
    q: 'Do you work with international clients?',
    a: 'Yes — I work with clients globally. Time zones haven\'t been a barrier. Most communication happens asynchronously, which keeps things flexible for both sides.',
  },
  {
    q: 'What does your process look like?',
    a: 'Discovery → Strategy → Design → Refinement → Delivery. I start with understanding your brand deeply before touching any design tools. This ensures every visual decision has a reason behind it.',
  },
  {
    q: 'Do you offer ongoing brand support after delivery?',
    a: 'Yes. I offer retainer-based ongoing support for clients who need consistent brand application, new asset creation, or periodic brand audits.',
  },
  {
    q: 'How do I get started?',
    a: 'Send me a message through the contact page with a brief overview of your project, timeline, and budget. I\'ll get back to you within 1–2 business days.',
  },
];

function FAQItem({ faq, index }: { faq: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      className="border-b border-white/10"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center py-6 md:py-8 text-left gap-6 group"
      >
        <span className="text-base md:text-lg font-medium group-hover:text-white/70 transition-colors duration-200">
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-xl text-white/50 leading-none"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section className="w-full px-6 md:px-12 py-24 md:py-32 bg-[#0a0a0a]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 mb-16">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight flex-shrink-0">
          Clarifications©
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-sm">
          Answers to questions I get asked the most before starting a project together.
        </p>
      </div>

      <div className="border-t border-white/10">
        {FAQS.map((faq, i) => (
          <FAQItem key={i} faq={faq} index={i} />
        ))}
      </div>
    </section>
  );
}
