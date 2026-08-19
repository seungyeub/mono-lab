import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
