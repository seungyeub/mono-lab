# Notes

> 자유롭게 기록하는 공간입니다.

---

## 2026-05-18

### MCP 환경 설정

Antigravity 1.0에서 TaskMaster MCP 서버 연결을 테스트했다. 당시 `mcp_config.json`에 설정은 추가했지만 실제 연결은 되지 않았다. 이후 Antigravity 2.0으로 전환하면서 MCP 설정도 새로 구성됨.

---

## 2026-05-19

### 프로젝트 전환 배경

기존 `portfolio` 프로젝트(`/100__Github_seungyeub/portfolio/`)는 이미 어느 정도 구현이 되어 있었지만 Helios 레퍼런스와 비교했을 때 구조적 차이가 컸다. 다크 테마 수정(`globals.css`), 스크롤 애니메이션 `once: true → false` 변경 등을 해봤지만, 인프라(모노레포, CI/CD)를 제대로 갖춘 새 프로젝트에서 시작하는 것이 낫다는 판단으로 `mono-lab`을 새로 시작했다.

---

## 2026-05-19

### frontend-foundation 템플릿

GitHub 레포: `https://github.com/seungyeub/frontend-foundation`

- Turborepo + pnpm workspaces + Next.js 14 + Tailwind CSS + ESLint/Prettier/TypeScript 완비
- MIT License, 커스텀 README.md 포함
- 향후 모든 사이드 프로젝트의 시작점으로 활용 예정
- GitHub Template repository 옵션 활성화 여부 재확인 필요

---

## 2026-06-09

### Helios 레퍼런스 비교 분석 문서

3D Interactive Card 작업 시 `docs/HELIOS_COMPARISON.md` 문서를 작성했다. 현재 포트폴리오와 Helios 레퍼런스의 상세 차이점이 304줄로 기록되어 있다. 향후 개선 참고용으로 보존.

---

## 2026-06-21

### Skills Section 레퍼런스 분석 인사이트

**Site A — Syahril Arfian Almazril (`syahrilarfianalmazril.my.id`)**

- 별도 `/skills` 페이지로 분리 (홈과 독립)
- 로봇 3D 아이콘 활용, 시각적으로 임팩트 강함
- 카드 그리드 + 인라인 칩 혼합 레이아웃
- 스크롤 기반 등장 애니메이션

**Site B — Mahesh P Pai (`maheshppai-v1.netlify.app`)**

- 홈 페이지 내 섹션으로 통합 (별도 페이지 없음)
- 프로젝트 카드 내 태그 형식 (컴팩트, 정보 밀도 높음)

→ 우리 포트폴리오는 홈 페이지 내 섹션으로 구성하되, 두 레이아웃(Grid / Chips)을 비교 구현 후 선택하는 방식으로 진행 중.

---

## 2026-06-21

### 커스텀 아이콘 교체 필요 사항

현재 `public/icons/` 의 커스텀 SVG 7개는 임시(placeholder) 수준이다. Phase 4 완료 후 실제 브랜드 가이드라인에 맞는 SVG로 교체 필요:

| 파일              | 출처                                  |
| ----------------- | ------------------------------------- |
| `aws.svg`         | AWS 공식 브랜드 가이드                |
| `mssql.svg`       | Microsoft SQL Server 공식 아이콘      |
| `playwright.svg`  | Playwright 공식 로고                  |
| `slack.svg`       | Slack 공식 브랜드 가이드              |
| `openai.svg`      | OpenAI 공식 로고                      |
| `zustand.svg`     | Zustand 커뮤니티 비공식 로고          |
| `antigravity.svg` | Antigravity IDE 로고 (직접 제작 필요) |

---

## 2026-06-22

### Sticky 레이아웃 이슈

PR #11, #12에서 전역 레이아웃과 CSS Sticky 포지션이 충돌하는 문제가 발생했다. CSS Sticky 전면 개편 시도 후, 컴포넌트 단위 VRT 아키텍처로 원복하여 해결했다. 관련 내용은 `docs/plan/pinned_scroll_layout_plan.md` 에 상세 기록됨.

---

## 2026-06-29

### Antigravity 1.0 → 2.0 마이그레이션

- 1.0 데이터 경로: `~/.gemini/antigravity-backup/`
- 2.0 데이터 경로: `~/.gemini/antigravity/`
- 1.0 세션 3개 보존됨:
  - `6df6edb5` (2026-05-18): MCP 연결 테스트
  - `809e1e29` (2026-05-19): 기존 portfolio 분석
  - `5f4ab2c3` (2026-05-19~20): 메인 세션, Phase 1~6 전체 (7.88MB)
- 마이그레이션 시점: 2026-05-20 오후 2시경

---

## 2026-06-29

### Skills Section Phase 4 결정 완료

확정된 항목:

- **레이아웃**: ~~Grid (카드 그리드)~~ → **Chips (인라인 태그)** 선택
- **색상 모드**: ~~Mono (흰색 단색)~~ / ~~Interactive (호버 시 칼러 활성화)~~ → **Brand (브랜드 칼러)** 선택
- 임시 비교 토글 UI 및 `SkillGrid` 컴포넌트 삭제 완료 (2026-06-23)

---

## 2026-07-12

### v0.1.4 UI 버그 픽스 트러블슈팅

- iOS에서 3D 캔버스 스크롤 충돌 방지: `touch-none` CSS 프로퍼티로 해결
- 시스템 커서 숨김 처리 및 Framer Motion `once: true` 반복 애니메이션 버그 차단
- 테스트 코드 전면 리팩토링: `Hello world` 등 더미 데이터 → 실제 기획 데이터 기반 명세서로 전환
- ESLint `eslint-disable` 불필요한 주석 일괄 제거

---

## 2026-07-20 — Footer GIF 캐러셀

### Footer GIF 캐러셀 구현 경험

- 외부 GIF를 `next/image` 대신 일반 `<img>` 태그로 로드하는 것이 적합 (Next.js 이미지 최적화 불필요)
- CLS 방지: `<img>`에 명시적 `width`/`height` 속성 필수
- `will-change-transform` GPU 가속 및 700s 무한 marquee 애니메이션 적용
- 81개 GIF 데이터를 `carouselGifs.ts`로 데이터 모듈 분리 — 컴포넌트 파일 크기 절감
- inline `style={{ fontSize }}` → Tailwind v4 arbitrary value 클래스(`text-[min(14vw,12rem)]`)로 전환

---

## 2026-07-20 — 커서 상태 체계 통일

### 커서 상태 체계 통일 및 타입 안전성 강화

- 커서 상태를 `'default' | 'view' | 'grab' | 'pointer'` 4개로 통일
- `useMotionValue` 도입으로 마우스 좌표 렌더링 최적화 (re-render 최소화)
- `SkillIcon.tsx`, `SkillChips.tsx` 등 `any` 타입 전량 제거 → `React.ComponentType` 기반 명시적 타입 선언
- `StoryAnimation.tsx` 신규 컴포넌트: SonarCloud 지적 사항(Math.random 사전 계산, 중첩 삼항 → 헬퍼 함수) 반영
- `FAQSection`: `<button>` 에 `type='button'` 명시적 추가 (폼 내부 의도치 않은 submit 방지)

---

## 2026-08-18 — ExperienceSection 리팩토링

### ExperienceSection 데이터 리팩토링 인사이트

- 속성명은 데이터의 의미를 정확히 반영해야 한다 — `stack`(기술 스택 연상) → `type`(직무 형태)이 적합
- 반복되는 Tailwind arbitrary value는 테마 토큰으로 추출해야 유지보수성이 높아진다 (CodeRabbit 리뷰에서 학습)
- `Junier` → `Junior` 오타 수정 — 데이터 입력 시 맞춤법 검증 없이 방치된 사례, 향후 데이터 검증 레이어 고려

---

## 2026-08-18 — Phase 5 PRD 준비

### Phase 5 PRD — Work Detail 레퍼런스(`3d-portfolio-ruby-nine.vercel.app`) 분석

Vite + React SPA(SSR 없음, Three.js/R3F + GSAP `ScrollTrigger`/`ScrollSmoother` 기반)라 정적 HTML에 콘텐츠가 없어, 프로덕션 JS 번들(`assets/index-*.js`)에서 UI 문자열을 직접 추출해 구조를 역산했다.

- 프로젝트 상세는 **Overview → Technology Stack → Impact & Results → 차별점** 4단 구조.
- **Live Demo + View Source Code** 이중 CTA를 항상 함께 노출(GitHub URL이 프로젝트별로 존재).
- 상세 페이지 하단에 **Next Project 순차 네비게이션** + Back to Portfolio.
- 우리 `ProjectMetadata`(`src/lib/mdx.ts`)에는 `techStack`/`github` 필드가 아예 없다는 것을 이 비교 과정에서 확인 — Phase 5 P1-1에서 스키마 확장 필요.

### Phase 5 PRD — 코드 감사 중 발견한 추가 사실

- `src/contents/work/meltdown.mdx` 등 MDX 4개는 Helios 템플릿 원본의 **가상 브랜드 디자인 에이전시 카피**를 그대로 사용 중("tier-1 investors" 등). 메타데이터만 "Frontend Engineer"로 바꿔도 Work 본문은 여전히 브랜드 디자이너 서사로 남는 구조적 문제 — GEO 관점에서 본문 재작성이 메타데이터 수정만큼 중요함.
- `public/icons/`의 `antigravity.svg`가 2.4MB, `zustand.svg`가 190KB로 확인됨 — 2026-06-21 노트에서 언급한 "7개 placeholder"보다 실제로는 `customIconPath` 사용처가 15개로 늘어나 있었고, 그중 일부는 용량 문제(비최적화 SVG)까지 겹쳐 있음.
- `WorksSection.tsx`의 `PROJECTS`(6개, 하드코딩)와 `getAllProjects()`가 읽는 MDX(4개)가 서로 다른 데이터 소스라는 것을 코드 대조로 확인 — id 5·6은 제목이 `'Animal & Birds'`로 동일하고 `href='#'`인 죽은 카드.
