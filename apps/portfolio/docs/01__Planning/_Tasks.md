# Tasks

> 현재 프로젝트의 핵심 진행 상황만 관리합니다.

---

## Next

가장 먼저 해야 하는 작업 — Phase 5 PRD(`docs/plan/2026-08-18_phase5_prd.md`) 기준

### 🟡 P2 — Nice to Have (품질 향상)

- [x] P2-1. Header 우측 "Based in Seoul" 콘텐츠 결정 — 강조 뒤집기(직군 굵게 / 위치 회색)로 확정
- [x] P2-2. 커스텀 아이콘 17개 정리 — 10개는 이미 설치된 `@icons-pack/react-simple-icons`로 교체, 래스터 2개는 144px WebP로 재생성. 2.6MB → 52KB. `aws`·`mssql` 브랜드 정확성은 미해결
- [x] P2-3. StoryAnimation 컴포넌트 — 배치하지 않고 제거로 확정
- [ ] P2-4. 포트폴리오 저장소(mono-lab) 자체를 프로젝트로 등재 (계획 수립 완료 — `docs/plan/2026-09-03_mono-lab-project-card.md`)
- [ ] P2-5. 검색 가시성 인프라 구축 — sitemap·robots·OG·JSON-LD·`h1` 계층 정리 (P3-3 `lang='ko'` 포함). 0.2.0 점검에서 모두 404·미구현 확인

### 🟢 P3 — Backlog (선택적/폴리싱)

- [ ] P3-1. 데스크톱 폰트 스케일업 최종 결정
- [ ] P3-2. Skills Section 구분선(White Line) 제거 여부 결정
- [ ] P3-3. `<html lang='en'>` 불일치 수정 → P2-5에서 함께 처리
- [ ] P3-4. 폴더 구조 정리 (Next.js 베스트 프랙티스 기준)
- [ ] P3-5. HeroSection 하단 Marquee 디자인 개선
- [ ] P3-8. 릴리스 자동화 도입 검토 (Changesets vs release-please) — `docs/plan/2026-09-03_release-automation.md`
- [ ] P3-6. 디자인 토큰 체계 정비 (색상 `bg-[#1a1a1a]` + 타이포 `text-[10px]`·`tracking-[0.2em]` + spacing `pt-[140px]` 토큰 신규 정의 후 일괄 교체) — 실행 목록은 [이슈 #53](https://github.com/seungyeub/mono-lab/issues/53)

---

## In Progress

현재 진행 중

- [ ] (진행 중인 항목 없음)

---

## Waiting

외부 일정이나 다른 작업을 기다리는 항목

- [ ] (대기 중인 항목 없음)

---

## Completed

완료한 중요한 작업

- [x] 2026-05-18 — TaskMaster MCP 환경 설정 테스트 (Antigravity 1.0)
- [x] 2026-05-19 — 기존 `portfolio` 프로젝트와 Helios 레퍼런스 비교 분석
- [x] 2026-05-19 — 기존 프로젝트 수정 포기 → `mono-lab` 신규 프로젝트 전환 결정
- [x] 2026-05-19 — Helios 레퍼런스 기반 PRD 작성 (`portfolio2/PRD.md`)
- [x] 2026-05-19 — Turborepo + pnpm 모노레포 구조 도입 결정
- [x] 2026-05-19 — `frontend-foundation` 템플릿 GitHub 레포 세팅 및 push
- [x] 2026-05-20 — Phase 1: 초기 세팅 (`frontend-foundation` 기반, 핵심 라이브러리 설치)
- [x] 2026-05-20 — Phase 2: 공통 레이아웃 (Header, Footer, CustomCursor, SmoothScroll/Lenis)
- [x] 2026-05-20 — Phase 3: 랜딩 페이지 섹션 (HeroSection, FeaturedWorks, ServicesSection)
- [x] 2026-05-20 — Phase 3.5: Helios 테마 전면 리팩토링 (콘텐츠/레이아웃 전환)
- [x] 2026-05-20 — Phase 4: MDX 파이프라인 구축 + Work/Gallery 서브 페이지
- [x] 2026-05-20 — Phase 5: Contact 폼 (React Hook Form + Zod + Resend) + 페이지 트랜지션
- [x] 2026-05-20 — Phase 6 Stage 1: Header 3단 그리드 + RollingText 글자 애니메이션
- [x] 2026-05-20 — Phase 6 Stage 2: Hero 2단 레이아웃 + Marquee 띠
- [x] 2026-05-20 — Phase 6 Stage 3: 커서 VIEW 상태 + Capabilities Dim + PageLoader
- [x] 2026-05-20 — Phase 6 Stage 4: Work 목록 Split 레이아웃 (sticky 좌측 패널 + 우측 리스트)
- [x] 2026-05-20 — Phase 6 Stage 5~6: BrandSection, FAQ 아코디언, ScrollRevealText, 반응형 보완
- [x] 2026-05-20 — `mono-lab` initial commit (Phase 1~6 전체 포함)
- [x] 2026-05-21 — PR #1: Helios 스타일 Header 재구성 + 공유 레이아웃 쉘
- [x] 2026-05-21 — PR #2: Favicon 에셋 및 메타데이터 아이콘 추가
- [x] 2026-05-23 — PR #3: 폰트 설정 변경 + Footer/Marquee 컴포넌트 구현
- [x] 2026-05-24 — PR #4: 폰트/스타일 시스템 개편 + 공통 컴포넌트 리팩토링
- [x] 2026-05-26 — PR #5: 경력/자격증 섹션 레이아웃 개선 + 공통 컴포넌트 모듈화
- [x] 2026-05-27 — PR #6: ScrollRevealText 기능 확장 + 반응형 개선
- [x] 2026-06-09 — PR #7: 3D Interactive Card 통합 (InteractiveCardCanvas, ID-Card.glb, Lanyard.png)
- [x] 2026-06-10 — PR #8: CI/CD 파이프라인 구축 (GitHub Actions, SonarCloud, CodeRabbit, Jest)
- [x] 2026-06-19 — PR #9: Lighthouse + Playwright 자동화 테스트 구축 (VRT 기준점 최초 등록)
- [x] 2026-06-20 — PR #10: FAQ 섹션 1단 레이아웃 개편 + CI/CD 안정화 (Zod v3 롤백)
- [x] 2026-06-21 — Skills Section 기획 완료 (`skills_section_plan.md` v2 확정)
- [x] 2026-06-21 — Skills Section Phase 1: `@icons-pack/react-simple-icons` 패키지 설치
- [x] 2026-06-21 — Skills Section Phase 1: 커스텀 SVG 7개 생성 (`public/icons/`)
- [x] 2026-06-21 — Skills Section Phase 1: `skillsData.ts` 생성 (5 카테고리, 50 항목)
- [x] 2026-06-21 — Skills Section Phase 2: `SkillIcon.tsx`, `SkillGrid.tsx`, `SkillChips.tsx` 구현
- [x] 2026-06-21 — Skills Section Phase 3: `SkillsSection.tsx` 완성 + `page.tsx` 삽입
- [x] 2026-06-22 — PR #11: CSS Sticky 레이아웃 전면 개편 + VRT 자동화 파이프라인 구축
- [x] 2026-06-22 — PR #12: 전역 레이아웃 충돌 해결 + 컴포넌트 단위 VRT 아키텍처 원복
- [x] 2026-06-23 — Skills Section Phase 4: 레이아웃(Chips) 및 색상(Brand) 최종 확정
- [x] 2026-06-23 — Skills Section Phase 4: 비교 토글 UI 제거 및 `SkillGrid` 컴포넌트 삭제
- [x] 2026-07-11 — Skills Section Phase 4: 최종 반응형/애니메이션 최적화 (단일 컴포넌트 처리)
- [x] 2026-07-11 — Skills Section Phase 4: Playwright VRT 기준점 갱신 및 PR 병합 완료
- [x] 2026-07-12 — PR #37: v0.1.4 UI 버그 픽스 (iOS 스크롤 충돌, 커서 숨김, Framer `once` 버그), 테스트 명세서 전면 리팩토링 및 VRT 스냅샷 갱신
- [x] 2026-07-20 — PR #38: Footer 캐러셀을 외부 GIF 기반 무한 스크롤로 전환 (81개 GIF, `carouselGifs.ts` 분리)
- [x] 2026-07-20 — PR #39: 커서 마이크로카피 `Drag`→`Grab` 변경, 타입 안전성 강화 (`any` 제거), StoryAnimation 신규 추가
- [x] 2026-08-18 — PR #40: ExperienceSection 데이터 리팩토링 (`stack`→`type` 속성명 변경, 오타 수정, 공용 테마 토큰 적용)
- [x] 2026-08-18 — `docs/01__Planning/` 4개 파일 기록 최신화 완료
- [x] 2026-08-18 — Phase 5 PRD 작성 (`docs/plan/2026-08-18_phase5_prd.md`) — 코드 감사 기반 P0~P3 16개 작업 항목 확정 + SEO/GEO/AEO 전략 수립
- [x] 2026-08-18 — PR #41: Phase 5 PRD 작성 및 플래닝 문서 최신화
- [x] 2026-08-18 — PR #42: 루트 레이아웃 메타데이터를 Frontend Engineer 포지셔닝으로 교체 (P0-1 일부)
- [x] 2026-08-18 — PR #43: work/contact 페이지 메타데이터를 Frontend Engineer 포지셔닝으로 교체 (P0-1 일부)
- [x] 2026-08-18 — PR #44: work/[slug] generateMetadata 추가 및 Next.js 16 params 비동기 처리 버그 수정 (P0-1 완료)
- [x] 2026-08-18 — PR #45: Contact 페이지 이메일·SNS 플레이스홀더를 실제 값으로 교체 (P0-2 완료)
- [x] 2026-08-18 — PR #46: Work Detail 플레이스홀더 제거 및 에셋 조건부 렌더링 구조 도입 (P0-3 완료)
- [x] 2026-08-19 — PR #47: Gallery 플레이스홀더를 Resume 페이지로 전환 (P0-4 완료)
- [x] 2026-08-19 — PR #48: 홈 전용 에필로그를 Footer에서 분리해 서브 페이지 노출 제거 (P0-5 완료)
- [x] 2026-08-19 — PR #49: Playwright CI 브라우저 설치 병목 제거 — 공식 컨테이너 전환 (P3-7 완료)
- [x] 2026-08-19 — PR #50: Turborepo 2.9.14 → 2.10.11 업그레이드
- [x] 2026-08-19 — PR #51: 홈 Work 카드를 MDX 단일 소스로 통합 (P0-6 완료)
- [x] 2026-08-19 — P1-2: 주석 처리된 브랜드 디자이너 섹션 (`BrandSection`/`ServicesSection`/`EditorialDivider`) 완전 제거
- [x] 2026-09-02 — `docs/01__Planning/` 4개 파일 + README 2개 기록 최신화
- [x] 2026-09-03 — PR #52: Works 영역 전면 리뉴얼 (P1-1·P1-2 완료) — 실제 경력 프로젝트 10건 등재, 상세 페이지 재설계, 카드 16:10 통일, 이미지 라이트박스, VRT 인프라 결함 수정 (55 커밋)
- [x] 2026-09-03 — 이슈 #53 생성: P3-6 디자인 토큰 정비 실행 목록 (PR #52 리뷰에서 파생)
- [x] 2026-09-03 — portfolio@0.2.0 릴리스 (PR #54·#57·#55) — P0·P1 완료분을 master 반영 후 프로덕션 배포, GitHub Release 발행
- [x] 2026-09-03 — PR #58: Experience 그리드·모바일 가로 넘침 회귀 수정 및 모바일 QA 반영 (0.2.0 배포 후 발견)
- [x] 2026-09-03 — PR #56·#59: P3-8(릴리스 자동화 검토)·P2-5(검색 가시성 인프라) 백로그 등재
