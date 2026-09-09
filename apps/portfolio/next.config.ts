import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 타입 오류를 무시하지 않는다 — 오류가 있으면 빌드가 멈춰야 배포되지 않는다 (P6-9)
  async redirects() {
    return [
      // P0-4: Gallery → Resume 전환에 따른 구 경로 영구 리다이렉트
      {
        source: '/gallery',
        destination: '/resume',
        permanent: true,
      },
      /*
        P6-14: /work → /projects 경로 변경에 따른 영구 리다이렉트.
        옛 주소는 색인·공유 링크·북마크에 이미 나가 있어 사라지지 않는다. 301이라야
        방문자가 새 주소로 이어지고 검색 색인도 처음부터 다시 쌓지 않는다.
        `/work` 자체와 하위 상세 11건을 모두 받아야 하므로 두 규칙이 필요하다.
      */
      {
        source: '/work',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/work/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
