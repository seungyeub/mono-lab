'use client';

import SectionLabel from '@/components/SectionLabel';
import { reveal } from '@/lib/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { FAQS } from '@/data/faqData';
import type { FaqItem } from '@/data/faqData';

function FAQItem({ faq, index }: { faq: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div {...reveal('faqItem')} className='border-line-strong border-b'>
      <button
        type='button'
        id={`faq-question-${index}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`faq-answer-${index}`}
        className='group flex w-full cursor-pointer flex-row items-start gap-6 py-6 text-left md:py-8 xl:gap-[160px]'
      >
        {/* 번호 — xl에서만 표시 */}
        <span className='mt-1 hidden shrink-0 font-mono text-sm text-white xl:block'>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Q + A 컬럼 */}
        <div className='flex min-w-0 flex-1 flex-col'>
          <span className='text-base font-medium transition-colors duration-200 group-hover:text-white/70 md:text-lg'>
            {faq.q}
          </span>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key='answer'
                id={`faq-answer-${index}`}
                role='region'
                aria-labelledby={`faq-question-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className='overflow-hidden'
              >
                <p className='max-w-2xl pt-3 text-sm leading-relaxed text-gray-400 md:text-base lg:text-lg'>
                  {faq.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 아이콘 */}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className='mt-0.5 shrink-0 text-xl leading-none text-white'
        >
          +
        </motion.span>
      </button>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section
      data-testid='faq-section'
      className='pt-section xl:pt-section-lg flex w-full flex-col items-start gap-[60px] md:gap-[80px]'
    >
      <SectionLabel scene='05' leftLabel='© Help Center 도움말' rightLabel='Information' />

      <div className='site-container mt-12 w-full px-6 md:mt-24 md:px-12'>
        <div className='flex w-full flex-col items-start gap-16 md:gap-24'>
          {/* TOP — Title & Desc */}
          <div className='flex w-full flex-col gap-6 font-semibold md:gap-12'>
            <motion.div {...reveal('displayTitle')} className='w-full'>
              <h2 className='text-7xl font-semibold tracking-tight md:text-8xl lg:text-9xl'>
                FAQ.
              </h2>
            </motion.div>

            <h3 className='max-w-5xl text-base text-gray-400 md:text-lg'>
              작은 결정들이 모여 더 나은 서비스를 만듭니다. <br className='hidden lg:block' />
              개발 과정에서 중요하게 생각하는 기준과 원칙을 정리했습니다.
            </h3>
          </div>

          {/* BOTTOM — Accordion */}
          <div className='border-line-strong w-full border-t'>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
