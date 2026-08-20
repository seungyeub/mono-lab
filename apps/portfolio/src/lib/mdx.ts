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

export function publicAssetExists(publicPath: string): boolean {
  const publicDir = path.resolve(process.cwd(), 'public');
  // public 디렉토리 밖으로 탈출하는 경로(../ 등)는 실존 여부와 무관하게 거부한다
  const assetPath = path.resolve(publicDir, publicPath.replace(/^[/\\]+/, ''));
  if (!assetPath.startsWith(`${publicDir}${path.sep}`)) return false;
  try {
    // 디렉토리 등 일반 파일이 아닌 경로는 에셋으로 취급하지 않는다
    return fs.statSync(assetPath).isFile();
  } catch {
    return false;
  }
}

export function filterExistingPublicImages(imagePaths: string[]): string[] {
  return imagePaths.filter(publicAssetExists);
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

export interface ProjectCard {
  slug: string;
  title: string;
  category: string;
  order: number;
  image: string;
  href: string;
}

/**
 * 홈 WorksSection 등 카드 목록에 필요한 최소 필드만 MDX에서 추려낸다.
 * 카드 데이터를 별도로 하드코딩하면 MDX와 어긋나므로(P0-6) 항상 이 함수를 거친다.
 * MDX 본문(content)은 카드 렌더링에 불필요하므로 제외해 클라이언트 전달량을 줄인다.
 */
export function getProjectCards(): ProjectCard[] {
  return getAllProjects().map(({ slug, meta }) => ({
    slug,
    title: meta.title,
    category: meta.category,
    order: meta.order,
    image: meta.image,
    href: `/work/${slug}`,
  }));
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
