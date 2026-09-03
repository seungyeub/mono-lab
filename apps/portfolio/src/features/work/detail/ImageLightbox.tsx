'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';

/**
 * 캐러셀 이미지를 화면 가득 크게 보는 모달.
 * 카드 안에서는 프레임 비율(16:10)에 맞춰 작게 보일 수밖에 없어서, 원본을 제대로 볼
 * 자리를 따로 둔다. ESC·배경 클릭으로 닫고, 여러 장이면 좌우 화살표로 넘긴다.
 */
/** 이 거리 이상 끌면 다음/이전으로 넘긴다 */
const SWIPE_THRESHOLD = 80;

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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  /** 닫은 뒤 포커스를 돌려줄 자리 — 모달을 연 그 버튼 */
  const triggerRef = useRef<Element | null>(null);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  // 모달 뒤 페이지가 같이 스크롤되지 않게 잠근다
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
      if (event.key !== 'Tab') return;

      // aria-modal만으로는 Tab이 뒤 페이지로 새어 나간다 — 순환을 대화상자 안에 가둔다
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([tabindex="-1"]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, goPrev, goNext]);

  // 열 때 포커스를 대화상자로 옮기고, 닫을 때 열었던 자리로 되돌린다
  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    return () => {
      const trigger = triggerRef.current;
      if (trigger instanceof HTMLElement && document.contains(trigger)) trigger.focus();
    };
  }, [isOpen]);

  /**
   * 모달을 히스토리 항목으로 만들어, 뒤로가기가 페이지를 떠나는 대신 모달을 닫게 한다.
   * 이미지를 넘길 때마다 항목이 쌓이지 않도록 열림 여부에만 의존하는 별도 effect로 둔다.
   */
  useEffect(() => {
    if (!isOpen) return;

    // URL은 그대로 두고 항목만 하나 얹는다
    window.history.pushState({ lightbox: true }, '');

    let closedByBack = false;
    const handlePopState = () => {
      closedByBack = true;
      onClose();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // ESC·닫기 버튼으로 닫은 경우엔 우리가 얹은 항목이 남아 있으므로 걷어낸다
      if (!closedByBack) window.history.back();
    };
  }, [isOpen, onClose]);

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
          ref={dialogRef}
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
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            aria-label='닫기'
            // 이미지가 화면을 꽉 채우면 버튼이 밝은 화면 위에 얹혀 묻힌다 — 자체 배경을 준다
            className='absolute top-4 right-4 z-20 rounded-full border border-white/30 bg-black/70 px-4 py-2 text-xs tracking-widest text-white/80 uppercase backdrop-blur-sm transition-colors duration-200 hover:border-white/60 hover:bg-black/90 hover:text-white md:top-8 md:right-8'
          >
            Close (ESC)
          </button>

          <div className='relative z-10 flex max-h-full w-full max-w-6xl flex-col items-center gap-4'>
            {/* 좌우로 쓸어넘기기 — 터치와 마우스 드래그 모두 같은 제스처로 처리된다 */}
            <motion.img
              key={images[index]}
              src={images[index]}
              alt={label}
              draggable={false}
              drag={images.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                // 화면 폭과 무관하게 일정한 손맛이 나도록 이동 거리 기준으로 판단한다
                if (info.offset.x <= -SWIPE_THRESHOLD) goNext();
                else if (info.offset.x >= SWIPE_THRESHOLD) goPrev();
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className='max-h-[80vh] w-auto max-w-full touch-pan-y object-contain select-none'
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
