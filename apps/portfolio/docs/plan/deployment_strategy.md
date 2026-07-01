# Vercel 배포 전략 명세서 (Turborepo 모노레포)

## 1. 개요

이 문서는 `mono-lab` 모노레포(Turborepo) 환경에서 개별 앱(Portfolio, Resume 등)을 안전하고 효율적으로 배포하기 위한 CI/CD 전략과 세팅 방법을 명세합니다.

### 1.1 핵심 배포 파이프라인

- **Preview (Staging) 환경:** `develop` 브랜치에 코드가 푸시되면 지속적 통합(Continuous Integration)을 위해 자동으로 임시 테스트 도메인에 배포됩니다.
- **Production (운영) 환경:** `master` 브랜치에 코드가 병합(Merge)되는 것만으로는 배포되지 않으며, **오직 명시적인 버전 태그(Tag)가 푸시되었을 때만** 실제 라이브 도메인에 배포됩니다.

### 1.2 모노레포 대응

- 하나의 GitHub 저장소(`mono-lab`)에서 여러 앱이 관리되므로, Vercel 상에서도 앱 개수만큼 독립적인 프로젝트를 생성하여 관리합니다.
- `turbo-ignore`를 활용하여 변경사항이 발생한 특정 앱만 타겟팅하여 빌드함으로써 빌드 리소스(시간)를 절약합니다.

---

## 2. 배포 인프라 구축 과정

### Step 1. 앱별 Vercel 프로젝트 분할 생성

각 앱(포트폴리오, 이력서 등)을 별도의 Vercel 프로젝트로 취급하여 환경변수와 도메인을 독립적으로 관리합니다.

1.  Vercel 대시보드에서 `Add New Project` 클릭 후 `mono-lab` 레포지토리 Import
2.  프로젝트 설정:
    - **Project Name:** `portfolio-prod` (또는 원하는 이름)
    - **Root Directory:** `apps/portfolio`
3.  추후 `resume` 등 다른 앱 추가 시 위 1~2번 과정을 반복 (Root Directory를 `apps/resume`으로 지정)

### Step 2. Turborepo 스마트 빌드 방지 (Vercel Built-in 기능 활용)

모노레포 특성상 포트폴리오 코드를 수정했을 때 관련 없는 이력서 앱까지 동시에 빌드되는 것을 막기 위한 필수 설정입니다. 과거에는 수동 스크립트(`turbo-ignore`)가 필요했으나, 현재는 Vercel에 내장되어 자동 처리됩니다.

1.  생성한 각 Vercel 프로젝트의 `Settings` -> 좌측 **`Build and Deployment`** 메뉴로 이동합니다.
2.  **`Ignored Build Step`** 항목을 찾습니다.
3.  드롭다운 옵션을 **`Automatic`**으로 설정하고 저장합니다.
    _(효과: Vercel이 내장된 Turborepo 엔진을 통해 종속성을 완벽히 계산하여, 관련 없는 앱의 빌드를 똑똑하게 스킵합니다.)_

### Step 3. Tag 기반 Production 통제 파이프라인 (GitHub Actions)

Vercel의 기본 커밋 기반 배포를 무력화하고, 안전한 태그(Tag) 기반 배포 통제권을 확보하기 위해 GitHub Actions를 도입합니다.

1.  **Vercel 자동 배포 무력화 (`vercel.json` 생성):**
    - `apps/portfolio/vercel.json` 파일을 생성하여 `master` 브랜치의 자동 배포를 차단합니다.
    - 내용: `{ "git": { "deploymentEnabled": { "master": false } } }`
2.  **Vercel 인증 키 발급 및 GitHub Secrets 등록:**
    - Vercel CLI(`npx vercel link`)를 사용하여 로컬과 연동하고, 생성된 `.vercel/repo.json`에서 프로젝트 식별자를 추출합니다.
    - 추출한 3가지 값(`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_PORTFOLIO`)을 GitHub Repository Secrets에 등록하여 Actions 봇에게 배포 권한을 부여합니다.
3.  **GitHub Actions Workflow 작성 (`.github/workflows/deploy-portfolio.yml`):**
    - `portfolio@*` 형태의 태그가 푸시될 때만 발동되도록 트리거를 설정합니다.
    - GitHub Secrets에 등록된 보안 키를 활용하여, Vercel CLI(`vercel build`, `vercel deploy`) 명령어를 통해 프로덕션 환경에 코드를 안전하게 밀어 넣는 스크립트를 작성합니다.

---

## 3. 워크플로우 시나리오 (개발자 일상)

### 시나리오 A: 기능 개발 및 Staging 테스트

1.  로컬에서 기능을 개발하고 `develop` 브랜치에 커밋
2.  `git push origin develop`
3.  **결과:** Vercel이 변경된 코드를 감지하고, 해당 앱의 **Preview 임시 도메인**에 배포 완료. 모바일 기기 등을 통해 실제 환경에서 UI 및 인터랙션 테스트 진행.

### 시나리오 B: 개발 완료 및 릴리즈 대기

1.  `develop`의 코드를 `master`로 병합 (PR Merge)
2.  `git push origin master`
3.  **결과:** GitHub Actions가 일반 커밋으로 인식하여 Vercel에 배포 명령을 내리지 않음. **어떠한 배포도 일어나지 않는 안전한 대기(Standby) 상태 유지.**

### 시나리오 C: 최종 운영(Production) 배포

1.  릴리즈 준비가 완료되면 터미널에서 태그 생성
    - `git tag portfolio@1.0.0`
2.  생성된 태그를 GitHub으로 푸시
    - `git push origin portfolio@1.0.0`
3.  **결과:** GitHub Actions가 지정된 태그를 감지, Vercel CLI를 통해 **Production 라이브 도메인**에 최종 배포 성공.
