# Skills Section 구현 계획서 (v2)

> **v2 변경사항**: 사용자 피드백 반영 — 정적 "Skills." 헤딩, 아이콘 그리드 레이아웃, 5개 카테고리 확정, 두 가지 레이아웃 비교 구현

---

## 목차

1. [확정된 결정사항](#1-확정된-결정사항)
2. [레퍼런스 사이트 분석 요약](#2-레퍼런스-사이트-분석-요약)
3. [카테고리 구조 및 데이터](#3-카테고리-구조-및-데이터)
4. [아이콘 전략](#4-아이콘-전략)
5. [레이아웃 — 두 가지 비교 구현](#5-레이아웃--두-가지-비교-구현)
6. [아이콘 색상 — 세 가지 비교 구현](#6-아이콘-색상--세-가지-비교-구현)
7. [섹션 오프닝 구조](#7-섹션-오프닝-구조)
8. [애니메이션 전략](#8-애니메이션-전략)
9. [반응형 전략](#9-반응형-전략)
10. [컴포넌트 구조](#10-컴포넌트-구조)
11. [파일 구조](#11-파일-구조)
12. [구현 순서](#12-구현-순서)
13. [열린 질문](#13-열린-질문)

---

## 1. 확정된 결정사항

| 항목        | 결정                                                 | 근거                                             |
| ----------- | ---------------------------------------------------- | ------------------------------------------------ |
| 헤딩        | 정적 `<h1>Skills.</h1>` (WordRoller 미사용)          | WorksSection "Works."와 동일 패턴, 시각적 일관성 |
| 카테고리 수 | 5개                                                  | Frontend, Backend, Infrastructure, Tooling, AI   |
| 설명 텍스트 | 헤딩 아래 설명 문단 포함                             | WorksSection 패턴 준수                           |
| TagBar      | 사용                                                 | 5개 카테고리명 표시                              |
| 스킬 표현   | 아이콘 + 이름 (설명 없음, Option B)                  | 항목이 많아 compact한 표현 필요                  |
| 레이아웃    | **카드 그리드 + 인라인 칩 2가지 모두 구현**하여 비교 | 사용자가 실물을 보고 결정                        |
| 아이콘 색상 | **3가지 모드 모두 구현**하여 비교                    | 모노크롬, 브랜드컬러, 회색→호버 브랜드컬러       |
| 아이콘 소스 | `@icons-pack/react-simple-icons` npm 패키지          | CDN보다 안정적, props로 색상 제어                |
| 설명 언어   | 한국어 (헤딩 아래 설명 문단)                         |                                                  |

---

## 2. 레퍼런스 사이트 분석 요약

### Site A — syahrilarfianalmazril.my.id

Skills 전용 페이지(`/about/skills`)에서 다양한 패턴 혼합:

- **카드 그리드**: 2-Column 카드에 제목 + 진행 바 + 설명
- **Sticky Accordion**: Core Focus 영역, 클릭 시 활성화/dim
- **3-Column 아이콘 그리드**: Technical Stack — `아이콘 | 이름 | 짧은 설명` → **채택 패턴**
- **마르퀴 칩**: Professional Tooling — 가로 무한 스크롤 필캡슐
- **별자리 CTA**: Engineering the Future — 아이콘들이 점선 원호 위에 배치

### Site B — maheshppai-v1.netlify.app

홈페이지 내 섹션으로 Skills를 다룸:

- 수평 스크롤 프로젝트 카드 캐러셀
- 기술 스택은 프로젝트 카드 내 태그로 간접 표현

### 채택/불채택 정리

| 채택                                       | 불채택                               |
| ------------------------------------------ | ------------------------------------ |
| Site A 아이콘 그리드 패턴                  | 전용 페이지 구조                     |
| Site A 필캡슐 칩 패턴 (인라인 칩으로 변형) | Sticky Accordion (Works에서 사용 중) |
| 카테고리별 분류                            | 마르퀴 (Brand에서 사용 중)           |
|                                            | 대량 카드 20개+                      |

---

## 3. 카테고리 구조 및 데이터

### 3.1 확정 카테고리 (5개)

| #   | 카테고리       | TagBar 표시명  | 성격                                           |
| --- | -------------- | -------------- | ---------------------------------------------- |
| 1   | Frontend       | Frontend       | 핵심 정체성 — UI/프론트엔드 기술               |
| 2   | Backend        | Backend        | 서버/DB — 풀스택 역량                          |
| 3   | Infrastructure | Infrastructure | 배포/운영 — 클라우드, 서버, 빌드               |
| 4   | Tooling        | Tooling        | 개발 워크플로우 — 디자인, 코드 품질, 협업 도구 |
| 5   | AI             | AI             | AI 코딩/생산성 도구                            |

### 3.2 확정 기술 스택 데이터

#### Frontend (16개)

| #   | 이름            | 아이콘 컴포넌트명 | 브랜드 컬러                        | 지원             |
| --- | --------------- | ----------------- | ---------------------------------- | ---------------- |
| 1   | JavaScript      | `SiJavascript`    | `#F7DF1E`                          | ✅               |
| 2   | TypeScript      | `SiTypescript`    | `#3178C6`                          | ✅               |
| 3   | React.js        | `SiReact`         | `#61DAFB`                          | ✅               |
| 4   | Next.js         | `SiNextdotjs`     | `#000000` → 다크테마에서 `#FFFFFF` | ✅               |
| 5   | HTML5           | `SiHtml5`         | `#E34F26`                          | ✅               |
| 6   | CSS3            | `SiCss`           | `#663399`                          | ✅ (slug: `css`) |
| 7   | SCSS / Sass     | `SiSass`          | `#CC6699`                          | ✅               |
| 8   | Tailwind CSS    | `SiTailwindcss`   | `#06B6D4`                          | ✅               |
| 9   | Framer Motion   | `SiFramer`        | `#0055FF`                          | ✅               |
| 10  | Three.js        | `SiThreedotjs`    | `#000000` → `#FFFFFF`              | ✅               |
| 11  | Zustand         | —                 | —                                  | ❌ 커스텀 필요   |
| 12  | Redux           | `SiRedux`         | `#764ABC`                          | ✅               |
| 13  | Recoil          | `SiRecoil`        | `#3578E5`                          | ✅               |
| 14  | React Query     | `SiReactquery`    | `#FF4154`                          | ✅               |
| 15  | Storybook       | `SiStorybook`     | `#FF4785`                          | ✅               |
| 16  | React Hook Form | `SiReacthookform` | `#EC5990`                          | ✅               |

#### Backend (8개)

| #   | 이름    | 아이콘 컴포넌트명      | 브랜드 컬러           | 지원                                   |
| --- | ------- | ---------------------- | --------------------- | -------------------------------------- |
| 1   | Java    | `SiOpenjdk`            | `#437291`             | ✅ (Java 아이콘은 없지만 OpenJDK 사용) |
| 2   | Spring  | `SiSpring`             | `#6DB33F`             | ✅                                     |
| 3   | Python  | `SiPython`             | `#3776AB`             | ✅                                     |
| 4   | Django  | `SiDjango`             | `#092E20` → `#FFFFFF` | ✅                                     |
| 5   | FastAPI | `SiFastapi`            | `#009688`             | ✅                                     |
| 6   | Node.js | `SiNodedotjs`          | `#5FA04E`             | ✅                                     |
| 7   | MySQL   | `SiMysql`              | `#4479A1`             | ✅                                     |
| 8   | MSSQL   | `SiMicrosoftsqlserver` | `#CC2927`             | ✅                                     |

#### Infrastructure (7개)

| #   | 이름           | 아이콘 컴포넌트명     | 브랜드 컬러           | 지원 |
| --- | -------------- | --------------------- | --------------------- | ---- |
| 1   | AWS            | `SiAmazonwebservices` | `#232F3E` → `#FF9900` | ✅   |
| 2   | Vercel         | `SiVercel`            | `#000000` → `#FFFFFF` | ✅   |
| 3   | Nginx          | `SiNginx`             | `#009639`             | ✅   |
| 4   | Docker         | `SiDocker`            | `#2496ED`             | ✅   |
| 5   | Linux          | `SiLinux`             | `#FCC624`             | ✅   |
| 6   | GitHub Actions | `SiGithubactions`     | `#2088FF`             | ✅   |
| 7   | Turborepo      | `SiTurborepo`         | `#EF4444`             | ✅   |

#### Tooling (14개)

| #   | 이름             | 아이콘 컴포넌트명   | 브랜드 컬러           | 지원             |
| --- | ---------------- | ------------------- | --------------------- | ---------------- |
| 1   | Figma            | `SiFigma`           | `#F24E1E`             | ✅               |
| 2   | Git              | `SiGit`             | `#F05032`             | ✅               |
| 3   | pnpm             | `SiPnpm`            | `#F69220`             | ✅               |
| 4   | yarn-berry       | `SiYarn`            | `#2C8EBB`             | ✅ (slug: yarn)  |
| 5   | Jest             | `SiJest`            | `#C21325`             | ✅               |
| 6   | Playwright       | `SiPlaywright`      | `#2EAD33`             | ✅               |
| 7   | ESLint           | `SiEslint`          | `#4B32C3`             | ✅               |
| 8   | Prettier         | `SiPrettier`        | `#F7B93E`             | ✅               |
| 9   | SonarCloud       | `SiSonar`           | `#FD3456`             | ✅ (slug: sonar) |
| 10  | CodeRabbit       | `SiCoderabbit`      | `#FF6C37`             | ✅               |
| 11  | Lighthouse       | `SiLighthouse`      | `#F44B21`             | ✅               |
| 12  | Google Analytics | `SiGoogleanalytics` | `#E37400`             | ✅               |
| 13  | Notion           | `SiNotion`          | `#000000` → `#FFFFFF` | ✅               |
| 14  | Slack            | `SiSlack`           | `#4A154B`             | ✅               |

#### AI (5개)

| #   | 이름           | 아이콘 컴포넌트명 | 브랜드 컬러           | 지원                       |
| --- | -------------- | ----------------- | --------------------- | -------------------------- |
| 1   | Claude Code    | `SiAnthropic`     | `#191919` → `#FFFFFF` | ✅ (Anthropic 아이콘 사용) |
| 2   | Cursor         | `SiCursor`        | `#000000` → `#FFFFFF` | ✅                         |
| 3   | Codex          | `SiOpenai`        | `#412991`             | ✅ (OpenAI 아이콘 사용)    |
| 4   | GitHub Copilot | `SiGithubcopilot` | `#000000` → `#FFFFFF` | ✅                         |
| 5   | Antigravity    | —                 | —                     | ❌ 커스텀 필요             |

### 3.3 미지원 아이콘 정리 (커스텀 필요: 7개)

> ⚠️ **구현 중 발견**: `@icons-pack/react-simple-icons` v13.13.0에서 5개 아이콘이 추가로 미지원 확인.
> 총 7개 커스텀 SVG를 `/public/icons/`에 배치 완료. (나중에 실제 브랜드 SVG로 교체 예정)

| 기술               | 파일                            | 상태                          |
| ------------------ | ------------------------------- | ----------------------------- |
| **AWS**            | `/public/icons/aws.svg`         | ✅ 배치 완료 (공식 path data) |
| **MSSQL**          | `/public/icons/mssql.svg`       | ⚠️ placeholder                |
| **Playwright**     | `/public/icons/playwright.svg`  | ⚠️ placeholder                |
| **Slack**          | `/public/icons/slack.svg`       | ✅ 배치 완료 (공식 path data) |
| **OpenAI** (Codex) | `/public/icons/openai.svg`      | ✅ 배치 완료 (공식 path data) |
| **Zustand**        | `/public/icons/zustand.svg`     | ⚠️ placeholder                |
| **Antigravity**    | `/public/icons/antigravity.svg` | ⚠️ placeholder                |

> 커스텀 아이콘은 simpleicons와 동일한 규격(24×24 viewBox, 단색 `fill="currentColor"`)으로 통일.

---

## 4. 아이콘 전략

### 4.1 패키지 선택: `@icons-pack/react-simple-icons`

**CDN(`cdn.simpleicons.org`) 대신 npm 패키지를 선택한 이유:**

| 비교 항목       | CDN                                 | npm 패키지                          |
| --------------- | ----------------------------------- | ----------------------------------- |
| 아이콘 수       | CDN 버전 차이로 일부 404 발생       | 최신 버전 (v13.13.0) 완전 지원      |
| 색상 제어       | URL 파라미터 변경 필요              | `color` prop으로 즉시 변경          |
| hover 색상 전환 | CSS filter 또는 두 이미지 교체 필요 | React state로 자연스럽게 전환       |
| 번들 사이즈     | 각 아이콘 CDN 요청 (N개 HTTP 요청)  | Tree-shaking으로 사용하는 것만 번들 |
| 타입 안전성     | 없음                                | TypeScript 지원                     |

### 4.2 사용 예시

```tsx
import { SiReact } from '@icons-pack/react-simple-icons';

// 모노크롬 (흰색)
<SiReact color="#ffffff" size={24} />

// 브랜드 컬러
<SiReact color="#61DAFB" size={24} />

// 회색 → 호버 시 브랜드 컬러 (state로 제어)
<SiReact color={isHovered ? "#61DAFB" : "#666666"} size={24} />
```

### 4.3 커스텀 아이콘 처리

"npm 미지원 2개 항목(Zustand, Antigravity) + 추가 커스텀 배치 5개"는 래퍼 컴포넌트로 통일:

```tsx
// SkillIcon 래퍼 — simpleicons 컴포넌트와 커스텀 SVG를 동일 인터페이스로 제공
interface SkillIconProps {
  size?: number;
  color?: string;
  customIconPath?: string;
}

// 커스텀 아이콘은 /public/icons/zustand.svg 등에 배치 후
// <img> 또는 인라인 SVG 컴포넌트로 렌더링
```

---

## 5. 레이아웃 — 두 가지 비교 구현

구현 시 **두 레이아웃을 모두 만들어** 실물을 보고 최종 결정합니다.

### Layout A: 카드 그리드

```text
Frontend
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   [React]   │ │    [TS]     │ │  [Next.js]  │ │  [Tailwind] │ │  [Framer]   │
│   React.js  │ │  TypeScript │ │   Next.js   │ │ Tailwind CSS│ │Framer Motion│
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  [Three.js] │ │  [Zustand]  │ │   [Redux]   │
│   Three.js  │ │   Zustand   │ │    Redux    │
└─────────────┘ └─────────────┘ └─────────────┘
```

**스타일:**

- 각 카드: `bg-white/[0.03]` or `bg-transparent`, `border border-white/10`, `rounded-lg`
- 아이콘: 카드 중앙, 24~32px
- 이름: 아이콘 아래, `text-xs` or `text-sm`, `text-white/70`
- 그리드: `grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7`
- 카드 간격: `gap-3` or `gap-4`
- hover: `border-white/30` + `bg-white/[0.06]` + scale `1.02`

**장점:**

- 각 기술이 독립적인 시각적 무게를 가짐
- BrandSection 클라이언트 그리드, Site A Technical Stack과 일관
- 정렬이 깔끔함

**단점:**

- 항목 수에 따라 마지막 줄이 비대칭적일 수 있음
- 카드가 작으면 아이콘이 잘 안 보일 수 있음

---

### Layout B: 인라인 칩 (flex-wrap)

```text
Frontend
[JS JavaScript] [TS TypeScript] [⚛ React.js] [▲ Next.js] [🟧 HTML5]
[🟣 CSS3] [💅 SCSS] [🔵 Tailwind CSS] [🔲 Framer Motion] [△ Three.js]
[🐻 Zustand] [💜 Redux] [🔴 Recoil]
```

**스타일:**

- 각 칩: `inline-flex items-center gap-2`, `px-3 py-1.5` or `px-4 py-2`
- 배경: `bg-white/[0.03]`, `border border-white/10`, `rounded-full`
- 아이콘: 16~20px, 칩 왼쪽
- 이름: `text-xs` or `text-sm`, `text-white/70`
- 컨테이너: `flex flex-wrap gap-2` or `gap-3`
- hover: `border-white/30` + `bg-white/[0.06]`

**장점:**

- 더 compact, 공간 효율적
- 유동적 — 항목 수에 관계없이 자연스러운 줄바꿈
- 칩 크기가 텍스트 길이에 맞춰 가변 → 다이나믹한 느낌

**단점:**

- 줄마다 칩 수가 달라 비정형적
- 아이콘이 작아 인식력이 다소 떨어질 수 있음

---

### 비교 구현 방법

개발 시 `SkillsSection` 내에 토글 스위치를 임시로 배치:

```text
[Grid] [Chips]  ·  [Mono] [Brand] [Hover]
```

- 레이아웃 토글: Grid ↔ Chips
- 색상 토글: Monochrome ↔ Brand Color ↔ Gray→Hover
- 최종 결정 후 토글 제거, 선택되지 않은 레이아웃 코드 삭제

---

## 6. 아이콘 색상 — 세 가지 비교 구현

### Mode 1: 모노크롬 (Monochrome)

- 모든 아이콘: `color="#ffffff"` 또는 `color="#888888"`
- **톤**: 미니멀, 에디토리얼, 현재 사이트와 가장 일관
- **리스크**: 아이콘 인식력이 떨어질 수 있음 (React, Vue 구분 어려움)

### Mode 2: 브랜드 컬러 (Brand Color)

- 각 아이콘: 고유 브랜드 컬러 사용 (React `#61DAFB`, TypeScript `#3178C6` 등)
- **톤**: 활기있고, 기술 포트폴리오 느낌
- **리스크**: 컬러풀해서 현재 사이트의 모노톤 다크 테마와 충돌 가능

### Mode 3: 회색 → 호버 시 브랜드 컬러 (Interactive)

- 기본: `color="#666666"` (subtle gray)
- 호버: `color={brandColor}` + `transition: color 0.3s ease`
- **톤**: 절충안, 인터랙션 요소 추가
- **리스크**: 구현 복잡도 약간 증가, 모바일에서는 hover가 없음

### 다크 테마 특수 처리

일부 브랜드 컬러가 어두운 경우 (Next.js `#000000`, Django `#092E20` 등):

- Mode 2/3에서 어두운 브랜드 컬러는 `#FFFFFF`로 대체
- 데이터에 `darkModeBrandColor` 필드 추가하여 관리

---

## 7. 섹션 오프닝 구조

### 전체 흐름

```text
┌──────────────────────────────────────────────────────────────────┐
│  SectionLabel                                                    │
│    scene: '03'                                                   │
│    leftLabel: '© Technical Skills 기술 역량'                      │
│    rightLabel: 'Stack'                                           │
├──────────────────────────────────────────────────────────────────┤
│  site-container px-6 md:px-12                                    │
│                                                                  │
│  h1: "Skills."                                                   │
│  text-[44px] sm:text-7xl md:text-8xl lg:text-9xl                │
│  tracking-tight font-semibold                                    │
│  (WorksSection "Works." 와 동일한 스타일)                          │
│                                                                  │
│  p: 설명 문단 (text-gray-400 text-base md:text-lg)               │
│  "프론트엔드를 중심으로 백엔드, 인프라, 디자인까지                   │
│   서비스의 전체 생애주기를 다루는 기술 역량입니다.                    │
│   단순한 도구 나열이 아닌, 실무에서 검증된 기술 스택입니다."          │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  TagBar                                                          │
│    tags: ['Frontend', 'Backend', 'Infrastructure',               │
│           'Tooling', 'AI']                                       │
│    hideFromIndex: 3 (모바일에서 Tooling, AI 숨김)                  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  site-container px-6 md:px-12                                    │
│                                                                  │
│  카테고리별 스킬 그리드/칩 반복                                     │
│    "Frontend" 헤딩 + 아이콘 카드/칩들                              │
│    "Backend" 헤딩 + 아이콘 카드/칩들                               │
│    "Infrastructure" 헤딩 + 아이콘 카드/칩들                        │
│    "Tooling" 헤딩 + 아이콘 카드/칩들                               │
│    "AI" 헤딩 + 아이콘 카드/칩들                                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 카테고리 헤딩 스타일

ExperienceSection의 "경력" / "자격증" 헤딩과 동일:

```text
pb-4 md:pb-6 border-b border-white/20 text-lg md:text-xl font-bold uppercase
```

### 카테고리 간 간격

```text
각 카테고리 사이: mt-12 md:mt-16 (여유 있는 수직 간격)
```

---

## 8. 애니메이션 전략

### 8.1 진입 애니메이션

**카드/칩 stagger 진입:**

```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false, margin: '-40px' }}
  transition={{ duration: 0.6, delay: index * 0.05 }}
>
```

- `once: false` — 프로젝트 전체 패턴 (re-enter 시 재생)
- stagger: `index * 0.05` (항목이 많으므로 ExperienceSection의 0.08보다 짧게)
- easing: 기본 ease

### 8.2 Hover 효과

**Layout A (카드):**

- `scale: 1.02` + `border-white/30` + `bg-white/[0.06]`
- transition: `all 0.2s ease`

**Layout B (칩):**

- `border-white/30` + `bg-white/[0.06]`
- transition: `all 0.2s ease`
- scale 없음 (칩은 작아서 scale이 어색)

### 8.3 커서 연동

- 카드/칩 hover 시: `useCursorStore → setType('pointer')`
- leave 시: `setType('default')`

---

## 9. 반응형 전략

### Layout A (카드 그리드)

| 브레이크포인트  | 그리드        | 카드 크기                       |
| --------------- | ------------- | ------------------------------- |
| < `sm` (모바일) | `grid-cols-3` | 아이콘 20px, 텍스트 text-[10px] |
| `sm`            | `grid-cols-4` | 아이콘 24px, 텍스트 text-xs     |
| `md`            | `grid-cols-5` | 아이콘 28px, 텍스트 text-xs     |
| `lg`            | `grid-cols-6` | 아이콘 28px, 텍스트 text-sm     |
| `xl`            | `grid-cols-7` | 아이콘 32px, 텍스트 text-sm     |

### Layout B (인라인 칩)

| 브레이크포인트  | 칩 스타일                                               |
| --------------- | ------------------------------------------------------- |
| < `sm` (모바일) | 아이콘 14px, 텍스트 text-[10px], `px-2 py-1`, `gap-1.5` |
| `sm`+           | 아이콘 16px, 텍스트 text-xs, `px-3 py-1.5`, `gap-2`     |
| `md`+           | 아이콘 18px, 텍스트 text-sm, `px-4 py-2`, `gap-3`       |

### 공통

- `site-container` + `px-6 md:px-12` (전체 래퍼)
- 섹션 상단: `pt-[140px] xl:pt-[200px]` (WorksSection과 동일)
- TagBar `hideFromIndex: 3` → 모바일에서 3개만 표시

---

## 10. 컴포넌트 구조

```text
SkillsSection.tsx (메인 섹션)
├── SectionLabel (기존 공유 컴포넌트)
├── 정적 "Skills." 헤딩 + 설명 문단
├── TagBar (기존 공유 컴포넌트)
├── [비교 토글 UI — 임시, 최종 결정 후 제거]
└── SkillCategoryGroup (카테고리 반복 렌더링)
    ├── 카테고리 헤딩 ("Frontend", "Backend", ...)
    └── SkillGrid (Layout A) 또는 SkillChips (Layout B)
        └── SkillIcon (개별 아이콘 + 이름)
            ├── SimpleIcons 컴포넌트 (지원되는 경우)
            └── CustomIcon (커스텀 배치 7개 (npm 미지원 2개 + 추가 커스텀 5개))
```

### 주요 Props

```tsx
// SkillsSection
interface SkillsSectionProps {
  // 비교 모드 (개발 시만 사용, 최종 결정 후 제거)
  layout?: 'grid' | 'chips';
  colorMode?: 'mono' | 'brand' | 'interactive';
}

// SkillIcon
interface SkillIconProps {
  name: string;
  icon: React.ComponentType<{ color: string; size: number }> | null;
  brandColor: string;
  colorMode: 'mono' | 'brand' | 'interactive';
  customIconPath?: string; // 미지원 아이콘용
}
```

---

## 11. 파일 구조

```text
apps/portfolio/
├── app/
│   └── page.tsx                         ← SkillsSection import 추가
├── public/
│   └── icons/                           ← [NEW] 커스텀 SVG 아이콘
│       ├── zustand.svg
│       ├── aws.svg
│       ├── mssql.svg
│       ├── playwright.svg
│       ├── slack.svg
│       ├── openai.svg
│       └── antigravity.svg
├── src/
│   └── features/
│       └── home/
│           ├── SkillsSection.tsx         ← [NEW] 메인 섹션
│           ├── ExperienceSection.tsx     ← [MODIFY] scene '03' → '04'
│           └── components/
│               ├── SkillGrid.tsx         ← [NEW] Layout A (카드 그리드)
│               ├── SkillChips.tsx        ← [NEW] Layout B (인라인 칩)
│               └── SkillIcon.tsx         ← [NEW] 아이콘 래퍼 (색상 모드 처리)
```

### 의존성 추가

```bash
pnpm add @icons-pack/react-simple-icons -F portfolio
```

### page.tsx 변경

```tsx
// 변경 전
<WorksSection />
<ExperienceSection />

// 변경 후
<WorksSection />
<SkillsSection />
<ExperienceSection />
```

---

## 12. 구현 순서

### Phase 1: 기반 세팅

1. `@icons-pack/react-simple-icons` 패키지 설치
2. 커스텀 아이콘 SVG 2개(Zustand, Antigravity) 수집 및 `/public/icons/` 배치
3. 스킬 데이터 상수 정의 (`SKILL_CATEGORIES`)

### Phase 2: 컴포넌트 구현

4. `SkillIcon.tsx` — 아이콘 래퍼 (3가지 색상 모드 지원)
5. `SkillGrid.tsx` — Layout A (카드 그리드)
6. `SkillChips.tsx` — Layout B (인라인 칩)
7. `SkillsSection.tsx` — 메인 섹션 + 비교 토글

### Phase 3: 통합

8. `page.tsx`에 SkillsSection 삽입
9. `ExperienceSection.tsx` scene 번호 변경
10. 개발 서버에서 두 레이아웃 × 세 색상 = 6가지 조합 비교
11. **[중요]** `SkillsSection.tsx` 최상위에 `data-testid='skills-section'`을 부여하고, `e2e/snapshot.spec.ts`에 시각적 회귀 테스트(VRT) 코드를 수동으로 추가합니다.

### Phase 4: 확정

11. 사용자 결정 후 선택되지 않은 레이아웃 제거
12. 비교 토글 UI 제거
13. 최종 반응형/애니메이션 미세 조정

---

## 13. 해결된 질문 (v2.1)

| #   | 질문              | 결정                                      |
| --- | ----------------- | ----------------------------------------- |
| Q1  | 설명 문단 텍스트  | ✅ 현재 제안 그대로 사용 (추후 수정 가능) |
| Q2  | JSP 포함 여부     | ✅ **제거**                               |
| Q3  | Creatie 포함 여부 | ✅ **제거**                               |
| Q4  | AI 카테고리 보강  | ✅ **GitHub Copilot 추가**                |

### 최종 항목 수 분포

| 카테고리       | 항목 수  |
| -------------- | -------- |
| Frontend       | 16개     |
| Backend        | 8개      |
| Infrastructure | 7개      |
| Tooling        | 14개     |
| AI             | 5개      |
| **총계**       | **50개** |

> 모든 열린 질문이 해결되었습니다. 이 계획서는 구현 준비 완료 상태입니다.
