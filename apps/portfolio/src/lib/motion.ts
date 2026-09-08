import type { MotionProps } from 'framer-motion';

/**
 * 스크롤 등장 효과의 단일 소스.
 *
 * 같은 효과를 파일마다 리터럴로 적어 두어 어느 값이 어디에 쓰이는지 한눈에 보이지
 * 않았고, 한 곳만 고치면 다른 곳과 어긋났다. 역할별 이름을 붙여 여기 모은다.
 *
 * **값은 기존 화면 그대로다.** 아래 `worksCard` 하나만 의도적으로 바꿨다 —
 * 나머지는 이전 수치를 그대로 옮겼으므로 통합만으로 속도가 달라지지 않는다.
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
  | 'worksCard'
  | 'gridCard'
  | 'displayTitle'
  | 'sectionTitle'
  | 'sectionLead'
  | 'listItem'
  | 'faqItem'
  | 'smallItem';

const VARIANTS: Record<RevealVariant, RevealSpec> = {
  /**
   * 홈 Works의 프로젝트 카드. **여기만 값을 바꿨다.**
   * 이전(`-80px` · 0.9초 · 순번×0.1초)에는 카드가 이미 보이는 상태에서 애니메이션이
   * 시작해 빈 상자가 노출됐고, 화면 진입부터 완전 표시까지 809ms(최대 966ms)가
   * 걸렸다(실측). 닿기 전에 시작하도록 바꿔 줄였다. 다만 너무 앞당기면 보이기 전에 끝나 효과가
   * 사라지므로, 움직임이 눈에 남는 선에서 멈췄다.
   */
  worksCard: { y: 40, duration: 0.9, margin: '80px 0px', ease: SMOOTH },

  /** `/work` 목록 카드 */
  gridCard: { y: 40, duration: 0.7, margin: '-80px', ease: SMOOTH },

  /** 화면을 가득 채우는 대제목 — Works., FAQ. */
  displayTitle: { y: 20, duration: 1.2, margin: '-40px', ease: SMOOTH },

  /** 섹션 제목 — Skills. */
  sectionTitle: { y: 24, duration: 0.8, margin: '-60px', ease: SMOOTH },

  /** 섹션 제목 아래 설명문 */
  sectionLead: { y: 16, duration: 0.7, margin: '-60px', ease: 'easeOut' },

  /** 목록 한 줄 — 경력·자격증 */
  listItem: { y: 16, duration: 0.6, margin: '60px 0px' },

  /** 아코디언 한 칸 — FAQ */
  faqItem: { y: 20, duration: 0.6, margin: '60px 0px' },

  /**
   * 작은 항목 — 분류 제목, 스킬 칩.
   * Skills는 칩이 45개라 순번 시차가 쌓여 마지막 칩이 0.84초를 기다렸고, `-40px`이라
   * 화면에 들어온 뒤에야 시작해 최대 1.36초 동안 빈 자리가 보였다(실측). 닿기 전에
   * 시작하도록 바꾸고, 시차 상한은 호출부(SkillChips)에서 건다.
   */
  smallItem: { y: 12, duration: 0.5, margin: '60px 0px', ease: 'easeOut' },
};

/**
 * `<motion.div {...reveal('listItem', index * 0.08)}>` 형태로 쓴다.
 * 여러 항목이 함께 등장할 때만 `delay`로 시차를 준다.
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
