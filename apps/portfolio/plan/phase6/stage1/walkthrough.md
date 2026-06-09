# Phase 6 — Stage 1: Header 레이아웃 + Rolling Text

## 작업 목표

기존 이미지 로고 + 우측 nav 구조를 Helios 레퍼런스와 동일한 3단 구조로 전환.
네비게이션 링크에 글자별 stagger 롤링 애니메이션 적용.

## 생성·수정한 파일

### [NEW] `src/components/RollingText.tsx`

- 각 글자를 `.char-wrap`으로 독립 래핑
- Top layer: hover 시 `-translate-y-full` (위로 사라짐)
- Bottom layer: `translate-y-full → 0` (아래서 올라옴)
- 글자마다 `transitionDelay: i * 25ms` 적용 → 좌→우 파동 효과
- `group/roll` Tailwind group variant로 부모 hover 감지

### [MODIFY] `src/features/layout/Header.tsx`

- **구조 변경**: 단일 flex → `grid-cols-[auto_1fr_auto]` 3단 그리드
- **좌측**: `<Link>` 원형 아바타 이미지 (`/images/avatar.jpg`, fallback 처리)
- **중앙**: "Quick Links" 라벨 + NAV_LINKS 배열 기반 RollingText 링크
- **우측**: "Based in Seoul, 한국 / Logo / Brand Designer" 메타텍스트
- 헤더 내 모든 링크에서 `setCursorType` 핸들러 제거 (커서 확대 없음)
- `useCursorStore` import 제거 (미사용)

### [MODIFY] `app/globals.css`

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

## 주요 결정 사항

- 헤더 메뉴 hover 시 커서 확대 없음 (레퍼런스 동일)
- 아바타 이미지 경로: `public/images/avatar.jpg` (사용자가 직접 준비)
