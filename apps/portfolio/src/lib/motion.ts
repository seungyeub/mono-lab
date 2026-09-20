import type { MotionProps } from 'framer-motion';

/**
 * 스크롤 등장 효과의 단일 소스.
 *
 * 같은 효과를 파일마다 리터럴로 적어 두어 어느 값이 어디에 쓰이는지 한눈에 보이지
 * 않았고, 한 곳만 고치면 다른 곳과 어긋났다. 역할별 이름을 붙여 여기 모은다.
 *
 * 통합할 때는 `projectsCard`만 값을 바꿨다. 이후 목록 행·FAQ·Skills의 시작 지점은
 * 순번 지연을 없애면서 화면 안 100px로 옮겼고(2026-09-11), 목록 행·FAQ는 움직임이 약해
 * 180px·28px·0.8초로 키웠다(2026-09-17). 각 항목 주석에 이유가 있다.
 *
 * 값을 바꿀 때는 URL 파라미터로 후보를 갈아 끼워 실제 화면에서 비교한 뒤 정한다.
 * 숫자만 보고 맞춘 안(Skills까지 같이 키우기)이 화면에서는 어긋나 보인 적이 있다.
 */

/**
 * 사이트 공통 easing(easeOutExpo). CSS 전환은 globals.css의 `--ease-smooth`(`ease-smooth` 클래스)가
 * 같은 값이다. framer-motion은 CSS 변수를 ease로 받지 못해 숫자 배열을 따로 두므로, 바꿀 때는 두 곳을 같이 고친다.
 */
export const SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
   * 행이 스크롤로 한 줄씩 들어오므로 순번 지연 없이 화면 안쪽에서 시작한다.
   * 화면 밖 60px에서 시작하면 화면 맨 아래 띠에서 끝나 효과가 보이지 않았다(2026-09-11 비교).
   * 100px·16px·0.6초로는 움직임이 약해 180px·28px·0.8초로 키웠다(2026-09-17 비교).
   * 시작을 늦추는 것과 거리를 늘리는 것은 함께 가야 한다 — 거리만 늘리면 화면 아래에서 끝나고,
   * 시작만 늦추면 움직임이 여전히 작다. 창 844·800·900에서 14행 모두 완주를 확인했다.
   */
  listItem: { y: 28, duration: 0.8, margin: '-180px 0px' },

  /** 아코디언 한 칸 — FAQ. 값과 이유는 listItem과 같다 */
  faqItem: { y: 28, duration: 0.8, margin: '-180px 0px' },

  /**
   * 작은 항목 — Skills 분류 제목, 스킬 칩.
   * 분류는 한 줄씩 들어오므로 분류 순번 지연을 두지 않고 화면 안 100px에서 시작한다.
   * 한 줄에 함께 들어오는 칩끼리의 시차만 호출부(SkillChips)에서 상한을 두어 준다.
   * listItem을 키울 때 여기도 같이 키워 봤으나(0.7초) 오히려 어긋나 보여 되돌렸다(2026-09-17) —
   * 칩은 시차가 최대 0.24초 붙어서 한 덩어리가 0.74초로 이미 목록 한 행(0.8초)과 비슷하고,
   * 높이 30px짜리가 12px를 움직여 크기 대비로는 목록 행보다 크게 움직인다.
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
