'use client';

/**
 * EditorialDivider — Helios 스타일 섹션 구분선.
 * 상단 1px 보더 위에 left / center / right 3열 메타텍스트를 배치합니다.
 *
 * 사용 예:
 *   <EditorialDivider left="© 2024" center="PORTFOLIO" right="Seoul, 한국" />
 */
interface EditorialDividerProps {
  left?: string;
  center?: string;
  right?: string;
  className?: string;
}

export default function EditorialDivider({
  left,
  center,
  right,
  className = '',
}: EditorialDividerProps) {
  return (
    <div className={`w-full border-t border-white/10 px-6 py-3 md:px-12 ${className}`}>
      <div className='grid grid-cols-3 text-[10px] tracking-[0.18em] text-white/30 uppercase'>
        <span>{left}</span>
        <span className='text-center'>{center}</span>
        <span className='text-right'>{right}</span>
      </div>
    </div>
  );
}
