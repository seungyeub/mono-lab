/* global module */
module.exports = {
  ci: {
    collect: {
      // 빌드된 Next.js 프로덕션 서버를 띄움
      startServerCommand: 'pnpm run start',
      startServerReadyPattern: 'Ready in', // Next.js가 준비 완료 시 출력하는 메시지
      url: ['http://localhost:3000/'],
      numberOfRuns: 1, // PR 체크를 위해 빠른 속도를 유지하도록 1회만 실행
      // 모바일 우선 색인(Mobile-First Indexing) 기준에 맞춰 기본값인 모바일 환경으로 성능 테스트 진행
    },
    assert: {
      assertions: {
        // 성능(Performance)은 애니메이션(3D) 등을 고려하여 일단 Warn(경고)로 설정
        'categories:performance': ['warn', { minScore: 0.7 }],
        // 접근성(Accessibility), Best Practices, SEO는 기준치 미달 시 Error(실패)로 설정
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage', // 결과를 볼 수 있는 임시 링크 제공
    },
  },
};
