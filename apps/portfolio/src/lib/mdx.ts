import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src/contents');

/** 제목 + 설명 한 쌍으로 렌더링되는 항목 (Overview·Key Features 공용) */
export interface ProjectTextItem {
  title: string;
  description: string;
}

export interface ProjectImplementation {
  architecture?: string;
  highlights: string[];
  /** 터미널 카드에 세로로 쌓을 코드 조각들. frontmatter에는 문자열 하나만 써도 된다 */
  codeSnippet: string[];
  /** 코드가 무엇을 보여주는지 한 줄 설명 */
  codeCaption?: string;
  /** 코드의 출처·기여 경계를 코드 바로 위에 밝혀야 할 때 쓴다 (예: AI 페어 개발 표기) */
  codeNote?: string;
}

export interface ProjectDemonstration {
  title: string;
  images: string[];
  description?: string;
  outcome?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectImpact {
  metrics: ProjectMetric[];
  outcomes: string[];
}

export interface ProjectMetadata {
  title: string;
  category: string;
  order: number;
  image: string;
  /** Hero 아래 한 문단 요약 */
  summary?: string;
  /** 값이 있을 때만 CTA를 렌더링한다 (P0-3 계약) */
  liveUrl?: string;
  github?: string;
  /** Hero 캐러셀 이미지 — 없으면 image 1장을, 그것도 없으면 타이포 플레이스홀더를 쓴다 */
  carouselImages: string[];
  techStack: string[];
  overview: ProjectTextItem[];
  features: ProjectTextItem[];
  implementation: ProjectImplementation;
  demonstrations: ProjectDemonstration[];
  impact: ProjectImpact;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

/** 비어 있지 않은 문자열만 통과시킨다 — 빈 값이 UI에 렌더링되는 것을 막는다 */
function asText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function asTextList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(asText).filter((v): v is string => v !== undefined) : [];
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** title·description이 모두 있어야 카드로 렌더링할 수 있다 */
function toTextItems(value: unknown): ProjectTextItem[] {
  return asArray(value)
    .map((entry) => {
      const record = asRecord(entry);
      const title = asText(record.title);
      const description = asText(record.description);
      return title && description ? { title, description } : undefined;
    })
    .filter((item): item is ProjectTextItem => item !== undefined);
}

/**
 * frontmatter는 사람이 손으로 채우는 값이라 누락·오타가 생길 수 있다.
 * 컬렉션은 항상 배열/객체로 보정해 상세 페이지가 방어 코드 없이 .map·.length를 쓸 수 있게 하고,
 * UI가 렌더링할 수 없는 불완전한 항목은 제거한다.
 */
export function normalizeProjectMetadata(raw: unknown): ProjectMetadata {
  const data = asRecord(raw);
  const implementation = asRecord(data.implementation);
  const impact = asRecord(data.impact);

  return {
    title: asText(data.title) ?? '',
    category: asText(data.category) ?? '',
    order: typeof data.order === 'number' ? data.order : 0,
    image: asText(data.image) ?? '',
    summary: asText(data.summary),
    liveUrl: asText(data.liveUrl),
    github: asText(data.github),
    carouselImages: asTextList(data.carouselImages),
    techStack: asTextList(data.techStack),
    overview: toTextItems(data.overview),
    features: toTextItems(data.features),
    implementation: {
      ...(asText(implementation.architecture)
        ? { architecture: asText(implementation.architecture) }
        : {}),
      highlights: asTextList(implementation.highlights),
      // 블록 하나뿐이면 문자열로 쓰는 편이 frontmatter가 읽기 쉬워 둘 다 받는다
      codeSnippet: Array.isArray(implementation.codeSnippet)
        ? asTextList(implementation.codeSnippet)
        : asTextList([implementation.codeSnippet]),
      ...(asText(implementation.codeCaption)
        ? { codeCaption: asText(implementation.codeCaption) }
        : {}),
      ...(asText(implementation.codeNote) ? { codeNote: asText(implementation.codeNote) } : {}),
    },
    demonstrations: asArray(data.demonstrations)
      .map((entry) => {
        const record = asRecord(entry);
        const title = asText(record.title);
        if (!title) return undefined;

        const images = asTextList(record.images);
        const description = asText(record.description);
        const outcome = asText(record.outcome);

        return {
          title,
          images,
          ...(description ? { description } : {}),
          ...(outcome ? { outcome } : {}),
        };
      })
      .filter((item): item is ProjectDemonstration => item !== undefined),
    impact: {
      metrics: asArray(impact.metrics)
        .map((entry) => {
          const record = asRecord(entry);
          const label = asText(record.label);
          const value = asText(record.value);
          return label && value ? { label, value } : undefined;
        })
        .filter((item): item is ProjectMetric => item !== undefined),
      outcomes: asTextList(impact.outcomes),
    },
  };
}

export function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDir, 'work', `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    meta: normalizeProjectMetadata(data),
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
  /** image 파일이 실제로 public/에 있는지 — 없으면 카드가 제목 폴백을 보여준다 */
  imageExists: boolean;
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
    // image 경로는 frontmatter 원본 그대로 싣고(P0-6), 실존 여부만 별도로 알린다
    image: meta.image,
    imageExists: publicAssetExists(meta.image),
    href: `/work/${slug}`,
  }));
}

/**
 * 홈 WorksSection에 노출할 프로젝트 선택 목록.
 * 자동(최신순)이 아니라 **여기서 직접 슬러그를 골라** 큐레이션한다 — 배열 순서가 곧 노출 순서다.
 * 항목을 바꾸려면 slug를 교체하면 되고, 오타·삭제된 슬러그는 테스트가 잡아낸다.
 */
export const FEATURED_SLUGS = [
  'app-review-tracker',
  'yoga-editor',
  'kti',
  'letsorder',
  'pharmgenscience',
  'ppcwiz',
] as const;

/** FEATURED_SLUGS 순서 그대로 홈 노출용 카드를 돌려준다 */
export function getFeaturedProjectCards(): ProjectCard[] {
  const bySlug = new Map(getProjectCards().map((card) => [card.slug, card]));
  return FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (card): card is ProjectCard => card !== undefined,
  );
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
