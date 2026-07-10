# Notes

> 자유롭게 기록하는 공간입니다.

---

## 2026-05-18

### MCP 환경 설정

Antigravity 1.0에서 TaskMaster MCP 서버 연결을 테스트했다. 당시 `mcp_config.json`에 설정은 추가했지만 실제 연결은 되지 않았다. 이후 Antigravity 2.0으로 전환하면서 MCP 설정도 새로 구성됨.

---

## 2026-05-19

### 프로젝트 전환 배경

기존 `portfolio` 프로젝트(`/100__Github_seungyeub/portfolio/`)는 이미 어느 정도 구현이 되어 있었지만 Helios 레퍼런스와 비교했을 때 구조적 차이가 컸다. 다크 테마 수정(`globals.css`), 스크롤 애니메이션 `once: true → false` 변경 등을 해봤지만, 인프라(모노레포, CI/CD)를 제대로 갖춘 새 프로젝트에서 시작하는 것이 낫다는 판단으로 `mono-lab`을 새로 시작했다.

---

## 2026-05-19

### frontend-foundation 템플릿

GitHub 레포: `https://github.com/seungyeub/frontend-foundation`

- Turborepo + pnpm workspaces + Next.js 14 + Tailwind CSS + ESLint/Prettier/TypeScript 완비
- MIT License, 커스텀 README.md 포함
- 향후 모든 사이드 프로젝트의 시작점으로 활용 예정
- GitHub Template repository 옵션 활성화 여부 재확인 필요

---

## 2026-06-09

### Helios 레퍼런스 비교 분석 문서

3D Interactive Card 작업 시 `docs/HELIOS_COMPARISON.md` 문서를 작성했다. 현재 포트폴리오와 Helios 레퍼런스의 상세 차이점이 304줄로 기록되어 있다. 향후 개선 참고용으로 보존.

---

## 2026-06-21

### Skills Section 레퍼런스 분석 인사이트

**Site A — Syahril Arfian Almazril (`syahrilarfianalmazril.my.id`)**

- 별도 `/skills` 페이지로 분리 (홈과 독립)
- 로봇 3D 아이콘 활용, 시각적으로 임팩트 강함
- 카드 그리드 + 인라인 칩 혼합 레이아웃
- 스크롤 기반 등장 애니메이션

**Site B — Mahesh P Pai (`maheshppai-v1.netlify.app`)**

- 홈 페이지 내 섹션으로 통합 (별도 페이지 없음)
- 프로젝트 카드 내 태그 형식 (컴팩트, 정보 밀도 높음)

→ 우리 포트폴리오는 홈 페이지 내 섹션으로 구성하되, 두 레이아웃(Grid / Chips)을 비교 구현 후 선택하는 방식으로 진행 중.

---

## 2026-06-21

### 커스텀 아이콘 교체 필요 사항

현재 `public/icons/` 의 커스텀 SVG 7개는 임시(placeholder) 수준이다. Phase 4 완료 후 실제 브랜드 가이드라인에 맞는 SVG로 교체 필요:

| 파일              | 출처                                  |
| ----------------- | ------------------------------------- |
| `aws.svg`         | AWS 공식 브랜드 가이드                |
| `mssql.svg`       | Microsoft SQL Server 공식 아이콘      |
| `playwright.svg`  | Playwright 공식 로고                  |
| `slack.svg`       | Slack 공식 브랜드 가이드              |
| `openai.svg`      | OpenAI 공식 로고                      |
| `zustand.svg`     | Zustand 커뮤니티 비공식 로고          |
| `antigravity.svg` | Antigravity IDE 로고 (직접 제작 필요) |

---

## 2026-06-22

### Sticky 레이아웃 이슈

PR #11, #12에서 전역 레이아웃과 CSS Sticky 포지션이 충돌하는 문제가 발생했다. CSS Sticky 전면 개편 시도 후, 컴포넌트 단위 VRT 아키텍처로 원복하여 해결했다. 관련 내용은 `docs/plan/pinned_scroll_layout_plan.md` 에 상세 기록됨.

---

## 2026-06-29

### Antigravity 1.0 → 2.0 마이그레이션

- 1.0 데이터 경로: `~/.gemini/antigravity-backup/`
- 2.0 데이터 경로: `~/.gemini/antigravity/`
- 1.0 세션 3개 보존됨:
  - `6df6edb5` (2026-05-18): MCP 연결 테스트
  - `809e1e29` (2026-05-19): 기존 portfolio 분석
  - `5f4ab2c3` (2026-05-19~20): 메인 세션, Phase 1~6 전체 (7.88MB)
- 마이그레이션 시점: 2026-05-20 오후 2시경

---

## 2026-06-29

### Skills Section Phase 4 대기 중인 결정 사항

아직 미확정인 항목:

- **레이아웃**: Grid (카드 그리드) vs Chips (인라인 태그) 중 선택
- **색상 모드**: Mono (흰색 단색) / Brand (브랜드 컬러) / Interactive (호버 시 컬러 활성화) 중 선택
- 현재 임시 비교 토글 UI가 `SkillsSection.tsx` 하단에 존재 (Phase 4에서 제거 예정)
