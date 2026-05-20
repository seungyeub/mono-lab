export default function GalleryPage() {
  return (
    <main className="min-h-screen w-full px-6 md:px-12 pt-32 pb-24 bg-[#0a0a0a]">
      <div className="flex flex-col mb-16 gap-4 border-b border-white/10 pb-12">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight">Gallery©</h1>
        <p className="text-gray-400 max-w-xl text-lg mt-4">
          A visual collection of experiments, ongoing work, and random explorations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-12">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div 
            key={item}
            className="group overflow-hidden bg-[#1a1a1a] aspect-square relative"
          >
            <div className="w-full h-full flex items-center justify-center opacity-10 text-white font-bold text-xl tracking-widest border border-white/5">
              IMAGE {item}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
