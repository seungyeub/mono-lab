import type { MotionProps } from 'framer-motion';

/**
 * 스크롤 등장 효과의 단일 소스.
 *
 * 같은 효과를 파일마다 리터럴로 적어 두어 어느 값이 어디에 쓰이는지 한눈에 보이지
 * 않았고, 한 곳만 고치면 다른 곳과 어긋났다. 역할별 이름을 붙여 여기 모은다.
 *
 * 통합할 때는 `projectsCard`만 값을 바꿨다. 이후 목록 행·FAQ·Skills의 시작 지점은
 * 순번 지연을 없애면서 화면 안 100px로 옮겼다(2026-09-11, 각 항목 주석).
 */

const SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface RevealSpec {
  y: number;
  duration: number;
  /** 관측 여백. 음수는 요소가 화면 안으로 들어온 뒤 시작하고, 양수는 닿기 전에 시작한다 */
  margin: string;
  ease?: [number, number, number, number] | 'easeOut';
}

export type RevealVariant =
  | 'projectsCard'
  | 'gridCard'
  | 'displayTitle'
  | 'sectionTitle'
  | 'sectionLead'
  | 'listItem'
  | 'faqItem'
  | 'smallItem';

const VARIANTS: Record<RevealVariant, RevealSpec> = {
  /**
   * 홈 Projects 섹션의 카드. **여기만 값을 바꿨다.**
   * 이전(`-80px` · 0.9초 · 순번×0.1초)에는 카드가 이미 보이는 상태에서 애니메이션이
   * 시작해 빈 상자가 노출됐고, 화면 진입부터 완전 표시까지 809ms(최대 966ms)가
   * 걸렸다(실측). 닿기 전에 시작하도록 바꿔 줄였다. 다만 너무 앞당기면 보이기 전에 끝나 효과가
   * 사라지므로, 움직임이 눈에 남는 선에서 멈췄다.
   */
  projectsCard: { y: 40, duration: 1, margin: '0px', ease: SMOOTH },

  /** `/projects` 목록 카드 */
  gridCard: { y: 40, duration: 0.7, margin: '-80px', ease: SMOOTH },

  /** 화면을 가득 채우는 대제목 — Projects., FAQ. */
  displayTitle: { y: 20, duration: 1.2, margin: '-40px', ease: SMOOTH },

  /** 섹션 제목 — Skills. */
  sectionTitle: { y: 24, duration: 0.8, margin: '-60px', ease: SMOOTH },

  /** 섹션 제목 아래 설명문 */
  sectionLead: { y: 16, duration: 0.7, margin: '-60px', ease: 'easeOut' },

  /**
   * 목록 한 줄 — 경력·자격증.
   * 행이 스크롤로 한 줄씩 들어오므로 순번 지연 없이 화면 안 100px에서 시작한다.
   * 화면 밖 60px에서 시작하면 화면 맨 아래 띠에서 끝나 효과가 보이지 않았다(2026-09-11 비교).
   */
  listItem: { y: 16, duration: 0.6, margin: '-100px 0px' },

  /** 아코디언 한 칸 — FAQ. 시작 지점은 listItem과 같은 이유 */
  faqItem: { y: 20, duration: 0.6, margin: '-100px 0px' },

  /**
   * 작은 항목 — Skills 분류 제목, 스킬 칩.
   * 분류는 한 줄씩 들어오므로 분류 순번 지연을 두지 않고 listItem과 같이 화면 안 100px에서
   * 시작한다. 한 줄에 함께 들어오는 칩끼리의 시차만 호출부(SkillChips)에서 상한을 두어 준다.
   */
  smallItem: { y: 12, duration: 0.5, margin: '-100px 0px', ease: 'easeOut' },
};

/**
 * `<motion.div {...reveal('listItem')}>` 형태로 쓴다.
 * `delay`는 같은 행에 나란히 놓여 함께 들어오는 항목에만 준다. 스크롤로 한 줄씩 들어오는
 * 목록에 순번 지연을 주면 아래 행일수록 화면 안에서 빈칸으로 기다린다(경력 5행이 0.32초).
 */
export function reveal(variant: RevealVariant, delay = 0): MotionProps {
  const { y, duration, margin, ease } = VARIANTS[variant];
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin },
    transition: { duration, delay, ...(ease ? { ease } : {}) },
  };
}
