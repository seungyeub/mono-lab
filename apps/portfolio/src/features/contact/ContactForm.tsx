'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendContactEmail, type ContactErrorCode } from '@/lib/actions';
import { contactSchema, type ContactFormData } from '@/lib/contactSchema';
import { CONTACT_PUBLIC_EMAIL } from '@/lib/siteConfig';
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
      setStatus('success');
      reset();
      return;
    }
    setErrorCode(result.error ?? 'failed');
    setStatus('error');
  };

  const inputClass =
    'w-full bg-transparent border-b border-line-strong py-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors duration-300';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='relative mt-16 flex max-w-2xl flex-col gap-12'
    >
      {/* Name */}
      <div className='flex flex-col gap-2'>
        <input
          {...register('name')}
          placeholder='Your Name'
          className={inputClass}
          onMouseEnter={() => setCursorType('pointer')}
          onMouseLeave={() => setCursorType('default')}
        />
        {errors.name && <p className='mt-1 text-sm text-red-400'>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className='flex flex-col gap-2'>
        <input
          {...register('email')}
          placeholder='Email Address'
          type='email'
          className={inputClass}
          onMouseEnter={() => setCursorType('pointer')}
          onMouseLeave={() => setCursorType('default')}
        />
        {errors.email && <p className='mt-1 text-sm text-red-400'>{errors.email.message}</p>}
      </div>

      {/* Message */}
      <div className='flex flex-col gap-2'>
        <textarea
          {...register('message')}
          placeholder='Your Message'
          rows={5}
          className={`${inputClass} resize-none`}
          onMouseEnter={() => setCursorType('pointer')}
          onMouseLeave={() => setCursorType('default')}
        />
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
      <div className='flex items-center gap-8'>
        <button
          type='submit'
          disabled={status === 'loading'}
          onMouseEnter={() => setCursorType('pointer')}
          onMouseLeave={() => setCursorType('default')}
          className='border border-white/40 px-8 py-4 text-lg tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50'
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>

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
