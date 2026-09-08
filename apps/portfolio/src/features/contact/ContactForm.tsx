'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RollingButton from '@/components/RollingText/RollingButton';
import { sendContactEmail, type ContactErrorCode } from '@/lib/actions';
import { contactSchema, type ContactFormData } from '@/lib/contactSchema';
import { CONTACT_PUBLIC_EMAIL, GA_MEASUREMENT_ID } from '@/lib/siteConfig';
import { sendGAEvent } from '@next/third-parties/google';
import { useCursorStore } from '@/store/useCursorStore';

/** 발송이 안 될 때는 성공을 가장하지 않고 직접 보낼 수 있는 주소를 안내한다 */
function ErrorNotice({ code }: { code: ContactErrorCode }) {
  if (code === 'invalid') return <>Please check the form and try again.</>;
  return (
    <>
      Sending is unavailable right now. Email me directly at{' '}
      <a href={`mailto:${CONTACT_PUBLIC_EMAIL}`} className='underline hover:text-white'>
        {CONTACT_PUBLIC_EMAIL}
      </a>
      .
    </>
  );
}

export default function ContactForm() {
  const setCursorType = useCursorStore((s) => s.setType);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorCode, setErrorCode] = useState<ContactErrorCode>('failed');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    const result = await sendContactEmail(data);
    if (result.success) {
      // 방문 → 문의 전환을 센다. 이름·이메일 같은 입력값은 보내지 않는다
      if (GA_MEASUREMENT_ID) sendGAEvent('event', 'contact_submit', { form: 'contact' });
      setStatus('success');
      reset();
      return;
    }
    setErrorCode(result.error ?? 'failed');
    setStatus('error');
  };

  const inputClass =
    'w-full bg-transparent border-b border-line-strong py-3 text-lg text-white placeholder-white/25 focus:outline-none';
  // 연락처 열과 같은 효과 — 아래 선 위에 흰 선이 겹쳐 있다가 hover·focus 시 왼쪽에서 오른쪽으로 자란다
  const fieldClass = 'group/row relative flex flex-col gap-2';
  const underlineClass =
    'pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-white transition-[width] duration-500 ease-out group-hover/row:w-full group-focus-within/row:w-full';
  // 다른 페이지의 알약형 버튼(Hero CONTACT · Works SEE ALL WORKS · 상세 Visit Website)과 같은 스타일
  const buttonClass =
    'inline-block rounded-full border-2 border-white px-5 py-2 text-[16px] tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black md:text-[23px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white';
  // 입력란 위의 작은 대문자 라벨. placeholder만 있으면 입력을 시작한 순간 무엇을 적는 칸인지 사라진다
  const labelClass = 'text-label tracking-label font-medium text-white uppercase';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='relative flex flex-col gap-10'>
      <p className='-mb-4 font-semibold text-white'>Send a Message</p>
      {/* Name */}
      <div className={fieldClass}>
        <label htmlFor='contact-name' className={labelClass}>
          Name
        </label>
        <span className='relative block'>
          <input
            id='contact-name'
            {...register('name')}
            placeholder='Jane Doe'
            className={inputClass}
            onMouseEnter={() => setCursorType('pointer')}
            onMouseLeave={() => setCursorType('default')}
          />
          <span aria-hidden='true' className={underlineClass} />
        </span>
        {errors.name && <p className='mt-1 text-sm text-red-400'>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className={fieldClass}>
        <label htmlFor='contact-email' className={labelClass}>
          Email
        </label>
        <span className='relative block'>
          <input
            id='contact-email'
            {...register('email')}
            placeholder='jane@example.com'
            type='email'
            className={inputClass}
            onMouseEnter={() => setCursorType('pointer')}
            onMouseLeave={() => setCursorType('default')}
          />
          <span aria-hidden='true' className={underlineClass} />
        </span>
        {errors.email && <p className='mt-1 text-sm text-red-400'>{errors.email.message}</p>}
      </div>

      {/* Message */}
      <div className={fieldClass}>
        <label htmlFor='contact-message' className={labelClass}>
          Message
        </label>
        <span className='relative block'>
          <textarea
            id='contact-message'
            {...register('message')}
            placeholder='어떤 프로젝트나 포지션인지, 일정이 있다면 언제까지인지 알려 주세요.'
            rows={5}
            className={`${inputClass} resize-none`}
            onMouseEnter={() => setCursorType('pointer')}
            onMouseLeave={() => setCursorType('default')}
          />
          <span aria-hidden='true' className={underlineClass} />
        </span>
        {errors.message && <p className='mt-1 text-sm text-red-400'>{errors.message.message}</p>}
      </div>

      {/* 허니팟 — 화면 밖에 두고 탭 순서·자동완성·보조기기에서 모두 제외한다. 봇만 채운다 */}
      <div aria-hidden='true' className='absolute -left-[9999px] h-px w-px overflow-hidden'>
        <label htmlFor='contact-company'>Company</label>
        <input
          id='contact-company'
          type='text'
          tabIndex={-1}
          autoComplete='off'
          {...register('company')}
        />
      </div>

      {/* Submit Button */}
      <div className='mt-6 flex flex-col items-center gap-4'>
        <RollingButton
          type='submit'
          disabled={status === 'loading'}
          onMouseEnter={() => setCursorType('pointer')}
          onMouseLeave={() => setCursorType('default')}
          text={status === 'loading' ? 'Sending...' : 'Send Message'}
          textClassName='font-bold tracking-tight'
          className={buttonClass}
        />

        <AnimatePresence>
          {status === 'success' && (
            <motion.p
              key='success'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='text-sm text-green-400'
            >
              ✓ Message sent successfully!
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              key='error'
              role='alert'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='text-sm text-red-400'
            >
              <ErrorNotice code={errorCode} />
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
