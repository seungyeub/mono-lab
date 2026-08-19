import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src/contents');

export interface ProjectMetadata {
  title: string;
  category: string;
  order: number;
  image: string;
  liveUrl?: string;
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

export function filterExistingPublicImages(imagePaths: string[]): string[] {
  const publicDir = path.resolve(process.cwd(), 'public');
  return imagePaths.filter((imagePath) => {
    // public 디렉토리 밖으로 탈출하는 경로(../ 등)는 실존 여부와 무관하게 거부한다
    const assetPath = path.resolve(publicDir, imagePath.replace(/^[/\\]+/, ''));
    if (!assetPath.startsWith(`${publicDir}${path.sep}`)) return false;
    try {
      // 디렉토리 등 일반 파일이 아닌 경로는 이미지로 취급하지 않는다
      return fs.statSync(assetPath).isFile();
    } catch {
      return false;
    }
  });
}

export function getProjectSeoMetadata(slug: string): { title: string; description: string } | null {
  try {
    const { meta } = getProjectBySlug(slug);
    return {
      title: `${meta.title} | Seungyeub Baek`,
      description: `${meta.title} — ${meta.category} 프로젝트 상세입니다.`,
    };
  } catch {
    return null;
  }
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
