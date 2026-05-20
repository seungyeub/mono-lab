# [Goal Description]

PRD 마일스톤의 **Phase 4: MDX 파이프라인 구축 및 상세 페이지(Work, About) 구현** 작업을 진행합니다.
포트폴리오의 각 프로젝트(Case Study) 상세 내용을 정적 마크다운(MDX) 파일로 관리할 수 있도록 파이프라인을 구축하고, 전체 프로젝트 목록을 보여주는 `/work` 페이지와 개별 상세 페이지 `/work/[slug]`, 그리고 에이전시 소개를 담은 `/about` 페이지를 제작합니다.

## User Review Required

> [!IMPORTANT]
> **MDX 파이프라인 스택**
> Next.js 14 App Router(서버 컴포넌트) 환경에 가장 적합하고 가벼운 `next-mdx-remote` 라이브러리와 마크다운 헤더 파싱을 위한 `gray-matter`를 사용할 예정입니다. 

## Open Questions

> [!NOTE]
> **페이지 라우팅 명칭에 대한 질문**
> PRD에는 `Work`, `About`, `Contact` 페이지를 만들기로 되어 있습니다.
> 하지만 방금 적용한 Helios 레퍼런스의 Header 메뉴를 보면 `Gallery`, `Work`, `Contact` 로 구성되어 있습니다.
> 
> 질문: PRD 내용대로 `/about` 페이지를 만들까요? 아니면 레퍼런스처럼 `/gallery` 페이지를 만들까요? (만약 `/about`으로 진행한다면 Header 메뉴의 `Gallery`를 `About`으로 수정하겠습니다.)

## Proposed Changes

### 1. MDX 관련 패키지 설치
*   `apps/portfolio` 내부에 `next-mdx-remote`, `gray-matter` 패키지 설치.

### 2. MDX 데이터 처리 유틸리티
*   **[NEW]** `apps/portfolio/src/lib/mdx.ts`: `src/contents/work` 폴더 내의 `.mdx` 파일들을 읽어오고 프론트매터(Frontmatter: 제목, 카테고리, 썸네일 경로 등)를 파싱하는 서버사이드 유틸리티 함수 작성.

### 3. 샘플 콘텐츠 생성 (Helios 테마)
*   **[NEW]** `apps/portfolio/src/contents/work/meltdown-studios.mdx`: 샘플 포트폴리오 상세 내용 1.
*   **[NEW]** `apps/portfolio/src/contents/work/meridiem.mdx`: 샘플 포트폴리오 상세 내용 2.

### 4. Work (포트폴리오 목록 & 상세) 페이지 구현
*   **[NEW]** `apps/portfolio/app/work/page.tsx`: MDX 파일 목록을 파싱하여 그리드 형태로 보여주는 전체 포트폴리오 페이지.
*   **[NEW]** `apps/portfolio/app/work/[slug]/page.tsx`: URL(slug)에 맞는 특정 MDX 파일을 읽어 상세 내용을 렌더링. 레퍼런스와 어울리도록 상단에 꽉 찬 Hero 이미지를 배치하고, 아래에 MDX 텍스트 렌더링.

### 5. 정적 페이지 (About 또는 Gallery) 구현
*   **[NEW]** `apps/portfolio/app/about/page.tsx` (또는 `gallery`): 결정되는 라우팅에 맞춰 정적 레이아웃 구현.

## Verification Plan
*   `/work` 접속 시 샘플 MDX 콘텐츠가 리스트업 되는지 확인.
*   리스트에서 특정 프로젝트 클릭 시 `/work/[slug]` 로 이동하여 상세 내용과 이미지가 정상적으로 출력되는지 확인.
