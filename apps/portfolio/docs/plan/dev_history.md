# 포트폴리오 개발 히스토리 (Phase 1 ~ 5)

> **작성일:** 2026-06-30
> **Title:** 포트폴리오 개발 히스토리 (Phase 1 ~ 5)
> **Description:** 포트폴리오 앱의 초기 세팅부터 다크 모드, 3D Hero 캔버스 도입까지의 주요 개발 완료 요약 기록.

> 각 Phase의 구현 완료 요약 기록입니다.

---

## Phase 1: 포트폴리오 초기 세팅

`frontend-foundation` 템플릿을 기반으로 **`mono-lab`** 과 첫 번째 앱인 **`apps/portfolio`** 셋업이 완료되었습니다.

### 주요 작업 내역

1. **템플릿 복제 및 이름 변경**
   - `mono-lab` 최상위 패키지 이름 변경 완료.
   - `apps/web` → `apps/portfolio` 로 이름 및 경로 변경.
2. **모노레포 의존성(pnpm) 설치 완료**
   - `pnpm install`을 통해 모든 워크스페이스 패키지 연결.
3. **포트폴리오 핵심 라이브러리 추가**
   - `framer-motion` (애니메이션)
   - `@studio-freight/lenis` (부드러운 스크롤)
   - `zustand` (전역 상태 관리)
   - `lucide-react`, `clsx`, `tailwind-merge` (UI 유틸)
4. **디렉토리 뼈대 생성**
   - `apps/portfolio/src/` 내부에 `features/`, `store/`, `contents/` 빈 폴더 생성 완료.

---

## Phase 2: 레이아웃 및 스크롤/커서 세팅

`mono-lab/apps/portfolio` 프로젝트에 부드러운 인터랙션을 위한 기반 공사를 완료했습니다.

### 주요 구현 내역

#### 1. 전역 상태 및 애니메이션

- **Zustand Store (`useCursorStore.ts`)**: 마우스 호버 상태(`default`, `pointer`)를 전역적으로 관리할 수 있도록 세팅했습니다.
- **Custom Cursor (`CustomCursor.tsx`)**: 기본 마우스 커서를 숨기고, `framer-motion`을 사용하여 부드럽게 마우스를 따라다니는 원형 커서를 구현했습니다. 배경색과 대비를 이루도록 `mix-blend-mode: difference`를 적용했습니다.

#### 2. 관성 스크롤

- **Lenis (`SmoothScroll.tsx`)**: 기본 브라우저 스크롤의 딱딱함을 없애고, 물리 법칙 기반의 묵직하고 유려한 스크롤 경험을 제공하기 위해 전역 Provider를 추가했습니다.

#### 3. 공통 레이아웃 컴포넌트

- **Header (`Header.tsx`)**: 스크롤을 아래로 내릴 때는 매끄럽게 위로 숨고, 위로 올릴 때 다시 나타나도록 `framer-motion`의 `useScroll` 훅을 사용해 구현했습니다.
- **Footer (`Footer.tsx`)**: 레퍼런스의 연락처 정보 및 소셜 링크 섹션을 구현했습니다.

#### 4. 통합 테스트 페이지

- **`layout.tsx` & `globals.css`**: 다크 모드(`bg-[#0a0a0a]`) 배경과 폰트를 전역 세팅하고, 모든 기능을 통합했습니다.

---

## Phase 3: 랜딩 페이지 섹션 및 애니메이션 구현

Rootwise Architects의 우아한 분위기를 살린 메인 페이지(`app/page.tsx`) 조립이 완료되었습니다.

### 주요 구현 내역

#### 1. `HeroSection.tsx` (메인 타이틀)

- 거대한 **"ROOTWISE ARCHITECTS"** 타이포그래피와 **"Designing the future of architecture."** 문구를 배치했습니다.
- 스크롤을 내릴 때 글자가 화면 밖으로 밀려나면서 서서히 투명해지는 **패럴랙스(Parallax)** 효과를 `framer-motion`의 `useTransform`으로 구현했습니다.

#### 2. `FeaturedWorks.tsx` (대표 포트폴리오 리스트)

- 임시 이미지 경로(`/images/projects/01.jpg` 등)를 사용하는 목업 데이터를 세팅했습니다.
- 스크롤이 해당 영역에 도달하면 사진들이 시간차를 두고 아래에서 위로 나타나는 **Staggered Fade-in Up** 애니메이션을 적용했습니다.
- 썸네일에 마우스를 올리면 이미지가 아주 살짝 커지는(Zoom) 트랜지션을 추가했습니다.

#### 3. `ServicesSection.tsx` (서비스 소개 영역)

- 건축, 인테리어 디자인, 도시 계획에 대한 임시 텍스트를 배치하고, 스크롤 진입 시 텍스트들이 왼쪽에서 오른쪽으로 미끄러지듯 등장하도록 처리했습니다.

---

## Phase 3.5: 홈 화면 전면 리팩토링 (Helios 테마)

레퍼런스(`designbyhelios.framer.website`)에 맞춰, 홈 화면의 전체 레이아웃과 텍스트를 브랜드 디자이너 포트폴리오 성격에 맞게 완전히 뜯어고쳤습니다.

### 주요 리팩토링 내역

- **`Header.tsx`**: 좌측 텍스트 로고 자리를 이미지 로고(`<img>`) 태그로 변경했습니다. (`/images/logo.png` 경로 사용)
- **`HeroSection.tsx`**: 큰 `ROOTWISE` 텍스트 대신, "5+ years™ of brand identity work..." 타이포그래피와 상단 "Based in Seoul, 한국", "Logo / Brand Designer" 문구로 교체했습니다.
- **`FeaturedWorks.tsx`**: 건축물 프로젝트 4개를 Helios의 포트폴리오(Rootwise Architects, Meltdown Studios 등) 이름과 브랜드 디자인 카테고리로 변경했습니다.
- **`ServicesSection.tsx`**: 건축(Architecture) 서비스를 Helios의 핵심 역량인 Capabilities (Brand Strategy, Logo Design, Brand Identity, Brand Guidelines) 내용으로 변경했습니다.
- **`ProfileSection.tsx` (신규 생성)**: Helios 사이트에 있는 Personal Profile (자기 소개)와 Experience (경력 사항) 섹션을 새롭게 추가했습니다.
- **`Footer.tsx`**: 하단 타이틀을 **PORTFOLIO WRAP©** 으로 변경하고, 관련된 텍스트도 모두 Helios 문구로 교체했습니다.

---

## Phase 4: 마크다운(MDX) 파이프라인 및 서브 페이지 구현

포트폴리오의 핵심 기능인 "프로젝트 상세 데이터 연동"과 서브 라우트들(`/work`, `/gallery`)의 뼈대를 완성했습니다. 이제 하드코딩 없이, 지정된 폴더에 마크다운(`.mdx`) 파일만 추가하면 사이트 전체에 알아서 포트폴리오가 렌더링됩니다.

### 주요 구현 내역

#### 1. MDX 파이프라인 구축 (`src/lib/mdx.ts`)

- `gray-matter`와 `next-mdx-remote`를 활용하여 `src/contents/work` 폴더 내의 `.mdx` 파일들을 읽어옵니다.
- `Frontmatter` (제목, 카테고리, 썸네일, 순서)를 파싱하여 데이터를 추출하는 서버 유틸리티를 구현했습니다.

#### 2. 샘플 콘텐츠 세팅 (`src/contents/work/*.mdx`)

- Helios 레퍼런스에 맞춰 총 4개의 샘플 프로젝트 파일(`rootwise.mdx`, `meltdown.mdx`, `meridiem.mdx`, `nutree.mdx`)을 생성해 두었습니다.

#### 3. Work 인덱스 페이지 (`/app/work/page.tsx`)

- MDX 파일 목록을 서버에서 모두 불러와 `getAllProjects()`로 파싱한 뒤, 날짜/순서 기반으로 정렬하여 그리드 컴포넌트(`WorkGrid.tsx`)에 넘겨주도록 구현했습니다.

#### 4. Work 상세 동적 라우팅 (`/app/work/[slug]/page.tsx`)

- `/work/rootwise` 와 같이 접속하면, 해당하는 MDX 파일을 읽어와 동적으로 페이지를 그려냅니다.
- 상단에 60~80vh 높이의 꽉 찬 썸네일(Hero 이미지)을 배치하고, 그 밑으로 `next-mdx-remote`가 변환한 텍스트 콘텐츠가 깔끔하게 렌더링됩니다.

#### 5. Gallery 정적 페이지 (`/app/gallery/page.tsx`)

- Helios 레퍼런스 구조를 그대로 따르기로 한 결정에 따라, 갤러리 뷰의 뼈대를 잡아두었습니다.

---

## Phase 5: Contact 폼 처리 + 페이지 트랜지션

PRD의 마지막 기능 마일스톤인 **Contact 폼**과 **페이지 전환 애니메이션**까지 완성했습니다.

### 주요 구현 내역

#### 1. `src/lib/actions.ts` (Server Action)

- Next.js의 `'use server'` 디렉티브를 사용하여 서버에서만 실행되는 함수를 구현했습니다.
- `.env.local`에 `RESEND_API_KEY`가 있으면 실제 이메일을 발송하고, 없으면 콘솔에 로깅만 합니다. 따라서 **API Key 없이도 폼 제출 기능이 바로 동작**합니다.

#### 2. `ContactForm.tsx` (클라이언트 폼 컴포넌트)

- **React Hook Form**으로 폼 상태를 효율적으로 관리합니다.
- **Zod 스키마**로 name(2자 이상), email(이메일 형식), message(10자 이상) 유효성 검사를 수행합니다.
- 제출 상태(`idle` → `loading` → `success`/`error`)에 따라 버튼 텍스트와 피드백 메시지가 변합니다.

#### 3. `/contact` 페이지

- 레퍼런스의 Contact 페이지 구조(좌측: 제목, 우측: 연락처 정보)를 참고하여 레이아웃을 구성했습니다.
- 이메일, 거주지(Seoul, 한국), SNS 링크 자리를 배치해 두었습니다.

#### 4. `app/template.tsx` (페이지 전환 효과)

- Next.js App Router의 `template.tsx`는 라우트가 변경될 때마다 새로 마운트되는 특성이 있습니다.
- 이 파일에 Framer Motion의 `opacity: 0 → 1` Fade 효과를 적용하여, **모든 페이지 이동에서 부드러운 전환 애니메이션이 자동으로 적용**됩니다.

### 이메일 전송 활성화 방법 (선택 사항)

실제 이메일 발송을 원하신다면:

1. [resend.com](https://resend.com) 무료 계정 생성 후 API Key 발급
2. `apps/portfolio/.env.local` 파일 생성 후 아래 내용 입력:

```text
RESEND_API_KEY=re_your_key_here
CONTACT_EMAIL=your-email@gmail.com
```

---

## Phase 마일스톤 달성 현황

| Phase     | 내용                                          | 상태 |
| --------- | --------------------------------------------- | ---- |
| Phase 1   | 초기 세팅 (모노레포 + 패키지)                 | ✅   |
| Phase 2   | 공통 레이아웃 (Header, Footer, Cursor, Lenis) | ✅   |
| Phase 3   | 랜딩 페이지 섹션 및 애니메이션                | ✅   |
| Phase 3.5 | Helios 테마로 전면 리팩토링                   | ✅   |
| Phase 4   | MDX 파이프라인 + Work/Gallery 페이지          | ✅   |
| Phase 5   | Contact 폼 + 페이지 트랜지션                  | ✅   |
