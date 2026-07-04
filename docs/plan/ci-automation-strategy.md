# CI 및 자동화 봇 구축 전략 (mono-lab)

> **작성일:** 2026-06-09
> **대상 프로젝트:** mono-lab (Turborepo + pnpm 기반 모노레포)
> **레포지토리 상태:** Public (SaaS 도구 완전 무료 사용 가능)

이 문서는 mono-lab 프로젝트에 단단한 CI 파이프라인을 구축하고, 그 위에 AI PR 리뷰 봇과 코드 품질 검사 봇을 통합하기 위한 전체 전략과 아키텍처를 정의합니다.

---

## 1. 프로젝트 특성을 고려한 CI 아키텍처 설계 ✅ [완료]

`mono-lab`은 **Turborepo**와 **pnpm workspaces**를 사용하는 모노레포입니다. 따라서 패키지 간 의존성(`@repo/ui`, `@repo/eslint-config` 등)이 얽혀 있으며, 빌드 속도 최적화가 필수적입니다.

### 1.1 GitHub Actions 기반 기본 파이프라인 (`.github/workflows/ci.yml`)

- **실행 조건 (Triggers)**: `master` 및 `develop` 브랜치로 향하는 PR(Pull Request) 생성 시, 혹은 해당 브랜치에 직접 Push 될 때.
- **실행 환경**: `ubuntu-latest`, Node.js 18.x, pnpm 10.19.0

### 1.2 핵심 단계 (Steps) 및 최적화 전략

1. **저장소 체크아웃 & 환경 세팅**: `actions/checkout`과 `actions/setup-node`를 사용하여 기본 환경 구성.
2. **의존성 설치 및 pnpm 스토어 캐싱**: `pnpm install`을 수행하되, 매번 수백 MB의 패키지를 다운로드하지 않도록 pnpm global store를 캐싱합니다.
3. **Turborepo 전용 빌드 캐싱**: 가장 중요한 단계입니다. `.turbo` 디렉토리를 GitHub Actions 캐시에 연동합니다. 이렇게 하면 코드가 변경되지 않은 패키지(예: `@repo/ui`를 수정하지 않고 `portfolio` 앱만 수정한 경우)는 빌드와 린트를 생략하여 시간을 획기적으로 단축합니다.

- 질문: github cache를 쓸 필요는 없는건가?

4. **코드 포맷팅 검증**: `pnpm run format`을 실행하여 Prettier 룰이 지켜졌는지 확인합니다. (위반 시 즉시 에러 발생 및 CI Block)
5. **Linting 검증**: `pnpm run lint`를 실행. `@repo/eslint-config`에 정의된 룰을 모든 워크스페이스에 걸쳐 병렬 검사합니다.
6. **Type Checking 검증**: `pnpm run check-types`를 실행. `@repo/typescript-config` 기반의 엄격한 컴파일 에러를 사전에 차단합니다.
7. **테스트 검증 (추가 예정)**: 추후 Jest가 도입될 것을 대비하여 `pnpm run test` 명령을 파이프라인에 추가해 둡니다.
8. **Production 빌드 검증**: `pnpm run build`를 실행하여 실제 배포 전에 빌드 크래시가 없는지 최종 확인합니다.

---

## 2. 정적 분석 봇 (코드 품질 검사) ✅ [완료]

단순한 문법 검사(ESLint)를 넘어, 보안 취약점, 복잡도(Code Smell), 중복 코드를 스캔하는 봇을 도입합니다.

- **도구 선정**: **SonarCloud** (오픈소스 프로젝트 기준 무료, 엔터프라이즈급 신뢰도)
- **동작 원리**:
  - CI 파이프라인의 맨 마지막 단계에 Sonar 스캐너를 연결합니다.
  - 빌드가 끝나면 소스코드를 분석하여 GitHub PR 코멘트에 리포트를 남깁니다.
  - 만약 '새로 작성한 코드의 버그 비율이 0%를 초과'하거나 '테스트 코드 커버리지가 미달'하면 PR의 병합(Merge)을 차단(Block)하는 **Quality Gate** 역할을 수행합니다. (추후 추가할 Jest 테스트 결과와 연동)

---

## 3. AI PR 리뷰 봇 통합 ✅ [완료]

기계가 잡지 못하는 아키텍처 규칙, 네이밍 컨벤션, 더 나은 로직(리팩토링) 제안을 수행할 AI를 도입합니다.

- **도구 선정**: **CodeRabbit** (현재 가장 높은 평가를 받는 GitHub App 방식의 AI 봇)
- **동작 원리**:
  - GitHub App을 설치하면 별도의 서버 인프라 구축 없이 즉시 동작합니다.
  - 누군가 PR을 올리면 변경된 Diff를 분석하여 사람이 리뷰하는 것처럼 라인별 코멘트(Inline Comment)를 달아줍니다.
- **mono-lab 특화 커스텀 (프롬프트 주입)**:
  - 프로젝트 루트에 `.coderabbit.yaml` 파일을 생성하여 다음과 파이프라인 mono-lab 고유의 룰을 주입합니다.
    - _"해당 프로젝트는 Next.js App Router 환경입니다. Server Component와 Client Component(`"use client"`)의 구분을 명확히 하고 있는지 확인하세요."_
    - _"모든 커스텀 스타일링은 Tailwind CSS v4 토큰을 사용해야 하며, 공유 패키지인 `@repo/ui`의 패턴을 재사용하는 방향으로 조언하세요."_
    - _"테스트 코드가 누락된 중요한 비즈니스 로직이 있다면 Jest 테스트를 작성하도록 권장하세요."_
    - _"이 리뷰는 참고용이므로 병합을 Block하지 않습니다."_

---

## 4. 요약 및 기대 효과

1. **로컬 에러 방지**: 개발자 PC 환경 차이로 인한 에러 원천 차단.
2. **리뷰 시간 단축**: 휴먼 에러(오타, 린트 에러)는 CI가 잡고, 기본 코드 리뷰는 AI 봇이 초벌구이 해주므로, 인간 개발자는 '비즈니스 로직과 기획 의도'에만 집중해서 리뷰할 수 있습니다.
3. **테스트 및 아키텍처 일관성 유지**: 추후 도입될 Jest 테스트와 SonarCloud 커버리지 연동, CodeRabbit의 아키텍처 리뷰를 통해 지속 가능하고 건강한 모노레포를 유지할 수 있습니다.
