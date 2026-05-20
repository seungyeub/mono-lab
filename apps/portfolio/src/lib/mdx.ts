import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src/contents');

export interface ProjectMetadata {
  title: string;
  category: string;
  order: number;
  image: string;
}

export function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDir, 'work', `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    meta: data as ProjectMetadata,
    content,
  };
}

export function getAllProjects() {
  const workDir = path.join(contentDir, 'work');
  if (!fs.existsSync(workDir)) return [];

  const files = fs.readdirSync(workDir);
  const projects = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => getProjectBySlug(file))
    .sort((a, b) => a.meta.order - b.meta.order);

  return projects;
}
