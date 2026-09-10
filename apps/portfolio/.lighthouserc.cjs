/* global module */
module.exports = {
  ci: {
    collect: {
      // 빌드된 Next.js 프로덕션 서버를 띄움
      startServerCommand: 'pnpm run start',
      startServerReadyPattern: 'Ready in', // Next.js가 준비 완료 시 출력하는 메시지
      url: ['http://localhost:3000/'],
      // 1회는 편차가 커서 같은 코드도 점수가 오르내렸다. 3회 재고 중앙값으로 판정한다
      numberOfRuns: 3,
      // 모바일 우선 색인(Mobile-First Indexing) 기준에 맞춰 기본값인 모바일 환경으로 성능 테스트 진행
    },
    assert: {
      aggregationMethod: 'median',
      assertions: {
        // 성능(Performance)은 애니메이션(3D) 등을 고려하여 일단 Warn(경고)로 설정.
        // CI 러너(2코어)에서 빌드·서버·크롬을 함께 돌리는 데다 시뮬레이션이 그 실측을 4배로
        // 다시 늦춰 로컬(0.75)보다 크게 낮게(0.3) 나온다 — 임계값 상향은 리포트로 원인을 확인한 뒤
        'categories:performance': ['warn', { minScore: 0.7 }],
        // 접근성(Accessibility), Best Practices, SEO는 기준치 미달 시 Error(실패)로 설정
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      // temporary-public-storage는 7일짜리 링크만 남기고 manifest.json을 쓰지 않아
      // PR 댓글 단계가 "Manifest not found"로 매번 조용히 끝났다. 파일로 남기고
      // 워크플로가 아티팩트로 올린다 — 관측값·러너 지표까지 사후 분석이 가능하다
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
