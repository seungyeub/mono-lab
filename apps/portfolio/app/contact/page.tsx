import ContactForm from '@/src/features/contact/ContactForm';

export const metadata = {
  title: 'Contact | Portfolio',
  description: 'Get in touch for brand identity, logo design, and visual strategy projects.',
};

export default function ContactPage() {
  return (
    <main className='min-h-screen w-full px-6 md:px-12 pt-32 pb-24'>
      <div className='flex flex-col md:flex-row justify-between gap-16 border-b border-white/10 pb-16'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl md:text-6xl font-medium tracking-tight'>
            Let&apos;s Work
            <br />
            Together©
          </h1>
        </div>
        <div className='flex flex-col gap-8 md:max-w-xs text-gray-400 text-sm md:text-base justify-end'>
          <div>
            <p className='text-white font-medium mb-1 uppercase tracking-widest text-xs'>Email</p>
            <a href='mailto:hello@example.com' className='hover:text-white transition-colors'>
              hello@example.com
            </a>
          </div>
          <div>
            <p className='text-white font-medium mb-1 uppercase tracking-widest text-xs'>
              Based in
            </p>
            <p>Seoul, 한국</p>
          </div>
          <div>
            <p className='text-white font-medium mb-1 uppercase tracking-widest text-xs'>
              Networks
            </p>
            <div className='flex flex-col gap-1'>
              <a href='#' className='hover:text-white transition-colors'>
                Instagram
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                LinkedIn
              </a>
              <a href='#' className='hover:text-white transition-colors'>
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
