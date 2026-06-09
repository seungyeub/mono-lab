# Phase 6 — Stage 3: 커서 VIEW + Capabilities Dim + 페이지 로더

## 작업 목표

1. 프로젝트 썸네일 hover 시 커서에 "VIEW" 텍스트 표시
2. Capabilities 섹션 hover 시 비활성 항목 dim 처리
3. 첫 방문 시 페이지 로딩 오버레이 추가

## 생성·수정한 파일

### [MODIFY] `src/store/useCursorStore.ts`

- `CursorType` 유니온에 `'view'` 추가: `'default' | 'pointer' | 'view'`

### [MODIFY] `src/features/layout/CustomCursor.tsx`

- **view 상태**: 직경 80px, 흰색 원, 중앙에 검정 `"VIEW"` 텍스트
- **pointer 상태**: 직경 48px (기존 동일)
- **default 상태**: 직경 16px (기존 동일)
- `AnimatePresence`로 "VIEW" 텍스트 fade in/out 처리
- `animate` 객체로 직접 속성 제어 (variants 대신)

### [MODIFY] `src/features/home/FeaturedWorks.tsx`

- 썸네일 링크 `onMouseEnter`: `'pointer'` → `'view'`

### [MODIFY] `src/features/work/WorkGrid.tsx`

- 썸네일 링크 `onMouseEnter`: `'pointer'` → `'view'`

### [MODIFY] `src/features/home/ServicesSection.tsx`

- `hoveredIndex: number | null` 상태 추가
- 각 항목 `onMouseEnter/Leave`로 hoveredIndex 업데이트
- `isDimmed = hoveredIndex !== null && hoveredIndex !== index`
- dim 처리: `opacity: 0.35, transition: 'opacity 0.25s ease'`

### [NEW] `src/components/PageLoader.tsx`

- 첫 방문 시 검정 배경 오버레이 + 흰 스피너 1.6초 표시
- `sessionStorage.getItem('hasLoaded')`로 같은 세션 재방문 스킵
- `exit: { y: '-100%' }` 슬라이드 업 애니메이션으로 reveal

### [MODIFY] `app/layout.tsx`

- `<PageLoader />` 추가 (`<CustomCursor />` 앞에 배치)
- `metadata.title`: "Brand Designer Portfolio"
- `metadata.description`: Helios 테마 문구로 업데이트
