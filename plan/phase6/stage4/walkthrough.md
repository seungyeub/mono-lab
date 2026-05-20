# Phase 6 — Stage 4: Work 목록 Split 레이아웃

## 작업 목표
기존 단순 그리드(`grid-cols-2`)를 Helios 레퍼런스처럼
좌측 sticky 정보 패널 + 우측 리스트 카드 Split 레이아웃으로 전환.

## 수정한 파일

### [MODIFY] `src/features/work/WorkGrid.tsx` (WorkList로 실질 리팩토링)

#### 구조 변경
- `grid grid-cols-2` → `flex flex-row` (split: left fixed + right flex-1)

#### 좌측 패널 (desktop 전용, sticky)
- `sticky top-32` 고정
- 프로젝트 총 개수 대형 표시: `(04)`
- 카테고리 키워드 목록 (Brand Identity, Logo Design, Visual Systems)
- **hover 미리보기**: 마우스가 특정 프로젝트 위에 있을 때 해당 썸네일이 좌측 패널에 fade-in

#### 우측 리스트 카드
각 row 구성:
```
(01)  Rootwise Architects            Visual Identity   ↗
(02)  Meltdown Studios               Visual Identity   ↗
```
- hover 시 제목이 `translate-x-2`로 살짝 오른쪽으로 이동
- hover 시 다른 항목 `opacity: 0.3` dim 처리
- hover 시 커서 `view` 타입 + 좌측 미리보기 이미지 표시
- 화살표(`↗`) hover 시 `text-white` + `translate-x-1`

#### 모바일 대응
- 좌측 패널 `hidden md:flex`으로 숨김
- 각 row 우측에 작은 썸네일 (`w-16 h-16`) 인라인 표시

### [MODIFY] `app/work/page.tsx`
- 페이지 상단: 제목(`h1`) + 설명(`p`) 좌우 배치
- 하단 Border로 헤더와 컨텐츠 구분
- `WorkGrid` 컴포넌트 (내부적으로 리스트 UI) 렌더링
- SEO용 `metadata` 추가
