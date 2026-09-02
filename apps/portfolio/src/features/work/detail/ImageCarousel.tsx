'use client';

import { useEffect, useState } from 'react';

/**
 * 상세 페이지 이미지 캐러셀 — 3초 간격 자동 순환 + 하단 도트 네비게이션.
 * 이미지는 서버에서 실존 검증(filterExistingPublicImages)을 마친 경로만 받는다.
 * 이미지가 없으면 프로젝트 제목을 타이포 플레이스홀더로 보여준다(빈 박스 방지).
 */
export default function ImageCarousel({
  images,
  fallbackLabel,
  aspectClass = 'aspect-[16/10]',
  fit = 'contain',
}: {
  images: string[];
  fallbackLabel: string;
  aspectClass?: string;
  /** 캡쳐 원본 비율을 지키려면 contain — 잘림 없이 프레임 안에 담는다 */
  fit?: 'cover' | 'contain';
}) {
  const [current, setCurrent] = useState(0);
  const hasCarousel = images.length > 1;

  useEffect(() => {
    if (!hasCarousel) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasCarousel, images.length]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] ${aspectClass}`}
    >
      {images.length === 0 ? (
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='px-6 text-center text-sm tracking-widest text-white/30 uppercase'>
            {fallbackLabel}
          </span>
        </div>
      ) : (
        images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={fallbackLabel}
              className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
            />
          </div>
        ))
      )}

      {hasCarousel && (
        <div className='absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2'>
          {images.map((image, index) => (
            <button
              key={image}
              type='button'
              aria-label={`${index + 1}번째 이미지 보기`}
              onClick={() => setCurrent(index)}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                index === current ? 'scale-125 bg-white' : 'bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
