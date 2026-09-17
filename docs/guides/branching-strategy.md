# 브랜치 전략 (git-flow)

> **작성일:** 2026-09-16
> **범위:** 저장소 전체. 릴리스 절차의 세부(release-please, 버전 규칙)는 `apps/portfolio/docs/plan/2026-09-03_release-automation.md`가 맡고, 여기서는 반복하지 않는다.

## 1. 왜 git-flow인가

Vincent Driessen이 2010년에 제안한 모델이다. 그는 2020년에 같은 글에 노트를 붙여 "지속 배포하는 웹 앱이라면 GitHub flow처럼 더 단순한 흐름이 맞을 수 있다"고 적었다. 이 저장소가 그 조언과 다르게 git-flow를 유지하는 이유는 두 가지다.

1. **여러 앱이 다른 주기로 릴리스되는 모노레포다.** `apps/portfolio`가 릴리스를 준비하는 동안 다른 앱의 작업이 develop에 계속 쌓인다. release 브랜치가 없으면 "지금 배포할 것"과 "다음에 배포할 것"을 develop 안에서 구분할 수 없다.
2. **실무 흐름을 익히는 것이 목적이다.** hotfix가 master에서 갈라져 develop으로 돌아오는 경로, release 브랜치에서 QA 수정을 하고 양쪽에 반영하는 경로를 직접 밟아 본다. 0.5.1 hotfix와 0.5.3 hotfix가 그 연습이었다.

트렁크 기반이나 GitHub flow로 단순화하는 안은 검토했고, 위 이유로 채택하지 않았다. 다시 제안할 때는 두 이유가 사라졌는지부터 본다.

## 2. 브랜치 역할

| 브랜치                  | 어디서 분기 | 어디로 머지                 | 역할                                                                                          |
| ----------------------- | ----------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| `master`                | —           | —                           | 프로덕션. `portfolio@x.y.z` 태그가 여기 찍히고 태그가 배포를 발화시킨다                       |
| `develop`               | —           | `release/*`                 | 다음 릴리스 후보. 기능 PR이 모이는 곳                                                         |
| `feat/*` `fix/*` `ci/*` | `develop`   | `develop`                   | 작업 단위. PR 하나에 항목 하나가 원칙                                                         |
| `release/x.y.z`         | `develop`   | `master` (→ develop 역머지) | 릴리스 QA. 여기서 고친 것은 master와 develop 양쪽에 들어가야 한다                             |
| `hotfix/x.y.z`          | `master`    | `master` (→ develop 역머지) | 프로덕션 결함. **develop을 거치지 않는다** — develop에는 아직 배포하면 안 되는 것이 섞여 있다 |
| `chore/sync-master-*`   | `master`    | `develop`                   | 역머지 전용. 태그가 생기면 워크플로가 만든다(4절)                                             |

## 3. 머지 방식

방식이 갈리는 이유는 하나다 — **release-please는 PR을 보지 않고 master의 git log를 읽는다.** master에 어떤 커밋이 어떤 제목으로 남느냐가 버전과 CHANGELOG를 정한다.

| PR                                          | 방식             | 제목                                         | 왜                                                                                                                                                                       |
| ------------------------------------------- | ---------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 항목 하나짜리 → `develop`                   | **squash**       | `feat(portfolio): …` 등 Conventional Commits | 작업 중 커밋을 하나로 정리한다. 이 제목이 나중에 CHANGELOG 한 줄이 된다                                                                                                  |
| 여러 항목을 묶은 PR → `develop`             | **Merge commit** | 자유                                         | 항목별 커밋을 살려야 CHANGELOG에 따로 남는다                                                                                                                             |
| `develop`·`release/*`·`hotfix/*` → `master` | **Merge commit** | **Conventional 형식이 아닌 제목**            | 개별 커밋이 master에 그대로 들어가야 release-please가 읽는다. 제목이 `fix(...)`면 merge commit 본문까지 한 건으로 더 세어 CHANGELOG에 요약 줄이 중복된다(0.5.3에서 발생) |
| release-please의 릴리스 PR → `master`       | **squash**       | 자동 생성(`release(portfolio): x.y.z`)       | 버전 파일과 CHANGELOG 갱신 한 건이면 충분하다                                                                                                                            |
| `chore/sync-master-*` → `develop`           | **Merge commit** | 기본값                                       | master의 이력을 develop에 그대로 잇는다                                                                                                                                  |

master로 가는 Merge commit 제목은 `Release 0.6.0 — …` 또는 GitHub 기본값 `Merge pull request #…`처럼 타입 없이 쓴다.

## 4. 역머지 — 자동으로 열리고, 사람이 머지한다

release나 hotfix가 master에 들어가면 develop은 그 변경과 버전 파일(`package.json`, `.release-please-manifest.json`, `CHANGELOG.md`)을 모른다. 역머지를 빠뜨리면 다음 릴리스에서 hotfix가 되살아나고 버전이 뒤로 간다. 0.3.0 때 실제로 빠뜨렸다.

그래서 `.github/workflows/sync-master-to-develop.yml`이 **태그 `portfolio@*`가 생기면** 다음을 한다.

1. develop이 master를 이미 포함하면 PR을 만들지 않고 실행 요약에 "역머지 불필요"를 남긴다.
2. 같은 이름의 PR이 열려 있으면 그 링크만 남긴다. PR은 없는데 브랜치만 남아 있으면 덮어쓰지 않고 실패한다 — 어느 쪽이 맞는지 사람이 봐야 한다.
3. 그 밖에는 master 끝에서 `chore/sync-master-x.y.z`를 만들어 develop 대상 PR을 연다. 본문에 `develop..master` 커밋 목록이 들어간다.

**머지는 자동화하지 않는다.** 충돌 해결과 최종 확인은 사람 몫이고, 규칙대로 Merge commit으로 머지한 뒤 브랜치를 지운다. 태그 이벤트를 놓쳤거나 동작을 확인하고 싶으면 Actions에서 `workflow_dispatch`로 태그를 넣어 돌린다.

토큰은 `RELEASE_PLEASE_TOKEN`(PAT)이다. 기본 `GITHUB_TOKEN`으로 만든 PR에는 CI가 돌지 않기 때문이다(release-please와 같은 이유).

## 5. 릴리스 한 번의 전체 순서

```
1. feat/* → develop           squash
2. develop → release/x.y.z    분기. QA 수정은 여기서
3. release/x.y.z → master     Merge commit, 비conventional 제목
4. [자동] release-please가 릴리스 PR을 연다 → squash 머지
5. [자동] 태그 portfolio@x.y.z → 배포 (deploy-portfolio.yml)
6. [자동] 역머지 PR (sync-master-to-develop.yml) → 사람이 Merge commit
7. release/x.y.z, chore/sync-master-x.y.z 삭제
```

hotfix는 2번 대신 `master → hotfix/x.y.z`로 시작하고 3번부터 같다. 자세한 주의점(릴리스 PR을 열어두지 말 것, release-please의 커밋 집계 범위)은 릴리스 자동화 문서 7절에 있다.
