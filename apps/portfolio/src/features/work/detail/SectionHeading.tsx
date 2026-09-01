/**
 * 상세 페이지 섹션 공통 헤더 — 레퍼런스의 중앙 정렬 구성을 우리 톤(백색 명도 위계)으로 옮긴 것.
 * eyebrow(작은 대문자 라벨) → 제목 → 부제 순.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className='mb-10 flex flex-col items-center gap-3 text-center md:mb-14'>
      {eyebrow && (
        <span className='inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase'>
          <span aria-hidden className='h-1 w-1 rounded-full bg-white/60' />
          {eyebrow}
        </span>
      )}
      <h2 className='text-2xl font-semibold tracking-tight md:text-4xl'>{title}</h2>
      {description && <p className='max-w-2xl text-sm text-gray-400 md:text-base'>{description}</p>}
    </div>
  );
}
