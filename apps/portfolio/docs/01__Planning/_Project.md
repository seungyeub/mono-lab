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

- Home 랜딩 페이지 (Hero, Works, Skills, Experience, FAQ 섹션)
- Work Case Study 서브 페이지 (MDX 기반 동적 라우팅)
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
- `@icons-pack/react-simple-icons` 에서 지원하지 않는 아이콘 7개는 커스텀 SVG로 `public/icons/` 에 별도 관리
- ~~Skills Section Phase 4(레이아웃/색상 최종 확정) 완료 전까지 임시 비교 토글 UI가 `SkillsSection.tsx` 에 존재함~~ → Phase 4 완료, Chips + Brand 확정 및 토글 UI 제거됨 (2026-06-23)

---

## Current Status

> 최종 업데이트: 2026-08-18

- **현재 버전**: `v0.1.4`
- **현재 브랜치**: `develop`
- **병합된 PR**: #1 ~ #40 (총 40개)
- **완료된 마일스톤**: 초기 구현 Phase 1~6(`_Tasks.md` 기준 — 세팅, 공통 레이아웃, MDX/Work/Gallery, Contact, Header/Hero/Work 목록/FAQ 등), Skills Section 리뉴얼(별도 트랙인 "Skills Section Phase 4"), CI/CD 파이프라인 구축, VRT 자동화
- **최근 주요 작업** (2026-07-12 ~ 08-18):
  - v0.1.4 UI 버그 픽스 (iOS 스크롤 충돌, 커서 숨김, 테스트 명세서 리팩토링)
  - Footer GIF 캐러셀 전환 (81개 GIF 무한 스크롤)
  - 커서 마이크로카피/타입 체계 통일 + StoryAnimation 신규 추가
  - ExperienceSection 데이터 구조 리팩토링 (`stack`→`type`)
- **다음 작업**: 콘텐츠 완성도·SEO/GEO/AEO 로드맵 "Phase 5"(`docs/plan/2026-08-18_phase5_prd.md`) 작성 완료 — 위 초기 구현 Phase 1~6과는 별개의 새 번호 체계이며, P0(메타데이터, Contact/Work Detail/Gallery 플레이스홀더 제거, Footer 구조 수정, Work 데이터 정합성) 항목부터 순차 착수 예정

---

## Success Criteria

프로젝트가 성공했다고 판단하는 기준

- 모든 섹션이 레퍼런스 사이트 수준의 완성도로 구현된다
- Lighthouse 점수가 모든 카테고리에서 설정된 임계점을 통과한다
- Playwright VRT 기준점이 안정적으로 유지된다
- 실제 배포(Vercel)가 완료되어 공개 URL로 접근 가능하다
