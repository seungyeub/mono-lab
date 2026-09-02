'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect } from 'react';

/**
 * 캐러셀 이미지를 화면 가득 크게 보는 모달.
 * 카드 안에서는 프레임 비율(16:10)에 맞춰 작게 보일 수밖에 없어서, 원본을 제대로 볼
 * 자리를 따로 둔다. ESC·배경 클릭으로 닫고, 여러 장이면 좌우 화살표로 넘긴다.
 */
export default function ImageLightbox({
  images,
  index,
  label,
  onClose,
  onIndexChange,
}: {
  images: string[];
  /** null이면 닫힌 상태 */
  index: number | null;
  label: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const isOpen = index !== null;

  const goPrev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    // 모달 뒤 페이지가 같이 스크롤되지 않게 잠근다
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role='dialog'
          aria-modal='true'
          aria-label={`${label} 확대 보기`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='fixed inset-0 z-[9998] flex items-center justify-center bg-black/95 p-4 md:p-10'
        >
          {/* 배경 클릭으로 닫기. 콘텐츠보다 뒤에 깔아 이미지 클릭은 닫히지 않게 한다 */}
          <button
            type='button'
            onClick={onClose}
            aria-label='닫기'
            tabIndex={-1}
            className='absolute inset-0 cursor-none'
          />

          <button
            type='button'
            onClick={onClose}
            aria-label='닫기'
            className='absolute top-4 right-4 z-20 rounded-full border border-white/20 px-4 py-2 text-xs tracking-widest text-white/60 uppercase transition-colors duration-200 hover:border-white/50 hover:text-white md:top-8 md:right-8'
          >
            Close (ESC)
          </button>

          <div className='relative z-10 flex max-h-full w-full max-w-6xl flex-col items-center gap-4'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index]}
              alt={label}
              className='max-h-[80vh] w-auto max-w-full object-contain'
            />

            {images.length > 1 && (
              <div className='flex items-center gap-5'>
                <button
                  type='button'
                  onClick={goPrev}
                  aria-label='이전 이미지'
                  className='text-2xl text-white/50 transition-colors duration-200 hover:text-white'
                >
                  ←
                </button>
                <span className='font-mono text-xs text-white/50 tabular-nums'>
                  {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </span>
                <button
                  type='button'
                  onClick={goNext}
                  aria-label='다음 이미지'
                  className='text-2xl text-white/50 transition-colors duration-200 hover:text-white'
                >
                  →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
