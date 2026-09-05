# 릴리스 자동화 도입 검토

> **작성일:** 2026-09-03
> **Title:** 버전 범프·체인지로그·태그 발행을 자동화한다
> **Description:** 0.2.0 릴리스를 수동으로 진행하며 드러난 반복 작업과 실수 지점을 정리하고, Changesets·release-please 두 도구를 비교해 도입 여부를 판단한다.
> **상태:** ✅ **도입 완료 (2026-09-05)** — release-please manifest 모드 (PRD **P3-8**)

---

## 1. 왜 검토하는가

0.2.0 릴리스를 수동으로 진행하면서 아래가 드러났다.

### 1-1. 실제로 발생한 문제

**버전과 태그가 어긋나 있었다.** `apps/portfolio/package.json`의 `version`이 `0.1.0`인데 마지막 배포 태그는 `portfolio@0.1.4`였다. 그동안 태그만 올리고 package.json을 갱신하지 않아 생긴 불일치로, 0.2.0 릴리스 준비 중에야 발견했다. **자동화 도구를 썼다면 애초에 생기지 않았을 종류의 문제다.**

### 1-2. 반복되는 수동 작업

- 버전 번호를 손으로 고치고 커밋
- 릴리스 노트를 커밋 이력에서 손으로 재구성 (0.1.4 이후 PR #37~#54를 역추적)
- 태그 생성·push
- GitHub Release 본문 작성

릴리스 하나에 PR이 3개 필요한 현재 흐름(기능 PR → 버전·문서 PR → develop→master PR)에서, 두 번째 PR은 대부분 자동화 가능한 작업이다.

### 1-3. 지금이 도입하기 좋은 시점인 이유

이 저장소는 이미 **Conventional Commits를 일관되게 지키고 있다**(`feat(portfolio):`, `fix(ci):`, `docs(portfolio):` 등). 두 도구 모두 이 컨벤션을 입력으로 삼으므로 추가 규율을 도입할 필요가 없다.

---

## 2. 이 저장소의 릴리스 목표

도구를 고르기 전에 무엇을 자동화하려는지부터 못 박는다.

- **npm publish는 하지 않는다.** `apps/portfolio`는 `private: true`이고 배포 대상은 레지스트리가 아니라 Vercel이다
- 자동화하려는 것은 **① package.json 버전 범프 ② CHANGELOG 생성 ③ `portfolio@X.Y.Z` Git 태그 발행 ④ GitHub Release 발행** 네 가지다
- 배포 자체는 지금처럼 태그 push가 트리거한다 (`deploy-portfolio.yml`)

## 3. 후보 비교

### 3-1. Changesets

**모노레포에서 사실상 표준.** PR마다 `.changeset/*.md`에 변경 요약과 bump 수준(major/minor/patch)을 남기면, 릴리스 시점에 버전 범프 + CHANGELOG 생성 + 태그를 만들어준다.

| 장점                                                                                                                                           | 단점                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 패키지별 독립 버전 관리 (현재 앱 1개 + 공유 패키지 4개 구조에 맞음)                                                                            | **PR마다 changeset 파일을 추가하는 습관**이 필요  |
| 변경 요약을 사람이 쓰므로 릴리스 노트 품질이 좋다                                                                                              | 빠뜨리면 릴리스에서 누락된다 (CI로 강제 가능)     |
| bump 수준을 사람이 판단 — "이건 minor인가 patch인가"를 명시적으로 결정                                                                         | 커밋 컨벤션과 별개의 파일을 관리                  |
| **`private: true` 패키지는 기본적으로 대상에서 빠진다** — `privatePackages: { version: true, tag: true }`를 명시해야 버전 범프·태그가 동작한다 | 도입 시점 최신 버전의 기본값을 다시 확인해야 한다 |

### 3-2. release-please

**Conventional Commits를 읽어 릴리스 PR을 자동 생성.** 커밋 메시지의 `feat:`/`fix:`/`BREAKING CHANGE:`로 bump 수준을 판단하고, 버전 범프·CHANGELOG·태그·GitHub Release를 한 번에 처리한다.

| 장점                                                    | 단점                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| **추가 작업이 없다** — 지금 쓰는 커밋 컨벤션만으로 동작 | 릴리스 노트가 커밋 메시지에 종속 (커밋이 부실하면 노트도 부실) |
| 릴리스 PR을 자동으로 열어줘 "머지 = 릴리스"가 된다      | bump 수준을 도구가 판단 — 의도와 다를 수 있다                  |
| GitHub Release까지 자동 발행                            | 모노레포 다중 패키지 설정이 Changesets보다 번거롭다            |

---

## 4. 판단 기준

이 저장소의 조건을 놓고 보면:

- **패키지는 사실상 1개다.** 공유 패키지 4개는 모두 `0.0.0`으로 고정돼 있고 독립 배포하지 않는다 → Changesets의 강점(패키지별 버전)이 크게 살지 않는다
- **커밋 메시지 품질이 이미 높다.** 본문에 판단 근거까지 적고 있어 release-please가 뽑는 노트의 재료가 충분하다
- **1인 개발이다.** PR마다 changeset 파일을 추가하는 규율은 혼자일 때 빠뜨리기 쉽다

→ **release-please 쪽이 이 저장소에 더 맞을 가능성이 높다.** 다만 아래를 확인한 뒤 결정한다.

---

## 5. 도입 전 확인 — 2026-09-05 전부 확인, release-please로 결정

공식 문서(`googleapis/release-please`, `release-please-action` README)로 확인했다.

- [x] **단일 패키지 모드** — manifest 설정 `packages: { "apps/portfolio": { component: "portfolio" } }`로 앱 하나만 릴리스한다. 공유 패키지 4개는 대상에서 빠진다.
- [x] **Changesets 검토 종결** — 패키지가 사실상 1개이고 커밋 규율이 이미 있어 release-please가 맞다(4절 판단 유지). Changesets의 `privatePackages` 옵션은 확인하지 않았다.
- [x] **태그 형식 `portfolio@X.Y.Z`** — `include-component-in-tag: true` + `tag-separator: "@"` + `include-v-in-tag: false`로 생성된다. 태그 생성 규칙은 `${component}${separator}${includeV ? 'v' : ''}${version}`(소스 `src/util/tag-name.ts`). **`deploy-portfolio.yml`의 `portfolio@*` 트리거가 그대로 동작한다.**
- [x] **브랜치 전략** — `target-branch: master`. 흐름은 develop 작업 → develop→master PR → [자동] 릴리스 PR → 머지 → [자동] 태그·Release·배포. **브랜치 전략은 바꾸지 않는다.** 대신 릴리스 직후 master→develop 백머지가 필요하다(7절).
- [x] **브랜치 보호 규칙** — 릴리스 PR은 사람이 머지하므로 `required_review_thread_resolution`과 충돌하지 않는다. release-please가 push하는 브랜치(`release-please--branches--master--components--portfolio`)는 보호 대상이 아니다. 태그는 룰셋(branch 대상) 밖이다.
- [x] **기존 태그 인식** — `.release-please-manifest.json`에 `"apps/portfolio": "0.3.0"`을 적으면 그 버전을 기준점으로 삼고 태그 `portfolio@0.3.0`을 찾아 이후 커밋만 센다. `bootstrap-sha`는 이전 릴리스가 없을 때만 쓰이는 값이라 두지 않았다.

### 핵심 제약: PAT가 필요하다

**기본 `GITHUB_TOKEN`으로 만든 PR과 태그는 다른 워크플로를 발화시키지 않는다**(GitHub의 재귀 방지, release-please-action README 명시). 이 상태로는 릴리스 PR에 CI가 안 돌고, **태그가 생겨도 `deploy-portfolio.yml`이 실행되지 않는다.** `contents: write` + `pull-requests: write` 권한의 Fine-grained PAT를 `RELEASE_PLEASE_TOKEN` 시크릿으로 등록해야 한다.

### 0.x 버전 규칙

기본값이 `feat`→minor, `fix`→patch로 0.3.0 릴리스 때의 판단과 같다. `bump-minor-pre-major: true`를 켜서 `BREAKING CHANGE`가 1.0.0으로 튀지 않고 minor에 머물게 했다. `bump-patch-for-minor-pre-major`는 끈다(켜면 `feat`가 patch가 되어 0.3.0 판단과 어긋난다).

---

## 6. 도입한 파일

| 파일                                   | 역할                                                                 |
| -------------------------------------- | -------------------------------------------------------------------- |
| `.github/workflows/release-please.yml` | master push 시 실행. PAT 사용. 액션은 v5.0.0 SHA로 고정              |
| `release-please-config.json`           | 패키지 경로·컴포넌트·태그 형식·0.x 규칙·PR 제목 패턴·체인지로그 섹션 |
| `.release-please-manifest.json`        | `{ "apps/portfolio": "0.3.0" }` — 기준 버전                          |

릴리스 PR 제목은 `pull-request-title-pattern: "release(portfolio): ${version}"`으로 기존 관례에 맞췄다. 체인지로그는 `apps/portfolio/CHANGELOG.md`에 생성되며 `feat`·`fix`·`perf`·`refactor`만 노출한다.

---

## 7. 운영 절차

### 일반 릴리스

```
1. develop에서 작업, feat:/fix: 커밋 (기존과 같음)
2. develop → master PR 머지
3. [자동] release-please가 "release(portfolio): 0.4.0" PR을 연다 — 버전은 커밋 타입으로 결정
4. 릴리스 PR 머지
5. [자동] 태그 portfolio@0.4.0 + GitHub Release 발행 → deploy-portfolio.yml 실행
6. master → develop 백머지
```

수동 단계가 4개(버전 범프 PR·develop→master·태그·Release)에서 2개(develop→master·릴리스 PR 머지)로 줄고, 버전 범프·체인지로그·태그·Release가 자동화된다.

### hotfix

```
1. master에서 hotfix/xxx 브랜치 생성   ← develop을 거치지 않는다
2. fix(portfolio): ... 커밋
3. hotfix → master PR 머지
4. [자동] "release(portfolio): 0.4.1" PR — fix:라서 patch
5. 릴리스 PR 머지 → [자동] 태그·Release·배포
6. master → develop 백머지                ← 빠뜨리면 다음 릴리스에서 버그가 되살아난다
```

### 주의: 릴리스 PR을 열어두지 말 것

develop→master를 머지해 릴리스 PR(예: 0.5.0)이 열려 있는 상태에서 hotfix가 master에 들어오면, release-please는 새 PR을 만들지 않고 **열려 있던 PR에 fix를 합친다.** 그러면 hotfix만 따로 내보낼 수 없다. **develop→master를 머지했으면 릴리스 PR을 바로 머지한다.**

### 백머지가 필요한 이유

릴리스 PR이 master의 `package.json`을 올리는데 develop은 이전 버전에 머문다. 백머지를 안 하면 hotfix 코드가 develop에 없어 다음 릴리스에서 버그가 되살아나고, `package.json` 버전이 충돌하거나 뒤로 간다.

---

## 8. 범위 밖

**브랜치 전략 자체는 바꾸지 않는다.** GitHub Flow로 단순화하는 안(main 하나 + 짧은 feature 브랜치)도 검토했으나, 현재는 일반적인 Git Flow를 익히는 것이 목적이므로 유지한다. 이 문서는 **릴리스 작업의 자동화**만 다룬다.
