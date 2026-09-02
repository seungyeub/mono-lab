'use client';

import { useEffect, useState } from 'react';
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
  const setCursorType = useCursorStore((s) => s.setType);
  const hasCarousel = images.length > 1;
  const hasImages = images.length > 0;

  useEffect(() => {
    // 라이트박스가 열려 있는 동안에는 뒤에서 이미지가 바뀌지 않게 멈춘다
    if (!hasCarousel || lightboxIndex !== null) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasCarousel, images.length, lightboxIndex]);

  const openLightbox = () => {
    if (!hasImages) return;
    setCursorType('default');
    setLightboxIndex(current);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  return (
    <>
      <div
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
          <div className='absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2'>
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
