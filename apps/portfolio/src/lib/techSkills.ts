import {
  SiAntdesign,
  SiApachecordova,
  SiAxios,
  SiCodeigniter,
  SiFirebase,
  SiGooglemaps,
  SiI18next,
  SiJquery,
  SiMinio,
  SiPhp,
  SiPostgresql,
  SiSqlalchemy,
  SiStripe,
  SiSupabase,
  SiSwagger,
  SiVite,
  SiWebpack,
} from '@icons-pack/react-simple-icons';

import { SKILL_CATEGORIES, type SkillItem } from '@/src/features/home/skillsData';

/**
 * 상세 페이지 Technology Stack에서 홈 Skills와 동일한 칩(SkillChips)을 쓰기 위한 리졸버.
 * MDX의 자유 표기('Next.js 14 (Pages Router)', 'React 19' 등)를 skillsData의 정식 항목으로
 * 매핑해 아이콘·브랜드 컬러를 재사용한다. 표시 이름은 MDX 원문을 유지한다.
 */

/** skillsData(44종)에 없는 기술의 보강 아이콘 — simple-icons 팩에서 확인된 것만 등재 */
const EXTRA_SKILLS: SkillItem[] = [
  { name: 'PHP', icon: SiPhp, brandColor: '#777BB4' },
  { name: 'PostgreSQL', icon: SiPostgresql, brandColor: '#4169E1' },
  { name: 'SQLAlchemy', icon: SiSqlalchemy, brandColor: '#D71F00' },
  { name: 'Vite', icon: SiVite, brandColor: '#646CFF' },
  { name: 'jQuery', icon: SiJquery, brandColor: '#0769AD' },
  { name: 'Supabase', icon: SiSupabase, brandColor: '#3FCF8E' },
  { name: 'CodeIgniter', icon: SiCodeigniter, brandColor: '#EF4223' },
  { name: 'Cordova', icon: SiApachecordova, brandColor: '#E8E8E8' },
  { name: 'Swagger', icon: SiSwagger, brandColor: '#85EA2D' },
  { name: 'Ant Design', icon: SiAntdesign, brandColor: '#0170FE' },
  { name: 'webpack', icon: SiWebpack, brandColor: '#8DD6F9' },
  { name: 'axios', icon: SiAxios, brandColor: '#5A29E4' },
  { name: 'Google Maps', icon: SiGooglemaps, brandColor: '#4285F4' },
  { name: 'Firebase', icon: SiFirebase, brandColor: '#DD2C00' },
  { name: 'MinIO', icon: SiMinio, brandColor: '#C72E49' },
  { name: 'i18next', icon: SiI18next, brandColor: '#26A69A' },
  { name: 'Stripe', icon: SiStripe, brandColor: '#635BFF' },
];

/** 정규화된 표기 → 정식 항목 이름. 정규화(버전·괄호 제거)로 못 잡는 표기만 등재한다. */
const ALIASES: Record<string, string> = {
  react: 'React.js',
  'tanstack query': 'React Query',
  'sass/scss': 'SCSS / Sass',
  'docker-compose': 'Docker',
  yarn: 'yarn-berry',
  'django rest framework': 'Django',
  'jquery/ajax': 'jQuery',
  '@ant-design/plots': 'Ant Design',
  'react-stripe-elements': 'Stripe',
  'next-i18next': 'i18next',
  fcm: 'Firebase',
};

/** 버전 숫자·괄호 부가 설명을 걷어내 표기 변형을 흡수한다 */
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // (Pages Router), (MVC/Security) 등
    .replace(/\b\d+(\.\d+)*(\.x)?\b/g, '') // 14, 5.7, 2.x 등
    .replace(/\s+/g, ' ')
    .trim();
}

const CANONICAL = new Map<string, SkillItem>();
for (const category of SKILL_CATEGORIES) {
  for (const skill of category.skills) {
    CANONICAL.set(normalize(skill.name), skill);
  }
}
for (const skill of EXTRA_SKILLS) {
  // skillsData가 우선 — 같은 이름이 생기면 홈과 동일한 아이콘을 쓴다
  const key = normalize(skill.name);
  if (!CANONICAL.has(key)) CANONICAL.set(key, skill);
}

function resolveOne(techName: string): SkillItem {
  const normalized = normalize(techName);
  const canonicalName = ALIASES[normalized];
  const matched = canonicalName
    ? CANONICAL.get(normalize(canonicalName))
    : CANONICAL.get(normalized);

  if (matched) {
    // 표시 이름은 MDX 원문 유지, 아이콘·컬러만 정식 항목에서
    return { ...matched, name: techName };
  }

  // 매핑 실패 → SkillIcon의 글자 폴백으로 렌더링된다
  return { name: techName, icon: null, brandColor: '#9CA3AF' };
}

export function resolveTechSkills(techNames: string[]): SkillItem[] {
  return techNames.map(resolveOne);
}
