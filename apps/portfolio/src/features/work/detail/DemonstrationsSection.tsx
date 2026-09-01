import type { ProjectDemonstration } from '@/src/lib/mdx';
import ImageCarousel from './ImageCarousel';
import SectionHeading from './SectionHeading';

/**
 * Demonstrations — 데모마다 이미지 캐러셀 ↔ 설명을 2열로 배치하고, 홀수 번째는 좌우를
 * 뒤집어 리듬을 만든다(레퍼런스 구성). images는 서버에서 실존 검증을 마친 경로만 받는다.
 */
export default function DemonstrationsSection({
  demonstrations,
}: {
  demonstrations: (ProjectDemonstration & { existingImages: string[] })[];
}) {
  if (demonstrations.length === 0) return null;

  return (
    <section className='mt-20 md:mt-28'>
      <SectionHeading
        eyebrow='Feature Demonstrations'
        title='Demonstrations'
        description='실제 화면으로 보는 핵심 흐름'
      />
      <div className='flex flex-col gap-10 md:gap-14'>
        {demonstrations.map((demo, index) => (
          <div
            key={demo.title}
            className='grid items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors duration-500 hover:border-white/20 sm:p-6 md:p-8 lg:grid-cols-2 lg:gap-10'
          >
            <div className={index % 2 === 1 ? 'lg:order-2' : undefined}>
              <ImageCarousel
                images={demo.existingImages}
                fallbackLabel={demo.title}
                aspectClass='aspect-[4/3]'
              />
            </div>
            <div className={index % 2 === 1 ? 'lg:order-1' : undefined}>
              <h3 className='mb-3 text-xl font-semibold md:text-2xl'>{demo.title}</h3>
              {demo.description && (
                <p className='text-sm leading-relaxed whitespace-pre-line text-gray-400 md:text-base'>
                  {demo.description}
                </p>
              )}
              {demo.outcome && (
                <p className='mt-5 rounded-lg border-l-2 border-white/40 bg-white/5 p-4 text-sm text-white/80 md:text-base'>
                  {demo.outcome}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
