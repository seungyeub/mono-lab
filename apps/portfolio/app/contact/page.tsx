import ContactForm from '@/src/features/contact/ContactForm';

export const metadata = {
  title: 'Contact | Seungyeub Baek',
  description: '프론트엔드 개발 협업 및 채용 문의를 위해 백승엽에게 연락할 수 있는 페이지입니다.',
};

export default function ContactPage() {
  return (
    <main className='min-h-screen w-full px-6 pt-32 pb-24 md:px-12'>
      <div className='flex flex-col justify-between gap-16 border-b border-white/10 pb-16 md:flex-row'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl font-medium tracking-tight md:text-6xl'>
            Let&apos;s Work
            <br />
            Together©
          </h1>
        </div>
        <div className='flex flex-col justify-end gap-8 text-sm text-gray-400 md:max-w-xs md:text-base'>
          <div>
            <p className='mb-1 text-xs font-medium tracking-widest text-white uppercase'>Email</p>
            <a href='mailto:superior051@icloud.com' className='transition-colors hover:text-white'>
              superior051@icloud.com
            </a>
          </div>
          <div>
            <p className='mb-1 text-xs font-medium tracking-widest text-white uppercase'>
              Based in
            </p>
            <p>Seoul, 한국</p>
          </div>
          <div>
            <p className='mb-1 text-xs font-medium tracking-widest text-white uppercase'>
              Networks
            </p>
            <div className='flex flex-col gap-1'>
              <a
                href='https://github.com/seungyeub'
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors hover:text-white'
              >
                Github
              </a>
              <a
                href='https://pinterest.com/bseungyeub'
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors hover:text-white'
              >
                Pinterest
              </a>
              <a
                href='https://blog.naver.com/backsajang420'
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors hover:text-white'
              >
                Blog
              </a>
              <a
                href='https://www.linkedin.com/in/seungyeub-baek-23aa9016a/'
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors hover:text-white'
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <ContactForm />
    </main>
  );
}
