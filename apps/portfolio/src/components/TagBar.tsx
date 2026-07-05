interface TagBarProps {
  /** 표시할 태그 문자열 배열 */
  tags: string[];
  /** 소형 화면에서 숨길 태그의 시작 인덱스 (기본값: 2) */
  hideFromIndex?: number;
  /** 추가 Tailwind 클래스 */
  className?: string;
}

/**
 * TagBar — 태그 목록을 가로로 균등 배치하는 바.
 * - hideFromIndex 이상의 태그는 sm 미만 화면에서 숨겨짐.
 * - 부모에서 bg 색상을 직접 지정하고 싶다면 className 으로 전달 가능.
 */
export default function TagBar({ tags, hideFromIndex = 2, className = '' }: TagBarProps) {
  return (
    <div className={`w-full border-y border-black/10 bg-white ${className}`.trim()}>
      <div className='site-container px-6 py-0.5 md:px-12'>
        <ul className='flex items-center justify-between'>
          {tags.map((tag, index) => (
            <li
              key={tag}
              className={`text-sm font-semibold whitespace-nowrap text-black sm:text-base ${
                index >= hideFromIndex ? 'hidden sm:block' : ''
              }`}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
