# Project

> 이 프로젝트의 목적과 운영 원칙을 정의합니다.

---

## Purpose

Framer 포트폴리오 템플릿(Palmer / Helios)을 레퍼런스로 삼아 **Next.js 기반의 개인 포트폴리오 웹사이트**를 클론 코딩한다.
취업 포트폴리오로서 프론트엔드 기술 역량(UI/UX 구현 능력, 스크롤 애니메이션, 최신 기술 스택 활용, 인프라 설계)을 증명하는 것이 핵심 목적이다.

기존에 운영하던 `portfolio` 프로젝트가 있었으나, Helios 레퍼런스와 구조적 차이가 크고 인프라가 미비하여 올바른 기반 위에서 새로 시작하기로 결정했다. 그 결과물이 `mono-lab` 이다.

---

## Goals

이 프로젝트를 완료했다고 판단하는 기준은 무엇인가?

- Helios 레퍼런스 사이트의 시각적 완성도와 인터랙션을 Next.js로 충실하게 구현한다
- Turborepo + pnpm 모노레포 아키텍처를 실제로 설계하고 운영한 경험을 포트폴리오에 담는다
- CI/CD 자동화(GitHub Actions), 시각적 회귀 테스트(Playwright VRT), 성능 측정(Lighthouse)까지 갖춘 프로덕션 수준의 개발 환경을 구축한다
- Skills Section을 포함한 모든 섹션이 완성되어 실제 배포 가능한 상태가 된다

---

## Scope

### Included

이 프로젝트에서 수행하는 범위

- Home 랜딩 페이지 (Hero, Works, Skills, Experience, FAQ, Epilogue 섹션)
- Work Case Study 서브 페이지 (MDX 기반 동적 라우팅, 10개 실제 프로젝트)
- Resume 페이지 (경력/자격증 데이터 — ExperienceSection과 데이터 공유)
- Contact 폼 (React Hook Form + Zod + Resend Server Action)
- 공통 레이아웃 (Header, Footer, CustomCursor, SmoothScroll/Lenis)
- CI/CD 파이프라인 (GitHub Actions, Playwright VRT, Lighthouse, SonarCloud, CodeRabbit)
- 재사용 가능한 인프라 템플릿 (`frontend-foundation` — 별도 GitHub 레포)

### Excluded

의도적으로 하지 않는 것

- TanStack Query (서버 상태 관리는 이 프로젝트 범위 외, 다른 프로젝트에서 사용)
- 다국어(i18n) 지원
- CMS 연동 (콘텐츠는 MDX 파일과 상수로 관리)
- About 별도 페이지 (현재 Home 내 섹션으로 통합)
- ~~Gallery 페이지~~ (Resume 페이지로 전환됨, 2026-08)

---

## Principles

프로젝트를 진행하면서 반드시 지킬 원칙

- 기존 에디토리얼 디자인 무드(다크 테마, 미니멀 타이포그래피, 여백)를 절대 해치지 않는다
- 한 번에 하나의 단계만 진행한다 — 중간에 문제가 생기면 멈추고 논의한다
- 새로운 기능은 반드시 계획서(`docs/plan/`) 작성 및 승인 후에 구현한다
- 컴포넌트는 기존 패턴(`WorksSection`, `ExperienceSection`)과 일관성을 유지한다

---

## Constraints

알고 있는 제약사항

- Antigravity 1.0의 대화 기록은 `~/.gemini/antigravity-backup/` 에만 보존됨 (현재 시스템에서 직접 참조 불가)
- `@icons-pack/react-simple-icons` 에서 지원하지 않는 아이콘은 커스텀 SVG로 `public/icons/` 에 별도 관리 (현재 `customIconPath` 사용처 15개 — 일부 비최적화 SVG 존재, P2-2에서 정식 교체 예정)
- ~~Skills Section Phase 4(레이아웃/색상 최종 확정) 완료 전까지 임시 비교 토글 UI가 `SkillsSection.tsx` 에 존재함~~ → Phase 4 완료, Chips + Brand 확정 및 토글 UI 제거됨 (2026-06-23)
- Work Detail 상세 페이지의 이미지/코드 스니펫은 `filterExistingPublicImages` 기반 조건부 렌더링 — 자료가 준비된 프로젝트만 해당 영역이 활성화됨

---

## Current Status

> 최종 업데이트: 2026-09-02

- **현재 버전**: `v0.1.4` (tag: `portfolio@0.1.4`)
- **현재 브랜치**: `develop` (안정), `feat/portfolio-works-renewal` (P1-1 작업 진행 중)
- **병합된 PR**: #1 ~ #51 (develop 기준, 총 51개)
- **완료된 마일스톤**:
  - 초기 구현 Phase 1~6 (세팅, 공통 레이아웃, MDX/Work/Gallery, Contact, Header/Hero/Work 목록/FAQ 등)
  - Skills Section 리뉴얼 (Chips + Brand 확정)
  - CI/CD 파이프라인 구축 + VRT 자동화 + Playwright 공식 컨테이너 전환
  - **Phase 5 P0 전항목 완료** (PR #42~#51):
    - P0-1: 사이트 메타데이터 Frontend Engineer 포지셔닝 교체
    - P0-2: Contact 플레이스홀더 실제 값 교체
    - P0-3: Work Detail 플레이스홀더 제거 + 에셋 조건부 렌더링
    - P0-4: Gallery → Resume 전환
    - P0-5: 서브 페이지 Footer 에필로그 분리
    - P0-6: Work 데이터 소스 MDX 단일화
  - P1-2: 주석 처리된 브랜드 디자이너 섹션 (`BrandSection`/`ServicesSection`/`EditorialDivider`) 완전 제거
  - Turborepo 2.9.14 → 2.10.11 업그레이드
- **현재 진행 중**: P1-1 Works 영역 레퍼런스 리뉴얼 (`feat/portfolio-works-renewal` 브랜치)
  - A 단계 (상세 페이지 구조): 스키마 확장 → 섹션 추가 → CTA/네비게이션 완료
  - B 단계 (MDX 콘텐츠): 실제 프로젝트 10건 작성 + Helios 가상 프로젝트 4건 삭제
  - D 단계 (리디자인): 레퍼런스 기반 전면 리디자인 + 피드백 반영
  - E 단계 (자료 반영): 코드 스니펫 다중 블록 지원 + 실자료 일부 반영
  - F 단계 (디자인 피드백): 자료 추가분 반영 및 피드백 8건 처리
- **다음 작업**: P1-1 완료 후 develop 병합, 이후 P2~P3 백로그 순차 착수

---

## Success Criteria

프로젝트가 성공했다고 판단하는 기준

- 모든 섹션이 레퍼런스 사이트 수준의 완성도로 구현된다
- Lighthouse 점수가 모든 카테고리에서 설정된 임계점을 통과한다
- Playwright VRT 기준점이 안정적으로 유지된다
- 실제 배포(Vercel)가 완료되어 공개 URL로 접근 가능하다
