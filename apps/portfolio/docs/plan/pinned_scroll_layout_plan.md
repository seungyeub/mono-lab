# CSS Sticky Layout Architecture Plan

> **작성일:** 2026-06-22
> **Title:** CSS Sticky Layout 구조 개편 계획
> **Description:** 자바스크립트 기반의 스크롤 제어를 제거하고 순수 CSS Sticky를 도입하여 성능 및 뷰포트 반응형 이슈를 해결하는 구조.

## 1. 개요 및 목적 (Purpose)

### 1.1. 배경 및 문제점

현재 포트폴리오 사이트는 넓은 상하 여백과 유려한 스크롤 흐름을 제공하고 있습니다. 하지만 **가용 높이가 짧은 기기(iPad 가로 모드, 13인치 소형 노트북 등)**에서는 데스크톱 기준의 거대한 마진 때문에 다음과 같은 치명적인 UX 이슈가 발생했습니다.

- `HeroSection`의 하단 버튼이 뷰포트 밖으로 밀림.
- `WorksSection`의 좌측 텍스트 영역이 화면 세로 길이를 초과하여 버튼이 잘림.

이를 해결하기 위해 초기에 자바스크립트 기반의 Pinned Scroll 방식을 고안했으나, 모바일 반응형의 복잡성과 스크롤 점프 현상 등 퍼포먼스 저하가 심각했습니다.

### 1.2. 최종 목적 및 방향 (Pure CSS Sticky)

자바스크립트의 강제 스크롤 개입을 100% 제거하고, 브라우저 네이티브 기술인 **Pure CSS Sticky** 방식으로 전면 개편합니다.

- **성능 최적화:** 무거운 JS 프레이머 모션 연산을 걷어내어 부드러운 네이티브 스크롤 보장.
- **완벽한 뷰포트 대응:** 좌측 텍스트를 `h-screen` 컨테이너 내에서 Sticky 고정시켜 모니터 크기에 상관없이 완벽하게 뷰포트 내에 안착시킵니다.
- **자연스러운 패럴랙스:** 한쪽은 고정되고 다른 한쪽은 자연스럽게 스크롤되는 에디토리얼 디자인 패턴을 완성합니다.

---

## 2. 핵심 아키텍처 (Architecture)

### 2.1. 작동 원리 (Pure CSS)

- **Flex 스택:** 메인 컨테이너를 `flex-col lg:flex-row` 구조로 구성.
- **화면 고정 (Sticky):** 고정되어야 할 텍스트 컬럼에 `lg:sticky lg:top-0 lg:h-screen`을 부여. 내부에 `flex justify-center`를 주어 텍스트를 정중앙에 고정.
- **자연 스크롤:** 옆에 있는 카드 리스트(우측 컬럼)는 본연의 길이대로 두어, 카드를 모두 훑어보는 동안 브라우저 기본 스크롤이 작동하도록 함. 카드가 끝나면 부모 섹션이 끝나면서 Sticky 요소도 자연스럽게 함께 밀려 올라감.

### 2.2. 불필요한 파일 삭제 완료

- [x] `PinnedScrollWrapper.tsx` : JS 기반의 강제 래핑 컨테이너 삭제 완료. 앞으로 모든 섹션에 Pure CSS 방식 재사용.

---

## 3. 섹션별 리팩토링 계획 (Section Refactoring)

### 3.1. WorksSection (최우선 개편 - 완료)

- 좌측 텍스트(Works. 타이틀 및 버튼)는 `h-screen` 안에서 화면 중앙에 고정.
- 우측 프로젝트 카드 리스트는 본연의 높이대로 브라우저 기본 스크롤을 탑니다.

### 3.2. SkillsSection (신규 제작 중인 섹션 연동)

- 화면 상단(또는 좌측)에 `Skills.` 타이틀과 카테고리 탭(TagBar)이 고정(Sticky)됩니다.
- 사용자가 스크롤을 내리면 50개의 스킬 아이콘 무리가 부드럽게 흘러가듯 이동합니다.
- (선택) 개별 카테고리(Frontend, Backend 등) 묶음이 화면 중앙을 지날 때마다, TagBar의 활성화 상태가 변하도록 스크롤 스파이(Scroll Spy)를 가볍게 연동합니다.

### 3.3. ExperienceSection & FAQSection

- `WorksSection`과 동일한 CSS Sticky 레이아웃 아키텍처를 재사용합니다.
- 좌측 타이틀 텍스트를 고정시키고 우측 리스트 항목들을 스크롤시킵니다.

---

## 4. 진행 단계 (Execution Roadmap)

> **Phase 1: 기반 아키텍처 재설계 (Foundation) - 완료**

- [x] JS 기반 Pinned Scroll 방식을 폐기하고 Pure CSS Sticky 방식으로 방향 선회.
- [x] 레거시 `PinnedScrollWrapper` 파일 삭제 완료.

> **Phase 2: 핵심 컴포넌트 적용 (WorksSection 개편) - 완료**

- [x] 가장 복잡한 `WorksSection`을 네이티브 CSS `position: sticky` 기반으로 전면 리팩토링.
- [x] 좌측 고정 영역: `lg:sticky lg:top-0 lg:h-screen` 및 내부 중앙 정렬 적용. (translate-y로 인한 클리핑 버그 차단)
- [x] 우측 카드 영역: 시작 높이(`lg:pt-[8vh]`)를 조절하여 좌측 텍스트와 균형잡힌 수직 리듬(Vertical Rhythm) 완성. (Hero 섹션 높이 축소에 맞춰 20vh에서 8vh로 최적화 완료)
- [x] `SectionLabel`: `sticky top-0` 적용. 컴포넌트 내부 여백을 활용하여 화면 상단에 완벽히 고정됨.
- [x] 모바일 대응: `flex-col` 구조에서 CSS가 자연스럽게 동작하며 모바일 이슈 완벽 해결.

> **Phase 3: 기존 롱폼 데이터 섹션 개편 (Experience) - 완료(불필요)**

- [x] `ExperienceSection` 적용: 2단 레이아웃 전환은 취소되었으며, `SectionLabel` 자체에 전역 Sticky 로직을 내장함으로써 별도 수정 없이 목표를 달성함.
- [x] `FAQSection` 적용: FAQ 섹션은 현재 1단 Full-width 레이아웃 리디자인 실험 및 글로벌 폰트 스케일업 결정 대기 상태이므로 적용 대상에서 제외. (자세한 내용은 `faq_section_redesign.md` 참조)

> **Phase 4: 인트로 및 전환 영역 (Hero & Brand) - 완료**

- [x] `HeroSection`의 뷰포트 대응 방식 최적화 (불필요한 `100dvh` 강제 할당 제거).
- [x] 100vh 초과 렌더링(Overflow) 이슈 해결: 상하단 불필요한 마진/패딩 축소 및 3D 캔버스 최소 높이(`min-h`) 조정을 통해 스크롤 없이 한 화면에 온전히 담기도록 최적화.
- [x] HeroSection 레이아웃 개선: 헤더 아래 여백(`pt-100px`, `mt-12`)을 전면 삭제하고 래퍼의 `flex-1`을 없애 Marquee를 콘텐츠에 밀착시켰으며, 최종적으로 `min-h-[100dvh]` 속성 자체를 삭제하여 Hero 섹션 하단에 방치되던 거대한 빈 공간을 제거, 바로 다음 Works Section과 자연스럽게 연결되도록 단절 현상 완벽 해결.
- [x] 디테일 폴리싱(User): 마진 대신 부모 컨테이너의 `gap` 속성을 활용하여 그리드와 Marquee 사이를 안정적으로 제어하고, Contact 버튼 마진을 축소하여 응집력을 높임.

> **Phase 5: 최적화 및 QA (Polishing) - 완료**

- [x] **접근성(A11y):** 모든 인터랙티브 요소(`RollingLink`, `ProjectCard`의 `Link`)가 시맨틱한 `<a>` 태그로 렌더링되며, DOM 트리의 순서대로 자연스러운 탭(Tab) 키 포커스 이동이 지원되는 것을 코드 레벨에서 확인 완료. (Sticky 속성은 시각적 배치만 변경할 뿐, HTML DOM 순서를 해치지 않으므로 접근성에 영향을 주지 않음)

> **Phase 6: 신규 섹션 네이티브 구축 (SkillsSection)**

- [ ] 새로 개발할 `SkillsSection` 역시 처음부터 CSS Sticky 레이아웃 기반으로 설계.
- [ ] 50개의 스킬 아이콘 Grid가 자연 스크롤되는 동안 `Skills.` 타이틀 고정.

---

## 4. 고려사항 및 잠재적 리스크 (Risks & Mitigations)

1.  **스크롤 스파이 연동:** FAQ나 Skills 등에서 우측 아이템이 스크롤될 때 좌측의 특정 타이틀이나 탭이 하이라이트 되어야 한다면, Framer Motion의 `useScroll` 대신 가벼운 `IntersectionObserver` 훅을 활용하여 상태 변화를 처리해야 합니다.
2.  **레이아웃 높이 계산:** CSS Sticky는 부모 컨테이너의 높이 안에서만 동작하므로, 부모 컨테이너가 항상 자식들(특히 고정되지 않고 스크롤되는 컨텐츠)의 충분한 높이를 확보하고 있는지 확인해야 합니다.
