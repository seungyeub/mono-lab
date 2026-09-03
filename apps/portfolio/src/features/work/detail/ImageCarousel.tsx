'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCursorStore } from '@/src/store/useCursorStore';
import ImageLightbox from './ImageLightbox';

/**
 * 상세 페이지 이미지 캐러셀 — 3초 간격 자동 순환 + 하단 도트 네비게이션.
 * 이미지는 서버에서 실존 검증(filterExistingPublicImages)을 마친 경로만 받는다.
 * 이미지가 없으면 프로젝트 제목을 타이포 플레이스홀더로 보여준다(빈 박스 방지).
 *
 * 프레임은 목록(/work) 카드와 같은 규칙이다 — 비율 고정 + contain이라 캡쳐가
 * 세로든 와이드든 잘리지 않고, 남는 자리는 배경으로 둔다. 그만큼 작게 보이므로
 * 클릭하면 라이트박스로 크게 볼 수 있다.
 */
export default function ImageCarousel({
  images,
  fallbackLabel,
  aspectClass = 'aspect-[16/10]',
}: {
  images: string[];
  fallbackLabel: string;
  aspectClass?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  /**
   * 정지 상태는 둘로 나뉜다.
   * - isPlaying: 사용자가 토글로 끈 명시적 정지. 끄면 다시 켤 때까지 유지된다
   * - isHovered: 가리키는 동안만의 임시 정지. 벗어나면 원래 상태로 돌아간다
   * 하나로 합치면 도트로 멈춰도 포인터가 벗어나는 순간 다시 돌기 시작한다.
   */
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const setCursorType = useCursorStore((s) => s.setType);
  const hasCarousel = images.length > 1;
  const hasImages = images.length > 0;

  useEffect(() => {
    // 라이트박스가 열려 있거나 정지 상태면 타이머를 아예 만들지 않는다
    if (!hasCarousel || lightboxIndex !== null || !isPlaying || isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasCarousel, images.length, lightboxIndex, isPlaying, isHovered]);

  const openLightbox = () => {
    if (!hasImages) return;
    setCursorType('default');
    setLightboxIndex(current);
  };

  // 라이트박스가 뒤로가기 처리를 위해 열림 시점에 히스토리를 얹으므로,
  // onClose가 매 렌더 새로 만들어지면 항목이 쌓인다 — 참조를 고정한다
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <>
      {/* 움직임을 멈출 방법을 준다 — 가리키거나 키보드로 들어오면 순환을 세운다 */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsHovered(true)}
        onBlurCapture={() => setIsHovered(false)}
        className={`relative w-full overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] ${aspectClass}`}
      >
        {hasImages ? (
          <>
            {/* 이미지 전체가 클릭 대상 — 커서는 홈 카드와 같은 'view'(확대 + VIEW 라벨) */}
            <button
              type='button'
              onClick={openLightbox}
              onMouseEnter={() => setCursorType('view')}
              onMouseLeave={() => setCursorType('default')}
              aria-label={`${fallbackLabel} 이미지 크게 보기`}
              className='absolute inset-0 z-10 cursor-none'
            />
            {images.map((image, index) => (
              <div
                key={image}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === current ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={fallbackLabel} className='h-full w-full object-contain' />
              </div>
            ))}
          </>
        ) : (
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='px-6 text-center text-sm tracking-widest text-white/30 uppercase'>
              {fallbackLabel}
            </span>
          </div>
        )}

        {hasCarousel && (
          <div className='absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2'>
            {/* 움직임을 끄고 켤 수 있는 명시적 제어 — 끄면 벗어나도 유지된다 */}
            <button
              type='button'
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label={isPlaying ? '자동 넘김 정지' : '자동 넘김 재생'}
              className='mr-1 cursor-none text-[9px] leading-none text-white/50 transition-colors duration-200 hover:text-white'
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
            {images.map((image, index) => (
              <button
                key={image}
                type='button'
                aria-label={`${index + 1}번째 이미지 보기`}
                onClick={() => setCurrent(index)}
                className={`h-1.5 w-1.5 cursor-none rounded-full transition-all duration-300 ${
                  index === current ? 'scale-125 bg-white' : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <ImageLightbox
        images={images}
        index={lightboxIndex}
        label={fallbackLabel}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
