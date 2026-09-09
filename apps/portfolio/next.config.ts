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
    ];
  },
};

export default nextConfig;
