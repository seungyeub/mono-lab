'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useCursorStore } from '@/src/store/useCursorStore';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type FormData = z.infer<typeof schema>;

// EmailJS 설정값 — 발급 후 아래 값들을 채워넣으세요
// 1. https://www.emailjs.com/ 에서 무료 계정 생성
// 2. Email Services에서 서비스 연결 후 Service ID 복사
// 3. Email Templates에서 템플릿 생성 후 Template ID 복사
// 4. Account > API Keys에서 Public Key 복사
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';

export default function ContactForm() {
  const setCursorType = useCursorStore((s) => s.setType);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus('loading');

    // EmailJS 환경변수가 세팅되지 않은 경우 콘솔에만 로깅 (개발용 fallback)
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.log('--- Contact Form Submission (EmailJS keys not set) ---');
      console.log('Name:', data.name);
      console.log('Email:', data.email);
      console.log('Message:', data.message);
      console.log('------------------------------------------------------');
      setStatus('success');
      reset();
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus('success');
      reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
    }
  };

  const inputClass =
    'w-full bg-transparent border-b border-white/20 py-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors duration-300';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12 mt-16 max-w-2xl">
      {/* Name */}
      <div className="flex flex-col gap-2">
        <input
          {...register('name')}
          placeholder="Your Name"
          className={inputClass}
          onMouseEnter={() => setCursorType('pointer')}
          onMouseLeave={() => setCursorType('default')}
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <input
          {...register('email')}
          placeholder="Email Address"
          type="email"
          className={inputClass}
          onMouseEnter={() => setCursorType('pointer')}
          onMouseLeave={() => setCursorType('default')}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <textarea
          {...register('message')}
          placeholder="Your Message"
          rows={5}
          className={`${inputClass} resize-none`}
          onMouseEnter={() => setCursorType('pointer')}
          onMouseLeave={() => setCursorType('default')}
        />
        {errors.message && (
          <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-8">
        <button
          type="submit"
          disabled={status === 'loading'}
          onMouseEnter={() => setCursorType('pointer')}
          onMouseLeave={() => setCursorType('default')}
          className="text-lg md:text-xl uppercase tracking-widest border border-white/40 px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>

        <AnimatePresence>
          {status === 'success' && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-400 text-sm"
            >
              ✓ Message sent successfully!
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-sm"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
