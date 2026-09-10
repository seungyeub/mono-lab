# Tasks

> 현재 프로젝트의 핵심 진행 상황만 관리합니다.

---

## Next

가장 먼저 해야 하는 작업 — Phase 6 PRD(`docs/plan/2026-09-08_phase6_prd.md`) 기준. Phase 5(`docs/plan/2026-08-18_phase5_prd.md`)는 0.4.0으로 전 항목 완료.

### Phase 6 — 결함 정리·기능 연결·측정 인프라 신뢰성

**🔴 P0 — 결함 수정**

- [x] P6-1. 에필로그 문구가 세로로 긴 화면에서 끝까지 밝아지지 않음 — 도달 가능한 최대 진행도를 실행 시점에 재서 단어 구간을 그 안에 맞춤. 900~2400px 여섯 해상도 30/30, 짧은 화면 순차 효과 유지
- [x] P6-2. 문의 폼이 메일을 보내지 않으면서 "보냈다"고 표시 — 프로덕션에 EmailJS 키가 없어 개발용 분기를 타고 있었다(실측). Resend 서버 액션으로 일원화, 설정 없으면 오류+직접 연락 안내, 서버 재검증·허니팟, EmailJS 제거. **배포 후 실제 발송 1회 확인 필요**

**🟡 P1 — 기능 연결** (항목마다 설명 후 착수)

- [x] P6-3. 방문 분석 연동 — GA4(`@next/third-parties`, 측정 ID 있을 때만 로드) + 문의 제출 `contact_submit` 이벤트 + Speed Insights. 측정 ID `G-SJXH41DRD4` Vercel 등록 완료. **배포 후 실시간 보고서·Speed Insights 수집 확인 필요.** 개인정보 처리방침 문구 배치는 미결
- [x] P6-4. 접근성 점검·개선 — 랜드마크·제목 계층·건너뛰기 링크, 동작 줄이기 대응, 캐러셀 제어 가시성·터치 크기, 커서 숨김 조건화, 보조 텍스트 대비 40→50%. 접근성 0.95~0.96, 남은 실패는 의도된 연출(에필로그 시작 밝기·워터마크)뿐
- [x] P6-10. Contact 페이지 레이아웃 정리 — 제목 `Contact©`(우측 열 라벨은 중복을 피해 `Channels`), 헤더 설명문 두 문장, 폼+연락처(320px 우측) 나란히, 입력 라벨, 행·입력란 밑줄 채움 효과, 롤링 링크, 알약 버튼(홈 CONTACT와 동일 크기). `/work`·`/resume`·`/contact` 본문 `site-container` 통일
- [x] P6-13. 페이지 간 일관성 정리 — `/work` 헤더 설명문을 `/resume` 기준(본문급·제목 아래)으로, 홈 `See All Works` 하단 고정 버튼 복구(1863b07에서 딸려 나간 회귀), Resume 다운로드·라이트박스 닫기 버튼을 롤링+굵은 글자로 통일
- [x] P6-14. 프로젝트 명칭·경로 통일 — 라벨·메뉴를 `Projects`로 모으고 순서를 `Home, Projects, Resume, Contact`로, 경로 `/work` → `/projects`(영구 리다이렉트 2건 동반). 홈 대제목 넘침은 글자 크기 대신 `lg` 구간 6:6 비율로 해결
- [x] P6-15. 코드 리뷰 지적 반영 — PR #78 CodeRabbit 9건 중 8건 수정(허니팟 GA 오집계, 서버 액션 거부 시 버튼 잠김, 커서 사라짐, 스킵 링크 가림, reachable 미반영, 동작 줄이기 미반영, 댓글 조회, 액션 SHA). 문의 폼 rate limit은 공유 저장소가 필요해 Phase 7로 보류
- [ ] P6-11. Contact 페이지 Quick Answers(FAQ) 구역 — 문의용 질문 3~4개 초안 확인 후 착수 (보류)

**🟡 P2 — 성능·인프라** (항목마다 설명 후 착수)

- [x] P6-5. 초기 JS 번들 감량 — **현 수준 유지로 결론**. 초기 JS 283KB 중 React 런타임 110KB·폰트 377KB는 줄일 수 없고, 가능한 것(아이콘 18KB·framer 25KB)은 전체의 7%라 점수 0.03 상한. 조사 결과는 PRD에 기록
- [x] P6-6. CI Lighthouse 신뢰성 — 리포트 아티팩트 보관, 댓글 수정(관측값·러너 지표, 갱신형), 3회 중앙값. `Manifest not found` 원인은 업로드 타깃. **프리뷰 URL 측정·임계값은 보류**(리포트 확인 후)
- [x] P6-7. release-please `workflow_dispatch` 추가 — Actions에서 수동 실행 가능. master 반영 후 효과

**🟢 P3 — 결정 필요**

- [x] P6-8. Resume PDF 다운로드 — 직접 제작 파일(ⓐ) 확정. `RollingLink` 알약 버튼(`DOWNLOAD PDF`), 저장 파일명 `Seungyeub-Baek-Resume.pdf`. 실제 이력서 파일(2쪽) 교체 완료
- [x] P6-9. 배포 파이프라인 타입 체크 게이트 — `ignoreBuildErrors` 제거 + 배포 워크플로에 `check-types` 단계. 숨은 타입 오류 없음 확인
- [x] P6-12. 개인정보 수집 고지 — 처리방침 페이지 대신 **문의 폼 아래 두 줄 고지**로 결론. 조문은 위치를 지정하지 않고, 수집의 무게는 GA가 아니라 폼에 있다. GA 쿠키 고지는 덮지 않는 간극이 남음(PRD 기록)

### Phase 5 — 완료 (0.4.0, 2026-09-07)

### 🟡 P2 — Nice to Have (품질 향상)

- [x] P2-1. Header 우측 "Based in Seoul" 콘텐츠 결정 — 강조 뒤집기(직군 굵게 / 위치 회색)로 확정
- [x] P2-2. 커스텀 아이콘 17개 정리 — 10개는 이미 설치된 `@icons-pack/react-simple-icons`로 교체, 래스터 2개는 144px WebP로 재생성. 2.6MB → 52KB. `aws`·`mssql` 브랜드 정확성은 미해결
- [x] P2-3. StoryAnimation 컴포넌트 — 배치하지 않고 제거로 확정
- [x] P2-4. 포트폴리오 저장소(mono-lab) 자체를 프로젝트로 등재 — order 2로 등재, 캡쳐 7장 반영. 홈 미노출(짝수 계약), Archive에만 노출
- [x] P2-5. 검색 가시성 인프라 구축 — sitemap·robots·OG·JSON-LD·`h1` 계층 정리 완료 (P3-3 `lang='ko'` 포함). 도메인 `https://seungyeub.vercel.app` 확정, `siteConfig.ts` 단일 소스 신설

### 🟢 P3 — Backlog (선택적/폴리싱)

- [x] P3-1. 데스크톱 폰트 스케일업 — **조치 불필요로 결정**. `max-w` 래퍼가 이미 적용돼 1440→1920px에서 본문 폭이 변하지 않는다(실측). 스케일 조정은 P3-6에서 토큰으로 다룬다
- [x] P3-2. Skills Section 구분선(White Line) 제거 — 그 구분선이 `EditorialDivider`였고 P3-10에서 함께 제거
- [x] P3-3. `<html lang='en'>` → `ko` 수정 — P2-5에서 함께 처리
- [x] P3-4. 폴더 구조 정리 — `app/`→`src/app/`, 별칭 `@/*`→`./src/*`(import 96건 정리). `SkillChips`·`SkillIcon`→`components/`, `skillsData`→`data/`로 feature 간 의존 해소. `dev.log` 추적 해제. `actions.ts`는 메일 발송 계획으로 유지. 루트 README에 새 앱 추가 규칙 기록
- [x] P3-5. HeroSection 하단 Marquee — 구분자를 텍스트 사이 가운데로 이동(좌우 40px 동일). 띠 자체는 유지, 겹친 선 4줄은 P3-6으로 인계
- [x] P3-12. 섹션 구분 강화 (긴 모니터 대응) — **현 상태 유지로 결론**. 배경 교대(ⓑ)·상단 선+제목 통일(ⓒ)을 로컬 비교했으나 ⓑ는 톤 훼손, ⓒ는 대형 제목이 이미 있어 선만 남아 효과 미미. 고정 라벨·대형 제목·통일 여백으로 충분. Epilogue scene 05→06, 잔여 `bg-neutral-950`→`bg-surface`만 정리
- [x] P3-8. 릴리스 자동화 — release-please manifest 모드 도입. 태그 `portfolio@X.Y.Z`·develop→master 유지. **첫 실행 전 `RELEASE_PLEASE_TOKEN` 시크릿 등록 필요**
- [x] P3-6. 디자인 토큰 체계 정비 — `globals.css` `@theme`에 surface·line·label·section 토큰 8개 정의, 27개 파일 임의값 일괄 교체. Hero 하단 선 2줄 제거(P3-5 인계), Footer 문구 통일. 실행 목록 [이슈 #53](https://github.com/seungyeub/mono-lab/issues/53). VRT 재촬영 필요
- [x] P3-9. Skills의 TagBar를 768px 미만에서 숨김 — `hidden md:block`으로 감쌈. Skills만 변경, Experience·Epilogue는 유지(2026-09-04 확정). VRT 홈 기준선 재촬영 필요
- [x] P3-10. `EditorialDivider` 제거 — 커밋된 코드 기준 데드 코드였다. 조사 중 작업 트리의 확인용 임시 호출을 커밋된 사용처로 오인한 적이 있으나, 저장소 이력에는 존재한 적 없다
- [x] P3-11. Lighthouse 성능 개선 — 0.42→0.75(로컬). 원인은 CSS 배경 이미지가 아니라 3D 번들의 메인 스레드 점유·Pretendard `@import` 렌더 차단·`template.tsx` 진입 페이드였다. 관측 LCP 195ms(FCP와 동일), 보고값 4.3s는 시뮬레이션 특성. 임계값 상향은 CI 실측 후 결정

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
- [x] 2026-08-19 — P1-2: 주석 처리된 브랜드 디자이너 섹션의 **import·렌더 제거** (`BrandSection`/`ServicesSection`/`EditorialDivider`). **`EditorialDivider.tsx` 파일은 남아 있었다** — 2026-09-04 P3-10에서 제거했다
- [x] 2026-09-02 — `docs/01__Planning/` 4개 파일 + README 2개 기록 최신화
- [x] 2026-09-03 — PR #52: Works 영역 전면 리뉴얼 (P1-1·P1-2 완료) — 실제 경력 프로젝트 10건 등재, 상세 페이지 재설계, 카드 16:10 통일, 이미지 라이트박스, VRT 인프라 결함 수정 (55 커밋)
- [x] 2026-09-03 — 이슈 #53 생성: P3-6 디자인 토큰 정비 실행 목록 (PR #52 리뷰에서 파생)
- [x] 2026-09-04 — 09-03 커밋 이력 압축(19→3) — GitHub 기여 그래프 편중 완화 목적. 백업: `origin/backup/master-before-squash-0903`
- [x] 2026-09-04 — PR #63: 커스텀 아이콘 17→6개, 2.6MB→52KB (P2-1·P2-2·P2-3 완료)
- [x] 2026-09-04 — PR #64: mono-lab 저장소를 order 2 프로젝트로 등재 (P2-4 완료)
- [x] 2026-09-04 — PR #65: 검색 가시성 인프라 — sitemap·robots·OG·JSON-LD·h1 계층 (P2-5·P3-3 완료)
- [x] 2026-09-04 — PR #66: 개인 자료 `.gitignore` 추가, P3-9·P3-10·P3-11 등재
- [x] 2026-09-07 — **P3 전 항목 완료.** PR #70(P3 12건)·#69(Search Console 태그)·#72(0.3.0 이력 동기화)·#73(develop→master)·#75(CHANGELOG Prettier 제외)
- [x] 2026-09-07 — portfolio@0.4.0 릴리스 — release-please 첫 자동 실행(PR #74). 태그·Release·프로덕션 배포까지 PAT로 정상 연결됨을 확인. PR #76으로 역머지
- [x] 2026-09-07 — Search Console 소유 확인 완료(HTML 태그 자동 인식), sitemap 제출 성공(발견 15페이지). 구조화 데이터·OG 메타 전 페이지 점검 완료
- [x] 2026-09-08 — OG 전용 이미지 11장 추가(1200×630 JPEG). 카드 이미지를 그대로 쓰던 것을 대체 — WebP 미지원 플랫폼과 임의 잘림 문제 해소. 캡쳐 공개 불가 2건은 사이트 톤 텍스트 카드로 제작
- [x] 2026-09-08 — `/work` 이름을 Archive에서 Projects로 통일(h1·BreadcrumbList). 메뉴·URL과 어긋나던 표기 정리
- [x] 2026-09-08 — 스크롤 등장 효과를 `src/lib/motion.ts` 프리셋 8개로 통합. 관측 여백을 양수로 돌려 체감 지연 단축 — Works 809→591ms, Skills 874→649ms, Experience 737→666ms, FAQ 797→721ms. Epilogue·Footer는 의도된 연출이라 유지
- [x] 2026-09-04 — **P2 전 항목 완료.** develop 전 범위 점검(경로 19개·링크 61개·45개 조합) 문제 없음
- [x] 2026-09-03 — portfolio@0.2.0 릴리스 (PR #54·#57·#55) — P0·P1 완료분을 master 반영 후 프로덕션 배포, GitHub Release 발행
- [x] 2026-09-03 — PR #58: Experience 그리드·모바일 가로 넘침 회귀 수정 및 모바일 QA 반영 (0.2.0 배포 후 발견)
- [x] 2026-09-03 — PR #56·#59: P3-8(릴리스 자동화 검토)·P2-5(검색 가시성 인프라) 백로그 등재
