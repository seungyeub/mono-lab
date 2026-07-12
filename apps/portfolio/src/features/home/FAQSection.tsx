'use client';

import SectionLabel from '@/src/components/SectionLabel';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const FAQS = [
  {
    q: '주로 사용하는 기술 스택은 무엇인가요?',
    a: 'React, Next.js, TypeScript, Tailwind CSS를 중심으로 작업합니다. 프로젝트에 따라 Framer Motion, Zustand, React Query 등 다양한 최신 프론트엔드 도구들도 함께 사용합니다.',
  },
  {
    q: '인터페이스는 어떤 방식으로 개발하시나요?',
    a: '단순히 화면을 구현하는 것이 아니라, 사용자 경험과 프로젝트 목적을 먼저 이해한 뒤 개발을 진행합니다. 명확하고 직관적인 인터페이스를 만드는 것을 중요하게 생각합니다.',
  },
  {
    q: '성능이나 접근성도 고려하시나요?',
    a: '네. 성능 최적화, 시맨틱 마크업, 웹 접근성, 반응형 대응 등을 중요하게 생각하며 다양한 환경에서도 안정적으로 동작하는 UI를 지향합니다.',
  },
  {
    q: '프로젝트의 구조나 코드 품질 관리는 어떻게 하시나요?',
    a: '프로젝트 규모와 목적에 맞는 아키텍처를 깊이 고민합니다. TypeScript를 적극적으로 활용하여 타입 안정성을 확보하고, 재사용 가능한 로직은 독립적인 함수나 클래스로 분리해 유지보수와 확장이 용이한 코드를 작성하려 노력합니다.',
  },
  {
    q: '어떤 개발 환경을 선호하시나요?',
    a: '재사용성과 유지보수성을 고려한 구조를 선호하며, 컴포넌트 단위 설계와 일관된 UI 시스템 구축에 관심이 많습니다. 개발 경험뿐 아니라 사용자 경험까지 함께 고려하려고 합니다.',
  },
  {
    q: '코드 품질을 위해 중요하게 생각하는 부분은 무엇인가요?',
    a: '가독성과 유지보수성을 가장 중요하게 생각합니다. 일관된 네이밍과 컴포넌트 구조를 유지하려고 하며, 협업 시 다른 개발자가 이해하기 쉬운 코드를 작성하려고 노력합니다.',
  },
  // {
  //   q: '최근 관심 있게 공부하고 있는 분야가 있나요?',
  //   a: '인터랙션 구현, 렌더링 최적화, 접근성, 그리고 사용자 경험을 개선할 수 있는 프론트엔드 아키텍처에 관심을 가지고 꾸준히 학습하고 있습니다.',
  // },
  // {
  //   q: '팀 프로젝트나 협업 시 가장 중요하게 생각하는 부분은 무엇인가요?',
  //   a: '투명한 커뮤니케이션과 코드 리뷰를 통한 상호 성장을 중요하게 생각합니다. 기획자, 디자이너, 백엔드 개발자 등 다양한 직군과의 원활한 소통을 위해 기술적인 내용을 쉽게 설명하고, 논리적인 근거를 바탕으로 의견을 조율합니다.',
  // },
  // {
  //   q: '새로운 기술이나 지식은 어떻게 학습하시나요?',
  //   a: '공식 문서와 기술 블로그를 꼼꼼히 읽으며 동작 원리를 깊이 이해하는 것을 선호합니다. 단순히 사용법만 익히기보다는, 자료구조나 알고리즘 같은 컴퓨터 공학적 기초 지식을 바탕으로 원리를 파악해 새로운 환경에도 빠르게 적응하려 노력합니다.',
  // },
  // {
  //   q: '어떤 프론트엔드 개발자로 성장하고 싶으신가요?',
  //   a: '사용자에게는 매끄럽고 즐거운 경험을, 동료 개발자에게는 유지보수하기 좋고 예측 가능한 코드를 제공하는 개발자가 되고 싶습니다. 기술 자체에 매몰되기보다는 프로덕트의 가치를 높이는 데 기여하고 싶습니다.',
  // },
  // {
  //   q: '복잡한 문제나 버그를 만났을 때 어떻게 해결하나요?',
  //   a: '먼저 문제의 근본 원인을 파악하기 위해 단계별로 접근합니다. 표면적인 에러 메시지만 보지 않고 동작 원리와 데이터의 흐름을 추적하며, 자료구조나 알고리즘 등 기본기를 바탕으로 논리적으로 원인을 분석해 가장 효율적인 해결책을 찾는 과정을 즐깁니다.',
  // },
  // {
  //   q: '프로젝트의 구조나 코드 품질 관리는 어떻게 하시나요?',
  //   a: '프로젝트 규모와 목적에 맞는 아키텍처를 깊이 고민합니다. TypeScript를 적극적으로 활용하여 타입 안정성을 확보하고, 재사용 가능한 로직은 독립적인 함수나 클래스로 분리해 유지보수와 확장이 용이한 코드를 작성하려 노력합니다.',
  // },
  // {
  //   q: 'UI/UX를 구현할 때 특별히 신경 쓰는 대상이나 상황이 있나요?',
  //   a: '사용자의 연령대나 디지털 접근성에 따라 인터페이스가 어떻게 달라져야 하는지 깊이 고민합니다. 예를 들어, 시니어 세대나 디지털 기기에 익숙하지 않은 분들도 직관적으로 사용할 수 있도록 명확한 화면 설계와 동선을 구현하는 데 관심이 많습니다.',
  // },
  // {
  //   q: '프론트엔드 개발 과정에서 겪었던 가장 큰 성장은 무엇인가요?',
  //   a: '단순히 돌아가는 코드를 짜는 것을 넘어, "왜 이 기술을 사용해야 하는가?"에 대해 스스로 묻고 답할 수 있게 된 것입니다. 다양한 도구들의 장단점을 비교하고, 프로젝트의 상황에 가장 적합한 기술을 선택하는 논리적인 근거를 마련하는 과정에서 크게 성장했다고 느낍니다.',
  // },
  // {
  //   q: '왜 프론트엔드 개발자가 되기로 결심하셨나요?',
  //   a: '제가 작성한 코드가 시각적인 결과물로 즉각 나타나고, 사용자와 화면 너머로 직접 상호작용할 수 있다는 점에 큰 매력을 느꼈습니다. 기술을 통해 사람들에게 실질적인 편리함과 좋은 경험을 제공할 수 있다는 점이 제가 개발을 계속하는 가장 큰 원동력입니다.',
  // },
  // {
  //   q: '코드 품질을 위해 중요하게 생각하는 부분은 무엇인가요?',
  //   a: '가독성과 유지보수성을 가장 중요하게 생각합니다. 일관된 네이밍과 컴포넌트 구조를 유지하려고 하며, 협업 시 다른 개발자가 이해하기 쉬운 코드를 작성하려고 노력합니다.',
  // },
  // {
  //   q: '협업은 어떤 방식으로 진행하시나요?',
  //   a: 'Git 기반 브랜치 전략과 코드 리뷰 프로세스에 익숙하며, 팀 내 커뮤니케이션과 일관된 코드 스타일을 중요하게 생각합니다. 디자이너 및 백엔드 개발자와의 협업 경험도 가지고 있습니다.',
  // },
  // {
  //   q: '어떤 개발 환경을 선호하시나요?',
  //   a: '재사용성과 유지보수성을 고려한 구조를 선호하며, 컴포넌트 단위 설계와 일관된 UI 시스템 구축에 관심이 많습니다. 개발 경험뿐 아니라 사용자 경험까지 함께 고려하려고 합니다.',
  // },
  // {
  //   q: '최근 관심 있게 공부하고 있는 분야가 있나요?',
  //   a: '인터랙션 구현, 렌더링 최적화, 접근성, 그리고 사용자 경험을 개선할 수 있는 프론트엔드 아키텍처에 관심을 가지고 꾸준히 학습하고 있습니다.',
  // },
  // {
  //   q: '반응형 UI 개발 경험이 있나요?',
  //   a: '네. 다양한 디바이스 환경을 고려한 반응형 UI를 구현해왔으며, 모바일과 데스크톱 모두에서 자연스러운 사용자 경험을 제공하는 것을 중요하게 생각합니다.',
  // },

  // {
  //   q: '애니메이션이나 인터랙션 구현도 가능한가요?',
  //   a: 'Framer Motion 등을 활용해 자연스럽고 사용자 경험을 해치지 않는 인터랙션 구현에 관심이 많습니다. 단순한 효과보다 흐름과 사용성을 고려한 움직임을 지향합니다.',
  // },

  // {
  //   q: '새로운 기술은 어떻게 학습하시나요?',
  //   a: '공식 문서와 실제 프로젝트 적용을 중심으로 학습하는 편입니다. 단순히 기능을 익히는 것보다 왜 필요한지와 어떤 상황에서 적합한지를 함께 이해하려고 합니다.',
  // },

  // {
  //   q: '프로젝트를 진행할 때 가장 중요하게 생각하는 것은 무엇인가요?',
  //   a: '사용자 경험과 개발 구조의 균형을 중요하게 생각합니다. 보기 좋은 UI뿐 아니라 유지보수와 확장성을 고려한 구조를 함께 고민하며 개발합니다.',
  // },

  // {
  //   q: '디자인 구현에 대한 강점이 있나요?',
  //   a: '디자인 의도를 최대한 정확하게 구현하려고 노력하며, 간격·타이포그래피·애니메이션 같은 디테일에도 신경을 많이 쓰는 편입니다.',
  // },

  // {
  //   q: '어떤 개발자로 성장하고 싶나요?',
  //   a: '단순히 기능만 구현하는 개발자가 아니라, 사용자 경험과 제품 완성도까지 함께 고민할 수 있는 프론트엔드 개발자로 성장하는 것을 목표로 하고 있습니다.',
  // },

  // {
  //   q: '협업 과정에서 중요하게 생각하는 태도가 있나요?',
  //   a: '명확한 커뮤니케이션과 책임감을 중요하게 생각합니다. 의견을 적극적으로 공유하되, 팀의 방향성과 일관성을 함께 고려하려고 노력합니다.',
  // },
  // {
  //   q: 'What is your primary tech stack?',
  //   a: 'My core stack includes React, Next.js, TypeScript, and Tailwind CSS. Depending on the project requirements, I also actively utilize modern frontend tools like Framer Motion, Zustand, and React Query to build robust applications.',
  // },
  // {
  //   q: 'What is your approach to developing user interfaces?',
  //   a: 'I believe development is more than just translating designs into code. I prioritize understanding the core purpose of the product and the user experience first. I focus on building clear, intuitive interfaces while keeping component reusability in mind.',
  // },
  // {
  //   q: 'Do you consider performance and web accessibility?',
  //   a: 'Absolutely, I consider them essential. I strive to build UIs that perform stably across various environments by optimizing rendering and loading speeds, utilizing semantic HTML for accessibility, and ensuring fully responsive designs.',
  // },
  // {
  //   q: 'What do you value most when collaborating with a team?',
  //   a: 'I highly value transparent communication and mutual growth through code reviews. To ensure smooth collaboration with designers, PMs, and backend engineers, I make an effort to explain technical concepts clearly and base my decisions on logical reasoning.',
  // },
  // {
  //   q: 'How do you approach learning new technologies?',
  //   a: 'I prefer diving deep into official documentation to understand the underlying principles. Rather than just memorizing syntax, I try to connect new tools to fundamental computer science concepts like data structures and algorithms, which helps me adapt quickly and effectively.',
  // },
  // {
  //   q: 'What kind of developer do you strive to be?',
  //   a: 'I want to be a developer who delivers seamless, enjoyable experiences to users, and highly maintainable, predictable code to my peers. Ultimately, my goal is to leverage technology to enhance the product’s business value rather than just focusing on the tech itself.',
  // },
  // {
  //   q: 'How do you handle complex problems or bugs?',
  //   a: 'I take a step-by-step approach to identify the root cause. Rather than just looking at surface-level error messages, I trace the data flow and execution. I enjoy breaking down problems logically, often leaning on foundational computer science principles to find the most efficient and reliable solution.',
  // },
  // {
  //   q: 'How do you manage project structure and code quality?',
  //   a: 'I deeply consider the right architecture based on the project’s scale and goals. I heavily utilize TypeScript to ensure type safety, and I focus on writing highly maintainable and scalable code by separating reusable logic into independent functions or classes.',
  // },
  // {
  //   q: 'Are there specific users or situations you keep in mind when building UI/UX?',
  //   a: 'I think carefully about how interfaces should adapt based on the user’s demographic or digital literacy. For instance, I have a strong interest in designing clear, intuitive screens and user flows that are accessible even to seniors or those less familiar with technology.',
  // },
  // {
  //   q: 'What has been your biggest area of growth as a frontend developer?',
  //   a: 'Moving beyond just writing code that works, to actively asking "Why should I use this technology?". I feel I’ve grown the most by learning how to compare the pros and cons of various tools and building logical reasoning for choosing the right tech stack for a given situation.',
  // },
  // {
  //   q: 'Why did you decide to become a frontend developer?',
  //   a: 'I was drawn to the fact that my code immediately translates into visual results that users can directly interact with. The ability to provide real convenience and meaningful experiences to people through software is the biggest driving force behind my work.',
  // },
];

function FAQItem({ faq, index }: { faq: (typeof FAQS)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      className='border-b border-white/20'
    >
      <button
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
                <p className='max-w-2xl pt-3 text-sm leading-relaxed text-gray-400 md:text-base'>
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
      className='flex w-full flex-col items-start gap-[60px] pt-[140px] md:gap-[80px] xl:pt-[200px]'
    >
      <SectionLabel scene='05' leftLabel='© Help Center 도움말' rightLabel='Information' />

      <div className='site-container mt-12 w-full px-6 md:mt-24 md:px-12'>
        <div className='flex w-full flex-col items-start gap-16 md:gap-24'>
          {/* TOP — Title & Desc */}
          <div className='flex w-full flex-col gap-6 font-semibold md:gap-12'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className='w-full'
            >
              <h1 className='text-7xl font-semibold tracking-tight md:text-8xl lg:text-9xl'>
                FAQ.
              </h1>
            </motion.div>

            <h3 className='max-w-5xl text-base text-gray-400 md:text-lg'>
              작은 결정들이 모여 더 나은 서비스를 만듭니다. <br className='hidden lg:block' />
              개발 과정에서 중요하게 생각하는 기준과 원칙을 정리했습니다.
            </h3>
          </div>

          {/* BOTTOM — Accordion */}
          <div className='w-full border-t border-white/20'>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
