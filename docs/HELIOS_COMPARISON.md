# Design by Helios vs mono-lab2 포트폴리오 비교

> **레퍼런스:** [designbyhelios.framer.website](https://designbyhelios.framer.website/)  
> **프로젝트:** `apps/portfolio` (Next.js + Tailwind + Framer Motion + Lenis)  
> **작성일:** 2026-05-20

---

## 1. 요약

| 영역 | 일치도 | 한 줄 평가 |
|------|--------|------------|
| 전체 톤 (다크 배경, 미니멀 UI) | 높음 | `#0a0a0a` 기반 다크 테마·흰 텍스트 구조는 유사 |
| 타이포그래피·폰트 | 낮음 | 레퍼런스 커스텀 폰트 vs 프로젝트 `Inter` 단일 폰트 |
| 섹션 구성·콘텐츠 | 중간 | 주요 섹션은 있으나 **Practice 타이포**, **Experience 탭**, **Featured Works 인트로** 등 누락·변형 |
| Motion / 인터랙션 | 중간 | 마르퀴·패럴랙스·호버 dim 등 일부 구현, 레퍼런스 특유 연출·진입 모션은 미흡 |
| 서브 페이지 | 중간 | Work split 레이아웃은 근접, Gallery·Contact는 플레이스홀더 수준 |

---

## 2. 타이포그래피 & 글자 크기

### 2.1 폰트 패밀리

| 항목 | 레퍼런스 (Helios) | 프로젝트 |
|------|-------------------|----------|
| 본문/헤드라인 | Framer 기본·템플릿 커스텀 산세리프 (기하학적, 넓은 자간) | Google **`Inter`** 단일 (`layout.tsx`) |
| 모노/번호 | 서비스 번호 `01`~`04` 등 세리프/모노 느낌 | `font-mono` 일부만 사용 (`ServicesSection`, 경력 `period`) |
| 일본어 보조 | ビジュアル, イメージ, アンサー 등 혼용 | 일부 한글·일본어 혼용 (`EditorialDivider`, Hero `イメージ.`) |

**차이:** 레퍼런스는 제목·본문 간 **굵기·자간·x-height**가 Framer 템플릿에 맞춰져 있고, 프로젝트는 Inter `font-medium` 위주라 **시각적 밀도·고급스러움**이 다르게 느껴질 수 있음.

### 2.2 주요 텍스트 스케일 (구현 기준)

| 위치 | 레퍼런스 (관찰) | 프로젝트 (코드) | 차이 |
|------|-----------------|-----------------|------|
| Hero 헤드라인 | **4줄 분리** (`###` 수준, 줄마다 블록) | 한 줄 `h1`, `clamp(2rem, 5.5vw, 5rem)` | 줄바꿈·등장 타이밍 다름 |
| Hero 메타 | 상단 소형 캡션 | `text-[11px]`, `tracking-[0.18em]`, `white/40` | 근사 |
| Brand `5+ years™` | 대형 본문 블록 | `text-3xl md:text-4xl lg:text-5xl` | 크기·행간 유사하나 폰트 다름 |
| Featured Works 마르퀴 | 초대형 `Featured Works©` | `clamp(2.5rem, 8vw, 7rem)`, `white/[0.07]` | 구조 유사 |
| Services 제목 | `# Services` + `### (6)` | `Capabilities©` + 키워드 4개 | **제목·카운트 불일치** |
| Practice | 거대 `Practice.` + **글자 단위 세로 스택** | **섹션 없음** | **미구현** |
| FAQ 제목 | 여러 줄 H3 + 일본어 `アンサー` | `Clarifications©` + 짧은 부제 | 문구·계층 다름 |
| Footer ©2026 | viewport 폭에 맞춘 초대형 워터마크 | `clamp(4rem, 18vw, 18rem)`, `white/[0.06]` | 유사 |

### 2.3 Editorial / 구분선 메타 텍스트

| 항목 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| `© Curated Interfaces ビジュアル` 띠 | **가로 무한 스크롤** (여러 줄 반복) | `EditorialDivider` — **정적** 3열, `text-[10px]`, `white/30` |
| WDX® 스타일 라벨 | `(WDX® — 03)` 등 섹션 번호 | 프로젝트 divider에는 **WDX 번호 없음** |

---

## 3. 색상 & 시각 스타일

### 3.1 팔레트

| 토큰 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 배경 | 거의 검정 | `#0a0a0a` (`globals.css`, 각 섹션) |
| 본문 | 흰색 | `#ffffff` / `text-white` |
| 보조 텍스트 | 회색 톤 다단계 | `white/40`, `white/70`, `gray-400`, `gray-500` |
| 보더 | 10% 전후 흰색 | `border-white/10`, CTA `border-white/40~60` |
| 이미지 플레이스홀더 | 실제 사진·일러스트 | `#1a1a1a`, `#111` + 경로 placeholder |

**차이:** 색상 **구조는 거의 동일**하나, 레퍼런스는 실 이미지·그라데이션으로 대비가 강하고, 프로젝트는 placeholder 비율이 높아 **대비·깊이**가 약함.

### 3.2 블렌드·커서

| 효과 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 헤더 | 고정 네비, mix-blend 느낌 가능 | `mixBlendMode: 'difference'` (`Header.tsx`) |
| 커스텀 커서 | Framer 인터랙션 (링크·카드 반응) | 원형 커서 + `difference` / `VIEW` 라벨 (`CustomCursor.tsx`) |
| 선택 영역 | — | `selection:bg-white selection:text-black` |

---

## 4. 레이아웃 & 섹션 구성

### 4.1 홈 페이지 섹션 순서

| 순서 | 레퍼런스 | 프로젝트 (`app/page.tsx`) |
|------|----------|---------------------------|
| 1 | Hero (2열: 타이포 + 이미지) | `HeroSection` ✅ |
| 2 | 스크롤 메타 띠 (Curated Interfaces…) | `EditorialDivider` (정적) ⚠️ |
| 3 | Brand / `5+ years™` + Contact | `BrandSection` ✅ |
| 4 | Featured Projects + 인트로 문단 | `FeaturedWorks` (인트로 **없음**) ⚠️ |
| 5 | Services `(6)` | `ServicesSection` (제목·UI 다름) ⚠️ |
| 6 | Personal Profile + SEE WORKS | `ProfileSection` (CTA **없음**) ⚠️ |
| 7 | Experience + **Practice** 타이포 + **탭 필터** | Experience 리스트만, **Practice·탭 없음** ❌ |
| 8 | FAQ | `FAQSection` (문항 내용 다름) ⚠️ |
| 9 | Footer (캐러셀·태그·©2026) | `Footer` ✅ (캐러셀 이미지 종류 다름) |

### 4.2 Hero

| 항목 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 위치 문구 | `Based in Delhi インド` | `Based in Seoul, 한국` (의도적 로컬라이즈) |
| 헤드라인 | 4줄 분리 타이틀 | 단일 문단 `Crafting Identities and Systems…` |
| 우측 | 인물/비주얼 이미지 | `/images/hero.jpg` placeholder |
| 하단 띠 | Art Direction, Branding, Strategy, **Web Design** | `Web Design` **미포함** (`MARQUEE_ITEMS`) |
| CTA | Contact (pill) | Contact pill ✅ |

### 4.3 Featured Works

| 항목 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 인트로 카피 | "Every project is a chance to shape a brand…" + **SEE WORKS** | **없음** |
| 프로젝트 순서 | Rootwise (01) → Meltdown (02) → … | Meltdown (01), Rootwise (02) … **순서 상이** |
| 그리드 | 3열 비대칭 스태거 | 3열 스태거 ✅ (`FeaturedWorks.tsx`) |
| CTA 문구 | SEE WORKS | See **All** Works |
| 카드 호버 | 이미지·오버레이 (Framer) | `scale-105` 줌 |

### 4.4 Services / Capabilities

| 항목 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 섹션명 | **Services** + **(6)** | **Capabilities©** |
| 키워드 | Precise, Structured, Focused, Visual Language | 동일 4키워드 ✅ |
| 리스트 UI | Framer 카드/슬라이드 느낌 (반복 마르퀴 포함) | 테이블형 리스트 + hover **dim** |
| 항목 수 | 4개 (01~04) | 4개 ✅ (콘텐츠 동일) |

### 4.5 Experience & Practice

| 항목 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| **Practice.** 타이포 | 글자별 세로 분해 + 스크롤 연출 | **미구현** |
| Experience 필터 | Freelance / Agency Work / Studio / Client Projects **탭** | **탭 없음**, flat 리스트 |
| 경력 데이터 | Delhi, india 등 | Seoul, Korea 등 (로컬라이즈) |

### 4.6 FAQ

| # | 레퍼런스 질문 | 프로젝트 질문 |
|---|---------------|---------------|
| 01 | What services do you offer? | What types of projects do you take on? |
| 02 | typical turnaround time? | How long does a typical project take? |
| 03 | Do you only work in Figma? | Do you work with international clients? |
| 04 | design and development? | What does your process look like? |
| 05 | brand strategy too? | ongoing brand support? |
| 06 | What's your process like? | How do I get started? |

레이아운트: 레퍼런스는 FAQ 제목이 **여러 줄 H3**; 프로젝트는 좌측 이미지 + `Clarifications©` 2열. 아코디언 `+` 회전은 유사.

### 4.7 Footer

| 항목 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 상단 캐러셀 | **인물 스톡** 카드 (Car Alone, Man, Woman…) | **프로젝트 썸네일** 카드 |
| 태그 | Independent, Brand Focus… | + `Seoul, 한국` 추가 |
| Back to Top | 있음 | `Back to Top ↑` ✅ |
| ©2026 | 초대형 | ✅ |

---

## 5. Motion & 인터랙션

### 5.1 전역

| 효과 | 레퍼런스 | 프로젝트 | 차이 |
|------|----------|----------|------|
| 스무스 스크롤 | Framer 내장 | **Lenis** (`SmoothScroll.tsx`) | 느낌 유사, 물리값 튜닝 필요할 수 있음 |
| 첫 로드 | 즉시 또는 Framer 트랜지션 | **PageLoader** 1.6s + 슬라이드 업 (`PageLoader.tsx`) | **프로젝트만 존재** |
| 페이지 전환 | Framer 라우트 전환 | `template.tsx` fade (AnimatePresence 미연결 가능) | 완전 동일 여부 불확실 |
| OS 커서 숨김 | 가능 | `cursor: none` + 커스텀 커서 ✅ |

### 5.2 Hero

| 효과 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 진입 | 줄별·요소별 stagger (추정) | `opacity` + `y` stagger (`motion.span`, `h1`) |
| 스크롤 | 텍스트·이미지 패럴랙스 | `useTransform` text `-30%`, image `+15%`, opacity fade ✅ |
| Marquee | 하단 키워드 흐름 | `Marquee` 컴포넌트, speed 50 ✅ |

### 5.3 Header

| 효과 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| Nav hover | 글자 롤링 | `RollingText` 글자별 25ms delay ✅ |
| 스크롤 시 | 고정 | 아래 스크롤 시 **헤더 숨김** (`y: -100%`) — 레퍼런스에 없을 수 있음 |

### 5.4 Featured Works / Work 카드

| 효과 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 스크롤 진입 | fade / stagger | `whileInView` `y: 40 → 0` ✅ |
| 호버 | 이미지 확대·커서 변화 | `scale-105` + cursor `view` ✅ |
| Work 목록 | split + hover preview | `WorkGrid.tsx` sticky preview ✅ |

### 5.5 Services

| 효과 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 행 hover | 강조·나머지 dim | `opacity: 0.35` dim ✅ |
| 가로 마르퀴 | 서비스명 반복 슬라이드 | **없음** |

### 5.6 Profile

| 효과 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 본문 reveal | 스크롤 하이라이트 (추정) | `ScrollRevealText` 단어별 opacity ✅ |
| Practice | 글자 스택 + 스크롤 | **없음** |

### 5.7 FAQ

| 효과 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 아코디언 | 펼침/접힘 | `AnimatePresence` height + `+` 45° 회전 ✅ |

### 5.8 Footer

| 효과 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 카드 캐러셀 | 무한 가로 스크롤 | CSS `marquee-scroll` 30s ✅ |

---

## 6. 헤더 & 네비게이션

| 항목 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 좌측 | 로고/아바타 | 원형 아바타 `/images/avatar.jpg` |
| 중앙 | Quick Links: Home, Gallery, Work, Contact | 동일 ✅ |
| 우측 | Based in Delhi… | Based in Seoul… |
| 메뉴 애니메이션 | Rolling / hover | `RollingText` ✅ |

---

## 7. 서브 페이지

| 페이지 | 레퍼런스 | 프로젝트 | 차이 |
|--------|----------|----------|------|
| `/work` | 프로젝트 그리드/리스트 | Split + hover preview | 구조 근접 |
| `/work/[slug]` | 케이스 스터디 상세 | MDX 상세 + hero | 콘텐츠·이미지 placeholder |
| `/gallery` | 비주얼 갤러리 | 6칸 placeholder 그리드 | **미완** |
| `/contact` | Contact 폼 | `ContactForm` + Resend 연동 | 레이아웃 유사, 검증 필요 |

---

## 8. 콘텐츠·카피 차이 (의도적 포함)

| 항목 | 레퍼런스 | 프로젝트 |
|------|----------|----------|
| 거주지 | Delhi, india | Seoul, Korea |
| Experience 지역 | Delhi, New York 등 | Seoul 등 |
| FAQ | Figma·개발·턴어라운드 중심 6문항 | 포트폴리오 맞춤 6문항 (다른 질문) |
| Editorial 라벨 | © Curated Interfaces… | 유사하나 문구·일본어 표기 일부 상이 |

---

## 9. 프로젝트에만 있는 기능

- **PageLoader** (sessionStorage로 1회만)
- **Lenis** 스무스 스크롤
- **Zustand** 커서 상태 (`default` / `pointer` / `view`)
- **Next.js** 라우팅·MDX·Contact Server Actions
- **헤더 스크롤 다운 시 숨김**

---

## 10. 우선순위별 정합화 제안

### P0 — 레퍼런스 정체성에 큰 영향

1. **Practice.** 글자 분해 + 스크롤 모션 섹션 추가  
2. **Experience 탭** (Freelance / Agency / Studio / Client)  
3. Hero 헤드라인 **4줄 분리** + 줄별 진입 애니메이션  
4. **EditorialDivider** → 가로 스크롤 마르퀴 띠로 변경 (WDX® 라벨 포함 검토)  
5. Featured Works **인트로 문단** + CTA `SEE WORKS`  
6. Services 섹션 제목 **`Services` + `(6)`** 및 레이아웃 재검토  

### P1 — 시각·타이포

7. Inter → 레퍼런스에 가까운 **커스텀 웹폰트** (예: geometric sans)  
8. placeholder 이미지 → 실 asset 교체  
9. Featured Works **프로젝트 순서** 레퍼런스와 동일화  

### P2 — 폴리시

10. Hero 마르퀴에 **Web Design** 추가  
11. Profile 섹션 **SEE WORKS** CTA  
12. FAQ 질문·제목 레퍼런스 문구 정렬 (또는 의도적 차이 문서화)  
13. Footer 캐러셀 **인물/비주얼** vs 프로젝트 썸네일 선택  
14. PageLoader·헤더 hide on scroll — 레퍼런스와 맞출지 결정  

---

## 11. 참고 파일 (프로젝트)

| 영역 | 경로 |
|------|------|
| 홈 조립 | `apps/portfolio/app/page.tsx` |
| Hero | `apps/portfolio/src/features/home/HeroSection.tsx` |
| Featured | `apps/portfolio/src/features/home/FeaturedWorks.tsx` |
| Services | `apps/portfolio/src/features/home/ServicesSection.tsx` |
| Profile/Experience | `apps/portfolio/src/features/home/ProfileSection.tsx` |
| FAQ | `apps/portfolio/src/features/home/FAQSection.tsx` |
| 구분선 | `apps/portfolio/src/components/EditorialDivider.tsx` |
| 전역 스타일 | `apps/portfolio/app/globals.css`, `apps/portfolio/app/layout.tsx` |
| Motion 공통 | `Marquee.tsx`, `RollingText.tsx`, `CustomCursor.tsx`, `SmoothScroll.tsx` |

---

*본 문서는 레퍼런스 사이트 공개 HTML·프로젝트 소스 코드 정적 분석을 기준으로 작성되었습니다. Framer 런타임의 세밀한 easing·breakpoint 값은 브라우저 개발자 도구로 추가 측정하면 pixel-perfect 튜닝에 도움이 됩니다.*
