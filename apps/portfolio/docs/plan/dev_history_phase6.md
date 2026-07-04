# Phase 6: 디자인 폴리싱 — 개발 히스토리

Phase 5 완료 이후 진행한 고도화 작업 기록입니다. 총 4개 Stage로 구성됩니다.

---

## Stage 1: Header 레이아웃 + Rolling Text

### 작업 목표

기존 이미지 로고 + 우측 nav 구조를 Helios 레퍼런스와 동일한 3단 구조로 전환.
네비게이션 링크에 글자별 stagger 롤링 애니메이션 적용.

### 생성·수정한 파일

#### [NEW] `src/components/RollingText.tsx`

- 각 글자를 `.char-wrap`으로 독립 래핑
- Top layer: hover 시 `-translate-y-full` (위로 사라짐)
- Bottom layer: `translate-y-full → 0` (아래서 올라옴)
- 글자마다 `transitionDelay: i * 25ms` 적용 → 좌→우 파동 효과
- `group/roll` Tailwind group variant로 부모 hover 감지

#### [MODIFY] `src/features/layout/Header.tsx`

- **구조 변경**: 단일 flex → `grid-cols-[auto_1fr_auto]` 3단 그리드
- **좌측**: `<Link>` 원형 아바타 이미지 (`/images/avatar.jpg`, fallback 처리)
- **중앙**: "Quick Links" 라벨 + NAV_LINKS 배열 기반 RollingText 링크
- **우측**: "Based in Seoul, 한국 / Logo / Brand Designer" 메타텍스트
- 헤더 내 모든 링크에서 `setCursorType` 핸들러 제거 (커서 확대 없음)
- `useCursorStore` import 제거 (미사용)

#### [MODIFY] `app/globals.css`

```css
a,
button,
input,
textarea,
select,
label,
[role='button'] {
  cursor: none !important;
}
```

- `cursor: none`을 body에만 두면 브라우저가 링크 위에서 pointer를 복원
- 모든 인터랙티브 요소에 명시적으로 `cursor: none !important` 추가

### 주요 결정 사항

- 헤더 메뉴 hover 시 커서 확대 없음 (레퍼런스 동일)
- 아바타 이미지 경로: `public/images/avatar.jpg` (사용자가 직접 준비)

---

## Stage 2: Hero 2단 레이아웃 + Marquee 띠

### 작업 목표

기존 단일 컬럼 Hero를 Helios 레퍼런스처럼
좌측 타이포그래피 + 우측 이미지 슬롯 + 하단 Marquee 띠 구조로 재구성.

### 생성·수정한 파일

#### [NEW] `src/components/Marquee.tsx`

- CSS `@keyframes marquee-scroll` (`translateX(0 → -50%)`) 무한 반복
- items 배열을 두 벌 복사하여 seamless loop 구현 (끊김 없음)
- `speed` prop으로 속도 조절 → `트랙 너비 / speed = duration(초)` 자동 계산
- `separator` prop (기본: ✦), `textClassName` prop 커스터마이징 가능

#### [MODIFY] `src/features/home/HeroSection.tsx`

- **레이아웃**: `grid-cols-1 md:grid-cols-2` 2단 그리드
- **좌측**:
  - 상단 메타: "Based in Seoul, 한국" / "Logo / Brand Designer" (fade-in)
  - 메인 h1: `clamp(2rem, 5.5vw, 5rem)` 유동 폰트 크기
  - 헤드라인: "Crafting Identities and Systems that Define and Build a Lasting Brand. イメージ."
  - CTA: "Contact" 버튼 (rounded-full 테두리 스타일)
- **우측**: 이미지 슬롯 `/images/hero.jpg` (없으면 placeholder 표시)
- **스크롤 패럴랙스**:
  - 좌측 텍스트: `y: 0% → -30%`, `opacity: 1 → 0`
  - 우측 이미지: `y: 0% → +15%` (반대 방향으로 분리된 깊이감)
- **하단**: `<Marquee>` 컴포넌트 (speed=50)

### 이미지 경로 안내

| 슬롯             | 경로                     |
| ---------------- | ------------------------ |
| 우측 Hero 이미지 | `public/images/hero.jpg` |

---

## Stage 3: 커서 VIEW + Capabilities Dim + 페이지 로더

### 작업 목표

1. 프로젝트 썸네일 hover 시 커서에 "VIEW" 텍스트 표시
2. Capabilities 섹션 hover 시 비활성 항목 dim 처리
3. 첫 방문 시 페이지 로딩 오버레이 추가

### 생성·수정한 파일

#### [MODIFY] `src/store/useCursorStore.ts`

- `CursorType` 유니온에 `'view'` 추가: `'default' | 'pointer' | 'view'`

#### [MODIFY] `src/features/layout/CustomCursor.tsx`

- **view 상태**: 직경 80px, 흰색 원, 중앙에 검정 `"VIEW"` 텍스트
- **pointer 상태**: 직경 48px (기존 동일)
- **default 상태**: 직경 16px (기존 동일)
- `AnimatePresence`로 "VIEW" 텍스트 fade in/out 처리
- `animate` 객체로 직접 속성 제어 (variants 대신)

#### [MODIFY] `src/features/home/FeaturedWorks.tsx`

- 썸네일 링크 `onMouseEnter`: `'pointer'` → `'view'`

#### [MODIFY] `src/features/work/WorkGrid.tsx`

- 썸네일 링크 `onMouseEnter`: `'pointer'` → `'view'`

#### [MODIFY] `src/features/home/ServicesSection.tsx`

- `hoveredIndex: number | null` 상태 추가
- 각 항목 `onMouseEnter/Leave`로 hoveredIndex 업데이트
- `isDimmed = hoveredIndex !== null && hoveredIndex !== index`
- dim 처리: `opacity: 0.35, transition: 'opacity 0.25s ease'`

#### [NEW] `src/components/PageLoader.tsx`

- 첫 방문 시 검정 배경 오버레이 + 흰 스피너 1.6초 표시
- `sessionStorage.getItem('hasLoaded')`로 같은 세션 재방문 스킵
- `exit: { y: '-100%' }` 슬라이드 업 애니메이션으로 reveal

#### [MODIFY] `app/layout.tsx`

- `<PageLoader />` 추가 (`<CustomCursor />` 앞에 배치)
- `metadata.title`: "Brand Designer Portfolio"
- `metadata.description`: Helios 테마 문구로 업데이트

---

## Stage 4: Work 목록 Split 레이아웃

### 작업 목표

기존 단순 그리드(`grid-cols-2`)를 Helios 레퍼런스처럼
좌측 sticky 정보 패널 + 우측 리스트 카드 Split 레이아웃으로 전환.

### 수정한 파일

#### [MODIFY] `src/features/work/WorkGrid.tsx` (WorkList로 실질 리팩토링)

**구조 변경**

- `grid grid-cols-2` → `flex flex-row` (split: left fixed + right flex-1)

**좌측 패널 (desktop 전용, sticky)**

- `sticky top-32` 고정
- 프로젝트 총 개수 대형 표시: `(04)`
- 카테고리 키워드 목록 (Brand Identity, Logo Design, Visual Systems)
- **hover 미리보기**: 마우스가 특정 프로젝트 위에 있을 때 해당 썸네일이 좌측 패널에 fade-in

**우측 리스트 카드**

각 row 구성:

```text
(01)  Rootwise Architects            Visual Identity   ↗
(02)  Meltdown Studios               Visual Identity   ↗
```

- hover 시 제목이 `translate-x-2`로 살짝 오른쪽으로 이동
- hover 시 다른 항목 `opacity: 0.3` dim 처리
- hover 시 커서 `view` 타입 + 좌측 미리보기 이미지 표시
- 화살표(`↗`) hover 시 `text-white` + `translate-x-1`

**모바일 대응**

- 좌측 패널 `hidden md:flex`으로 숨김
- 각 row 우측에 작은 썸네일 (`w-16 h-16`) 인라인 표시

#### [MODIFY] `app/work/page.tsx`

- 페이지 상단: 제목(`h1`) + 설명(`p`) 좌우 배치
- 하단 Border로 헤더와 컨텐츠 구분
- `WorkGrid` 컴포넌트 (내부적으로 리스트 UI) 렌더링
- SEO용 `metadata` 추가
