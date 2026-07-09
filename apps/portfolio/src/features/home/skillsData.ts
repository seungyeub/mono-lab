import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiSass,
  SiTailwindcss,
  SiFramer,
  SiThreedotjs,
  SiRedux,
  SiRecoil,
  SiReactquery,
  SiStorybook,
  SiReacthookform,
  SiOpenjdk,
  SiSpring,
  SiPython,
  SiDjango,
  SiFastapi,
  SiNodedotjs,
  SiMysql,
  SiVercel,
  SiNginx,
  SiDocker,
  SiLinux,
  SiGithubactions,
  SiTurborepo,
  SiFigma,
  SiGit,
  SiPnpm,
  SiYarn,
  SiJest,
  SiEslint,
  SiPrettier,
  SiSonar,
  SiCoderabbit,
  SiLighthouse,
  SiGoogleanalytics,
  SiAnthropic,
  SiCursor,
  SiGithubcopilot,
} from '@icons-pack/react-simple-icons';
import type { ComponentType } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface SkillItem {
  /** 표시 이름 */
  name: string;
  /** @icons-pack/react-simple-icons 컴포넌트 (없으면 null → 커스텀 SVG 사용) */
  icon: ComponentType<{ color?: string; size?: number }> | null;
  /** 브랜드 컬러 (hex). 다크 테마에서 안 보이는 경우 밝은 대체 컬러 사용 */
  brandColor: string;
  /** 커스텀 SVG 파일 경로 (icon이 null일 때 사용) */
  customIconPath?: string;
}

export interface SkillCategory {
  /** 카테고리 제목 (TagBar에도 사용) */
  title: string;
  /** 카테고리에 속한 기술 목록 */
  skills: SkillItem[];
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

export const SKILL_CATEGORIES: SkillCategory[] = [
  // ── Frontend (14개) ──
  {
    title: 'Frontend',
    skills: [
      { name: 'TypeScript', icon: SiTypescript, brandColor: '#3178C6' },
      { name: 'JavaScript', icon: SiJavascript, brandColor: '#F7DF1E' },
      { name: 'React.js', icon: SiReact, brandColor: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, brandColor: '#FFFFFF' },
      {
        name: 'Zustand',
        icon: null,
        brandColor: '#453F39',
        customIconPath: '/icons/zustand.svg',
      },
      { name: 'React Query', icon: SiReactquery, brandColor: '#FF4154' },
      { name: 'Redux', icon: SiRedux, brandColor: '#764ABC' },
      { name: 'Recoil', icon: SiRecoil, brandColor: '#3578E5' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, brandColor: '#06B6D4' },
      { name: 'SCSS / Sass', icon: SiSass, brandColor: '#CC6699' },
      { name: 'Framer Motion', icon: SiFramer, brandColor: '#0055FF' },
      { name: 'Three.js', icon: SiThreedotjs, brandColor: '#FFFFFF' },
      { name: 'Storybook', icon: SiStorybook, brandColor: '#FF4785' },
      { name: 'React Hook Form', icon: SiReacthookform, brandColor: '#EC5990' },
    ],
  },

  // ── Backend & DB (8개) ──
  {
    title: 'Backend & DB',
    skills: [
      { name: 'Java', icon: SiOpenjdk, brandColor: '#437291' },
      { name: 'Spring', icon: SiSpring, brandColor: '#6DB33F' },
      { name: 'Node.js', icon: SiNodedotjs, brandColor: '#5FA04E' },
      { name: 'Python', icon: SiPython, brandColor: '#3776AB' },
      { name: 'Django', icon: SiDjango, brandColor: '#FFFFFF' },
      { name: 'FastAPI', icon: SiFastapi, brandColor: '#009688' },
      { name: 'MySQL', icon: SiMysql, brandColor: '#4479A1' },
      {
        name: 'MSSQL',
        icon: null,
        brandColor: '#CC2927',
        customIconPath: '/icons/mssql.svg',
      },
    ],
  },

  // ── DevOps & Infra (6개) ──
  {
    title: 'DevOps & Infra',
    skills: [
      {
        name: 'AWS',
        icon: null,
        brandColor: '#FF9900',
        customIconPath: '/icons/aws.svg',
      },
      { name: 'Docker', icon: SiDocker, brandColor: '#2496ED' },
      { name: 'GitHub Actions', icon: SiGithubactions, brandColor: '#2088FF' },
      { name: 'Linux', icon: SiLinux, brandColor: '#FCC624' },
      { name: 'Nginx', icon: SiNginx, brandColor: '#009639' },
      { name: 'Vercel', icon: SiVercel, brandColor: '#FFFFFF' },
    ],
  },

  // ── Tooling & Config (13개) ──
  {
    title: 'Tooling & Config',
    skills: [
      { name: 'Git', icon: SiGit, brandColor: '#F05032' },
      { name: 'Turborepo', icon: SiTurborepo, brandColor: '#EF4444' },
      { name: 'pnpm', icon: SiPnpm, brandColor: '#F69220' },
      { name: 'yarn-berry', icon: SiYarn, brandColor: '#2C8EBB' },
      { name: 'Jest', icon: SiJest, brandColor: '#C21325' },
      {
        name: 'Playwright',
        icon: null,
        brandColor: '#2EAD33',
        customIconPath: '/icons/playwright.svg',
      },
      { name: 'ESLint', icon: SiEslint, brandColor: '#4B32C3' },
      { name: 'Prettier', icon: SiPrettier, brandColor: '#F7B93E' },
      { name: 'SonarCloud', icon: SiSonar, brandColor: '#FD3456' },
      { name: 'CodeRabbit', icon: SiCoderabbit, brandColor: '#FF6C37' },
      { name: 'Lighthouse', icon: SiLighthouse, brandColor: '#F44B21' },
      { name: 'Google Analytics', icon: SiGoogleanalytics, brandColor: '#E37400' },
      { name: 'Figma', icon: SiFigma, brandColor: '#F24E1E' },
    ],
  },

  // ── AI Tools (5개) ──
  {
    title: 'AI Tools',
    skills: [
      { name: 'Cursor', icon: SiCursor, brandColor: '#FFFFFF' },
      { name: 'GitHub Copilot', icon: SiGithubcopilot, brandColor: '#FFFFFF' },
      { name: 'Claude Code', icon: SiAnthropic, brandColor: '#FFFFFF' },
      {
        name: 'Codex',
        icon: null,
        brandColor: '#FFFFFF',
        customIconPath: '/icons/openai.svg',
      },
      {
        name: 'Antigravity',
        icon: null,
        brandColor: '#FFFFFF',
        customIconPath: '/icons/antigravity.svg',
      },
    ],
  },
];

/** TagBar에 표시할 카테고리 이름 배열 */
export const SKILL_TAGS = SKILL_CATEGORIES.map((c) => c.title);

/** 총 스킬 항목 수 */
export const TOTAL_SKILL_COUNT = SKILL_CATEGORIES.reduce((sum, cat) => sum + cat.skills.length, 0);
