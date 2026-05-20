# Phase 6 — Stage 2: Hero 2단 레이아웃 + Marquee 띠

## 작업 목표
기존 단일 컬럼 Hero를 Helios 레퍼런스처럼
좌측 타이포그래피 + 우측 이미지 슬롯 + 하단 Marquee 띠 구조로 재구성.

## 생성·수정한 파일

### [NEW] `src/components/Marquee.tsx`
- CSS `@keyframes marquee-scroll` (`translateX(0 → -50%)`) 무한 반복
- items 배열을 두 벌 복사하여 seamless loop 구현 (끊김 없음)
- `speed` prop으로 속도 조절 → `트랙 너비 / speed = duration(초)` 자동 계산
- `separator` prop (기본: ✦), `textClassName` prop 커스터마이징 가능

### [MODIFY] `src/features/home/HeroSection.tsx`
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

## 이미지 경로 안내
| 슬롯 | 경로 |
|---|---|
| 우측 Hero 이미지 | `public/images/hero.jpg` |
