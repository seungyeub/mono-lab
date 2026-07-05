import ContactForm from '@/src/features/contact/ContactForm';

export const metadata = {
  title: 'Contact | Portfolio',
  description: 'Get in touch for brand identity, logo design, and visual strategy projects.',
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
            <a href='mailto:hello@example.com' className='transition-colors hover:text-white'>
              hello@example.com
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
              <a href='#' className='transition-colors hover:text-white'>
                Instagram
              </a>
              <a href='#' className='transition-colors hover:text-white'>
                LinkedIn
              </a>
              <a href='#' className='transition-colors hover:text-white'>
                Behance
              </a>
            </div>
          </div>
        </div>
      </div>

      <ContactForm />
    </main>
  );
}
