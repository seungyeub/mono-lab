import { getAllProjects, getProjectBySlug } from '@/src/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

const components = {
  h1: (props: any) => <h1 className="text-3xl md:text-4xl font-medium mt-12 mb-6" {...props} />,
  h2: (props: any) => <h2 className="text-2xl md:text-3xl font-medium mt-10 mb-4 text-gray-200" {...props} />,
  p: (props: any) => <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-6" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside text-lg md:text-xl text-gray-400 mb-6 flex flex-col gap-2" {...props} />,
  li: (props: any) => <li className="" {...props} />,
};

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  let project;
  try {
    project = getProjectBySlug(params.slug);
  } catch (error) {
    return notFound();
  }

  const { meta, content } = project;

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a]">
      {/* Hero Image */}
      <section className="w-full h-[60vh] md:h-[80vh] relative">
        <div 
          className="w-full h-full bg-[#1a1a1a] bg-cover bg-center"
          style={{ backgroundImage: `url(${meta.image})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center opacity-30 text-white font-bold text-4xl tracking-widest">
            NO IMAGE YET
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 mb-16 border-b border-white/10 pb-12">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">{meta.title}</h1>
          <div className="text-sm text-gray-500 uppercase tracking-widest mt-4 flex gap-4">
            <span>{meta.category}</span>
            <span>—</span>
            <span>(0{meta.order})</span>
          </div>
        </div>

        <article className="max-w-none">
          <MDXRemote source={content} components={components} />
        </article>
      </section>
    </main>
  );
}
