export default function GalleryPage() {
  return (
    <main className='min-h-screen w-full px-6 pt-32 pb-24 md:px-12'>
      <div className='mb-16 flex flex-col gap-4 border-b border-white/10 pb-12'>
        <h1 className='text-4xl font-medium tracking-tight md:text-6xl'>Gallery©</h1>
        <p className='mt-4 max-w-xl text-lg text-gray-400'>
          A visual collection of experiments, ongoing work, and random explorations.
        </p>
      </div>

      <div className='mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3'>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className='group relative aspect-square overflow-hidden bg-[#1a1a1a]'>
            <div className='flex h-full w-full items-center justify-center border border-white/5 text-xl font-bold tracking-widest text-white opacity-10'>
              IMAGE {item}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
