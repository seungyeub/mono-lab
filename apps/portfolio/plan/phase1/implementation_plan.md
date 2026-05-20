# [Goal Description]

작성된 PRD에 따라 **Phase 1: 템플릿 복제 및 포트폴리오 초기 세팅** 작업을 진행합니다.
앞서 구축한 `frontend-foundation` 템플릿을 새로운 작업 공간인 `mono-lab` 폴더로 가져와 뼈대를 잡고, 메인 앱의 이름을 `apps/portfolio`로 변경합니다. 이후 Framer Motion, Zustand, Lenis 등 포트폴리오 구현에 필수적인 라이브러리들을 설치하여 본격적인 개발 환경을 구축하는 것이 목표입니다.

## Proposed Changes

### 1. 템플릿 복제 및 이름 변경
*   **복제:** 앞서 생성한 `frontend-foundation`의 코드(Git 히스토리 제외)를 `mono-lab` 폴더로 복사합니다.
*   **[MODIFY]** `package.json`: 모노레포 최상위 프로젝트 이름을 `mono-lab`으로 변경합니다.
*   **이름 변경:** 템플릿의 기본 앱인 `apps/web` 폴더명을 `apps/portfolio`로 변경하고, 내부 `package.json`의 이름도 수정합니다.
*   **패키지 설치:** `pnpm install`을 실행하여 워크스페이스 의존성을 초기화합니다.

### 2. 포트폴리오 코어 라이브러리 설치
*   `apps/portfolio` 에 다음 라이브러리를 설치합니다:
    *   **애니메이션:** `framer-motion`, `@studio-freight/lenis`
    *   **상태 관리:** `zustand`
    *   **기타 유틸:** `lucide-react`, `clsx`, `tailwind-merge`

### 3. 디렉토리 구조 셋업 (`apps/portfolio/src/`)
*   PRD에 명시된 아키텍처에 따라 아래 빈 폴더 구조를 미리 생성합니다.
    *   **[NEW]** `apps/portfolio/src/features/`: 도메인별 캡슐화된 컴포넌트 폴더
    *   **[NEW]** `apps/portfolio/src/store/`: Zustand 상태 관리 폴더
    *   **[NEW]** `apps/portfolio/src/contents/`: 정적 마크다운(MDX) 데이터 폴더
