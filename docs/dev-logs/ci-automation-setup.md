# 🛠️ 개발 일지: GitHub Actions CI 및 자동화 봇(CodeRabbit, SonarCloud) 구축기

> **작성일:** 2026-06-10
> **작성자:** Seungyeub
> **대상 프로젝트:** `mono-lab` (Turborepo + pnpm 기반 모노레포)

## 1. 개요 및 요구사항

이 문서는 프로젝트의 안정성을 보장하기 위해 GitHub Actions 기반의 CI 파이프라인을 구축하고, AI 코드 리뷰 봇(CodeRabbit)과 정적 코드 분석 봇(SonarCloud)을 도입하여 완벽한 자동화 테스트/리뷰 환경을 구성한 과정을 상세히 기록한 일지입니다.

**[요청사항 프롬프트 요약]**

> "GitHub Actions CI-CD 테스트 환경 구축 과정을 흐름대로 상세히 작성해 주세요. 작성한 파일들은 한 줄 한 줄 주석을 달아 설명해 주고, CodeRabbit과 SonarCloud의 홈페이지 로그인부터 토큰 발급, 슬랙 연동, 자동 분석(Automatic Analysis) 끄기, 커버리지 제외 규칙(`sonar.coverage.exclusions`) 등 모든 설정 과정을 스크린샷 보듯 상세히 적어주세요. 발생할 수 있는 이슈 트러블슈팅도 반드시 포함해 주세요."

---

## 2. 초기 설계 및 전략 (Strategy)

작업 전 `docs/plan/ci-cd-automation-strategy.md`를 통해 다음과 같은 전략을 수립했습니다.

1. **GitHub Actions 최적화:** Turborepo와 pnpm을 사용하는 모노레포의 특성상 의존성 설치와 빌드 시간이 오래 걸리므로, `pnpm store` 캐싱과 `.turbo` 빌드 캐싱을 파이프라인에 도입하여 속도를 극대화합니다.
2. **코드 품질 파수꾼 (SonarCloud):** 문법 검사(ESLint)를 넘어 보안 취약점, Code Smell, 테스트 커버리지를 엄격히 스캔하여 기준치 미달 시 병합(Merge)을 차단(Block)하는 Quality Gate 역할을 맡깁니다.
3. **AI 코드 리뷰어 (CodeRabbit):** 기계가 잡지 못하는 아키텍처 규칙과 리팩토링 제안을 수행하는 멘토 역할의 AI를 도입합니다.

---

## 3. GitHub Actions 파이프라인 구축 (`ci.yml`)

아래는 저장소에 PR이 올라올 때마다 실행되는 파이프라인 설정 파일입니다.

**`.github/workflows/ci.yml`**

```yaml
# 파이프라인의 이름입니다. GitHub Actions 탭에서 이 이름으로 표시됩니다.
name: CI & Quality Check

# 어떤 이벤트가 발생했을 때 이 파이프라인을 돌릴지 정의합니다.
on:
  push:
    branches:
      - master
      - develop
  pull_request:
    # PR이 열릴 때, 코드가 추가로 푸시(동기화)될 때, 닫혔던 PR이 다시 열릴 때 실행합니다.
    types: [opened, synchronize, reopened]

jobs:
  build-and-test:
    name: Build, Test & Scan
    # Ubuntu 최신 버전의 가상 머신(러너) 위에서 실행됩니다.
    runs-on: ubuntu-latest

    steps:
      # 1. 깃허브 저장소의 코드를 가상 머신으로 내려받습니다.
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          # SonarCloud가 정확한 분석(Blame 등)을 하려면 전체 커밋 히스토리가 필요하므로 0을 줍니다.
          fetch-depth: 0

      # 2. Node.js 환경을 세팅합니다. (로컬과 버전이 다르면 에러가 나므로 꼭 맞춥니다)
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      # 3. npm 대신 사용하는 패키지 매니저인 pnpm을 설치합니다.
      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 10.19.0
          run_install: false # 캐시를 먼저 확인해야 하므로 즉시 설치는 막아둡니다.

      # 4. pnpm 패키지들이 저장되는 글로벌 스토어의 경로를 가져와 변수에 저장합니다.
      - name: Get pnpm store directory
        id: pnpm-cache
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      # 5. pnpm 스토어를 캐싱(저장)해두어 다음 실행 시 다운로드 속도를 비약적으로 높입니다.
      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      # 6. 캐시를 활용하여 의존성 패키지들을 설치합니다. (lock 파일을 엄격히 지킴)
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # 7. 모노레포의 꽃인 Turborepo 빌드 산출물(.turbo)을 캐싱하여 변경 안 된 패키지의 작업을 건너뜁니다.
      - name: Cache Turborepo
        uses: actions/cache@v4
        with:
          path: .turbo
          key: ${{ runner.os }}-turbo-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-turbo-

      # 8. Prettier 포맷팅 검증 (들여쓰기, 따옴표 등이 어긋나면 여기서 즉각 에러를 발생시킵니다)
      - name: Format Check
        run: pnpm run format:check

      # 9. ESLint 문법 및 코드 스타일 검증
      - name: Lint
        run: pnpm run lint

      # 10. TypeScript 타입 에러 검증 (최신 Node 24.x 버전 필요)
      - name: Type Check
        run: pnpm run check-types

      # 11. Jest 테스트 및 커버리지 추출 (이 단계에서 lcov.info 파일이 생성됩니다)
      - name: Test & Coverage
        run: pnpm run test

      # 12. 최종 프로덕션 빌드가 문제없이 진행되는지 확인
      - name: Build Production
        run: pnpm run build

      # 13. 모든 검사가 끝나면, 산출물을 SonarCloud로 보내어 품질을 정밀 분석합니다.
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }} # (SonarCloud에서 발급받은 비밀 키)
        # 위 단계(Lint, Test 등)에서 에러가 나서 실패하더라도 커버리지나 에러를 리포팅하기 위해 반드시 실행되게 만듭니다.
        if: always()
```

---

## 4. AI 코드 리뷰 봇 연동 가이드 (CodeRabbit)

> 🔗 **공식 사이트:** [https://coderabbit.ai](https://coderabbit.ai)

### 4.1. 홈페이지 연동 과정 상세

1. **로그인 및 설치:** 홈페이지 접속 후 `Sign in with GitHub`를 클릭합니다. 대시보드에서 `Install CodeRabbit` 버튼을 눌러 GitHub App 설치 화면으로 넘어갑니다.
2. **Repository 선택 (중요):** `All repositories` (모든 레포 허용) 보다는 **`Only select repositories`** 를 선택하여 현재 프로젝트(`mono-lab`)만 명시적으로 선택하는 것이 보안상 훨씬 안전합니다.
3. **초기 화면 (Skip to the app):** 설치 직후 "Review a PR using CodeRabbit" 화면이 뜨면서 PR을 고르라고 합니다. 만약 현재 레포지토리에 열려있는 PR이 없다면 당황하지 마시고 화면 하단이나 우측 상단에 있는 **`Skip to the app`** 버튼을 누르시면 메인 대시보드로 진입합니다. (정확히 기억하셨습니다!)

### 4.2. 커스텀 프롬프트 설정 (`.coderabbit.yaml`)

봇을 설치했다고 끝이 아닙니다. 이 프로젝트만의 특성(Next.js App Router, Tailwind v4 등)을 봇에게 교육시켜야 합니다.

**`.coderabbit.yaml` (루트 디렉토리)**

```yaml
# 봇이 한국어로 대답하도록 강제합니다.
language: 'ko-KR'
# 기본적으로 master 브랜치만 감시하므로, 우리가 쓰는 develop 브랜치에서도 동작하게 추가합니다.
base_branches: ['master', 'develop']
# 봇의 페르소나(성격)를 부여합니다.
tone_instructions: '친절하고 건설적인 시니어 개발자(멘토)의 톤으로 리뷰해주세요.'

reviews:
  # 리뷰 성향: 'chill'(칭찬 위주 가벼운 리뷰) vs 'assertive'(깐깐하고 엄격한 피드백 위주)
  # 포트폴리오의 완성도를 높이기 위해 assertive로 설정합니다.
  profile: 'assertive'

  # 특정 경로에 대해 봇에게 내릴 특별 지시사항입니다.
  path_instructions:
    - path: 'apps/portfolio/**/*.tsx'
      instructions: |
        - 해당 프로젝트는 Next.js App Router 환경입니다.
        - Server Component와 Client Component(`"use client"`)의 구분을 명확히 하고 있는지 확인하세요.
        - 모든 스타일링은 Tailwind CSS v4를 사용하며, @repo/ui 패턴을 재사용하도록 조언하세요.
```

### 4.3. 트러블슈팅: CodeRabbit v2 마이그레이션 및 브랜치 감시 에러

- **현상 (v1 vs v2 스키마 충돌):** 초기 설정 시 구버전(v1) 문법인 `language`, `tone_instructions`, `profile` 등을 섞어 썼더니 봇이 파싱 에러를 내며 '영어권 기본 페르소나(깡통)'로 동작했습니다.
- **해결책:** `.coderabbit.yaml` 파일을 최신 v2 스키마에 맞춰 `chatbot.tone`, `reviews.profile` 구조 등으로 완벽하게 마이그레이션하여, "한국어 시니어 멘토" 페르소나를 성공적으로 주입했습니다.
- **현상 (Base Branches 누락):** 봇이 `master` 브랜치에만 반응하고 `develop` 브랜치 PR에는 이모지(👀)조차 달지 않고 철저히 무시하는 현상이 발생했습니다.
- **해결책:** CodeRabbit 웹 대시보드(Reviews 메뉴) -> `Base branches` 칸에 `develop`을 명시적으로 추가하고 저장(Save)하여, 봇이 모든 개발용 PR을 정상적으로 감시하도록 조치했습니다.

---

## 5. 정적 코드 분석 연동 가이드 (SonarCloud)

> 🔗 **공식 사이트:** [https://sonarcloud.io](https://sonarcloud.io)

### 5.1. 회원가입 및 조직(Organization) 생성

1. **로그인:** 홈페이지에서 `Log in with GitHub` 버튼을 눌러 연동합니다.
2. **Import Repository:** `+` 버튼 혹은 `Analyze new project`를 누르고 GitHub에서 저장소를 불러옵니다.
3. **Create an Organization:** SonarCloud는 GitHub의 '조직' 또는 '개인 계정'과 1:1 매칭되는 공간을 만들어야 합니다.
   - **Key/Name:** 본인의 GitHub 아이디(예: `seungyeub`)로 알아보기 쉽게 적습니다.
   - **Automatically import new GitHub repositories:** **[선택 해제(체크 박스 풀기) 권장]** 이걸 체크해 두면 깃허브에 쓸데없는 더미 프로젝트를 만들 때마다 SonarCloud로 다 끌고 오기 때문에 관리가 지저분해집니다.
   - **Organization Plan:** 코드가 모두에게 공개되는 Public Repository이므로 반드시 **Free Plan**을 선택합니다. (무료 플랜도 모든 프리미엄 분석 기능을 쓸 수 있습니다!)

### 5.2. 프로젝트 분석 (Analyze Projects) 세팅

조직이 만들어지면 방금 불러온 `mono-lab` 레포지토리가 보입니다. 체크박스를 선택하고 **`Set Up`** (또는 Analyze) 버튼을 누릅니다.

1. **분석 방식(Analysis Method) 선택:**
   - 아주 중요합니다. SonarCloud는 친절하게도 자기가 알아서 분석해 주는 `Automatic Analysis`를 추천합니다.
   - 하지만 우리는 이미 GitHub Actions(`ci.yml`)에서 테스트 커버리지까지 뽑아서 넘겨주는 고도화된 방식을 쓰고 있기 때문에 **이 기능을 반드시 꺼야 합니다.**
   - **[해결법]**: 프로젝트 페이지 좌측 메뉴 `Administration` -> `Analysis Method` 메뉴로 들어가서 **`SonarCloud Automatic Analysis` 토글 스위치를 `OFF(끄기)`** 로 돌려버리세요. (만약 물어보면 "With GitHub Actions" 방식을 쓰겠다고 선택하시면 됩니다.)

### 5.3. 토큰 발급 및 만료 기한의 이해 (SONAR_TOKEN)

GitHub Actions가 분석 결과를 SonarCloud로 전송하려면 비밀번호(토큰)가 필요합니다.

- **유저 토큰(User Token) vs 프로젝트 토큰(Project Token)**
  - **유저 토큰:** 내 계정 이름으로 발급되며, 내가 권한을 가진 모든 프로젝트에 쓸 수 있는 마스터키입니다. (경로: 우측 상단 내 프로필 -> `My Account` -> `Security`)
  - **프로젝트 토큰:** 특정 프로젝트(`mono-lab`)에서만 동작하는 키입니다. 여러 명이 협업하는 엔터프라이즈 환경에서 훨씬 안전합니다. (경로: 프로젝트 페이지 -> `Administration` -> `Security` / 최근 SonarQube 생태계에서 적극 권장 중)
  - **비용:** 둘 다 **완전 무료**입니다. 퍼블릭 레포에서는 어떤 토큰을 쓰든 제약이 없습니다.
- **발급받은 토큰 등록 위치 (GitHub Secrets):**
  - 발급받은 토큰 값은 코드에 노출되면 안 됩니다.
  - 깃허브 `mono-lab` 레포지토리 접속 -> **`Settings`** -> 좌측 메뉴 **`Secrets and variables`** -> **`Actions`** 클릭
  - **`New repository secret`** 버튼을 누르고, Name에 `SONAR_TOKEN`, Secret에 발급받은 토큰 값을 붙여넣기 하여 안전하게 보관합니다.
- **만료 기한(Expiration):**
  - 토큰 생성 시 30일, 90일, 1년, 혹은 **No expiration(만료 기한 없음)** 을 선택할 수 있습니다.
  - **만료 기한 연장 여부:** 깃허브에 코드를 Push 하거나 PR을 올린다고 해서 토큰의 기한이 자동으로 늘어나지 않습니다. 설정한 날짜가 되면 무조건 죽습니다.
  - **만료 시 대처법:** 파이프라인(CI)이 갑자기 `Not authorized` 에러를 뿜으며 터집니다. 이때는 당황하지 말고 기존 토큰을 지운 뒤 **새 토큰을 다시 발급받아서 GitHub Secrets(`SONAR_TOKEN`)에 값을 덮어씌워 주면** 바로 다시 작동합니다. 개인 프로젝트라면 편의상 'No expiration'을 하는 것도 나쁘지 않습니다.

### 5.4. Sonar 설정 파일 작성 및 커버리지 면제 (`sonar-project.properties`)

프로젝트 루트에 이 파일을 만들어 둬야 Sonar 스캐너가 이 레포지토리의 정보를 인식합니다.

**`sonar-project.properties`**

```properties
# SonarCloud에 등록된 나의 조직 키와 프로젝트 고유 키
sonar.projectKey=seungyeub_mono-lab
sonar.organization=seungyeub

# UI에 표시될 이름
sonar.projectName=mono-lab
sonar.projectVersion=1.0

# 검사할 폴더와 검사에서 제외할 폴더들 (테스트 코드 자체는 검사받지 않음)
sonar.sources=apps,packages
sonar.exclusions=**/node_modules/**,**/.next/**,**/dist/**,**/coverage/**,**/*.test.tsx,**/*.test.ts,**/*.config.ts,**/*.setup.ts

sonar.sourceEncoding=UTF-8

# GitHub Actions의 Jest가 만들어낸 커버리지 리포트 위치를 가리킴
sonar.javascript.lcov.reportPaths=apps/portfolio/coverage/lcov.info

# 💡 테스트 커버리지 요구사항에서 전체 tsx, ts 파일 면제
# SonarCloud의 기본 룰은 "새 코드는 무조건 80% 이상의 테스트를 짜라" 입니다.
# 하지만 프론트엔드 UI 컴포넌트(tsx)는 수시로 바뀌기 때문에 엄격히 검사하면 파이프라인이 계속 터집니다.
sonar.coverage.exclusions=**/*.tsx,**/*.ts
```

> **앞으로의 활용법 예시:**
> 현재는 당장의 개발 속도를 위해 `tsx`(UI)와 `ts`(로직) 파일 모두 커버리지 검사를 피하도록 `**/*.tsx,**/*.ts` 로 덮어두었습니다.
> 추후 "이제 핵심 비즈니스 로직은 테스트 코드를 꼼꼼히 짜야지!" 하는 시점이 오면, 저 라인에서 `,**/*.ts` 만 쏙 지우세요. 그러면 **UI 껍데기(`tsx`)는 여전히 봐주면서, 알맹이 로직(`ts`)은 80% 룰을 깐깐하게 적용받는 완벽한 실무 세팅**이 됩니다.
> **💡 대안: Quality Gate (품질 게이트) 자체를 커스텀하기**
> 파일에 예외(`exclusions`) 규칙을 적는 것 대신, 아예 SonarCloud 대시보드(웹) 메뉴에서 "우리 프로젝트는 테스트 커버리지가 80%가 아니라 50%만 넘어도 합격시켜 주자!" 혹은 "개발 초기니까 커버리지 검사 항목 자체를 조건에서 빼버리자!" 라고 **Quality Gate 룰 자체를 입맛에 맞게 커스텀**하는 것도 실무에서 흔히 쓰이는 훌륭한 대안입니다.

---

## 6. 🛡️ 진정한 CI/CD의 완성: 브랜치 보호 규칙 (Branch Protection)

지금까지 세팅한 CI 파이프라인이 단지 시각적인 '경고'에 그치지 않고, **에러가 있을 경우 강제로 병합(Merge)을 막아버리도록** 설정해야 완벽한 방어막이 완성됩니다.

### 설정 방법

1. 깃허브 레포지토리 **`Settings`** -> 좌측 메뉴 **`Branches`** 로 이동합니다.
2. `Branch protection rules` 옆의 **`Add rule`** 버튼을 클릭합니다.
3. **Branch name pattern**에 `develop` (또는 `master`)을 입력합니다.
4. 아래 옵션 중 **`Require status checks to pass before merging`** 체크박스를 켭니다.
5. 검색창에 다음 두 가지 필수 체크 항목을 검색해서 추가합니다:
   - `Build, Test & Scan` (우리가 만든 GitHub Actions 파이프라인 이름)
   - `SonarCloud Code Analysis` (SonarCloud 봇이 쏘아주는 Quality Gate 결과)
6. 맨 아래 `Save changes`를 눌러 저장합니다.

### 기대 효과

이제 누군가 에러가 있는 코드를 올리거나 테스트 커버리지가 부족한 코드를 올려서 파이프라인이 빨간색(X)이 되면, **초록색 `Merge pull request` 버튼이 회색으로 비활성화**되어 절대 메인 코드를 오염시킬 수 없게 됩니다! 진정한 자동화의 완성입니다.

---

## 7. 🚨 주의해야 할 트러블슈팅 (Troubleshooting)

이 환경을 세팅하면서 마주쳤던 무시무시한 에러들과 그 해결책입니다.

### 1. "Node.js 버전 불일치로 인한 Type Check 에러"

- **현상:** 로컬(내 맥북)에서는 `pnpm check-types`가 멀쩡히 돌아가는데, GitHub Actions에만 올리면 `Next.js requires Node.js >= 20.9.0` 에러를 뿜으며 장렬히 전사했습니다.
- **해결책:** `ci.yml` 파일 내에 `setup-node` 스텝의 `node-version`이 `18`로 구버전 세팅되어 있었습니다. 이를 내 로컬과 똑같은 `24` 버전으로 상향시켜 **환경의 파편화**를 원천 차단했습니다.

### 2. "Lint 파이프라인의 극악무도한 깐깐함 (max-warnings 0)"

- **현상:** CI 파이프라인은 로컬과 달리 경고(Warning) 딱 하나만 있어도 빌드를 실패(Error)로 간주하고 다 터뜨려버립니다.
- **해결책:**
  1. `eslint-plugin-react/no-unknown-property`: Three.js를 사용하는 3D 컴포넌트에서 React가 인식 못하는 속성을 썼다며 에러를 뿜었습니다. `eslint.config.js`에서 이 룰을 `off`로 강제 비활성화하여 타입스크립트의 에러 체킹 능력에만 의존하도록 조치했습니다.
  2. 안 쓰는 `import`문, 이스케이프가 안 된 따옴표(`'`), 명시되지 않은 `any` 타입 등을 모조리 찾아내서 수정했습니다. **"로컬 환경의 쓰레기(경고)를 절대 중앙 저장소로 보내지 않겠다"**는 결연한 의지의 결과물입니다.

### 3. "SonarCloud Analysis Fail 현상"

- **현상:** GitHub Actions에서 SonarCloud Scan이 잘 도는 것 같은데, 대시보드에 가면 여전히 에러가 나거나 코드가 분석되지 않은 것으로 뜹니다.
- **해결책:** 앞서 5.2 섹션에서 언급했듯, SonarCloud 자체 설정 창에서 `Automatic Analysis`가 켜져 있으면 봇들끼리 서로 "내가 분석할게!" 하며 충돌이 납니다. 반드시 **OFF**로 꺼져 있는지 확인하세요.

### 4. "환경변수(.env) 누락으로 인한 CI 빌드 에러"

- **현상:** 내 PC(로컬)에서는 잘 돌아가는데, PR만 올리면 `RESEND_API_KEY is not defined` 같은 에러를 뿜으며 터보레포 빌드/테스트가 터집니다.
- **해결책:** 로컬에는 `.env` 파일이 있지만 GitHub Actions 가상 머신에는 보안상 `.env` 파일이 올라가지 않기 때문입니다. GitHub `Secrets`에 환경변수를 등록하고, (우리가 했던 것처럼) `turbo.json`의 `globalEnv` 배열에 해당 변수명을 명시해야 캐싱 누락 에러를 막을 수 있습니다. CI/CD 구축 시 **무조건 겪게 되는 1순위 에러**이니 가장 먼저 의심하세요.

### 5. "갑자기 CI 빌드 속도가 눈에 띄게 느려진 현상 (캐시 용량 제한)"

- **현상:** pnpm과 터보레포 캐싱 덕분에 10초 만에 끝나던 CI 파이프라인이, 프로젝트가 커진 몇 달 뒤 갑자기 몇 분씩 걸리기 시작합니다.
- **원인:** GitHub Actions는 저장소당 최대 **10GB**의 캐시 공간만 제공합니다. 용량이 10GB를 초과하면 가장 오래된 캐시부터 시스템이 강제로 삭제(Eviction)하기 때문에 캐시 적중률이 떨어지며 일시적으로 느려질 수 있습니다. 에러가 아니라 자연스러운 현상이니 당황하지 않으셔도 됩니다!

---

## 8. 🤖 AI 코드 리뷰(CodeRabbit) 기반 파이프라인 고도화 일지

위 과정을 거쳐 완벽하게 자아를 찾은 **'한국어 시니어 멘토'** CodeRabbit이 파이프라인 코드(\`yml\`, \`cjs\`, \`ts\`)를 정독하고 잡아낸 치명적인 버그와 보안/안정성 개선 사례들입니다. 이 피드백들을 모두 반영하여 파이프라인을 실무 엔터프라이즈급으로 고도화했습니다.

### 1. Playwright 타임아웃 해결 (Flaky Test 원천 차단)

- **문제:** 스냅샷 테스트 시 \`await page.waitForLoadState('networkidle')\`를 사용했으나, Next.js 환경 특성상 백그라운드 요청이 지속되어 간헐적 타임아웃 에러(Flaky)가 발생했습니다.
- **개선:** \`networkidle\` 대신 \`domcontentloaded\` 대기로 전환하고, 핵심 UI 요소인 \`<main>\` 태그의 가시성 검증(\`expect(locator).toBeVisible()\`)을 도입하여 테스트 기준점을 견고하게 다졌습니다.

### 2. Lighthouse CI 무한 대기 버그 해결

- **문제:** Next.js 15 버전업으로 인해 로컬 서버 켜짐 알림 메시지가 \`ready on\`에서 \`Ready in 1250ms\` 형태로 변경되었으나, 설정 파일(\`.lighthouserc.cjs\`)의 \`startServerReadyPattern\`이 과거 버전에 머물러 있어 Lighthouse CI가 무한 대기(Timeout)에 빠졌습니다.
- **개선:** 패턴을 \`Ready in\`으로 정밀하게 수정하여 CI 타임아웃을 미연에 방지했습니다.

### 3. 방어적 프로그래밍 (Defensive Programming) 전면 적용

Lighthouse가 오류로 인해 결괏값을 빼먹거나 손상된 파일을 생성할 경우, 파싱 로직(\`JSON.parse\`)에서 런타임 에러(\`TypeError\`)가 발생해 파이프라인 전체가 뻗어버리는 문제가 있었습니다. (이는 실패 시에도 점수를 띄워주려 했던 \`if: always()\`의 설계 의도를 무너뜨립니다.)

- **개선 1 (빈 배열 및 객체 예외 처리):** \`manifest.length === 0\` 검사를 추가하고, 속성이 누락되었을 때를 대비해 \`const summary = result.summary || {}\` 및 널 병합 연산자(\`(res ?? 0)\`)를 도입하여 \`NaN\` 쓰레기 값이 뜨지 않도록 처리했습니다.
- **개선 2 (try...catch 안전망):** \`manifest.json\`과 \`links.json\`을 읽을 때 \`JSON.parse\` 구문을 모두 \`try...catch\` 블록으로 감싸, 파일이 깨졌더라도 파이프라인이 터지지 않고 "파싱 실패함" 로그만 예쁘게 남긴 뒤 우아하게(Gracefully) 종료되도록 안전망을 두 번 쳤습니다.

### 4. CI/CD 보안 강화 및 리소스 낭비 방지

- **보안 (공급망 방어):** \`playwright.yml\`의 \`actions/checkout@v4\` 단계에서 \`persist-credentials: false\`를 추가하여 토큰 정보의 잔류를 막고, \`permissions: contents: read\`를 명시하여 서드파티 액션의 불필요한 권한 탈취를 막았습니다.
- **효율 (중복 실행 방지):** 모든 워크플로우에 \`concurrency\` (동시성 제어) 옵션을 추가하여, 동일한 브랜치에 코드가 연속으로 Push 될 경우 기존에 돌고 있던 낭비성 파이프라인을 즉각 \`Cancel\` 처리하도록 최적화했습니다.

이 모든 고도화 작업은 AI 리뷰 봇의 단 한 번의 Full Review를 통해 이루어졌으며, 인프라의 내구성이 상상 이상으로 단단해졌습니다.
