/* eslint-disable turbo/no-undeclared-env-vars */
// [경고 무시 이유]
// playwright.config.ts는 단순히 테스트 실행 옵션(재시도 횟수 등)을 분기하기 위해 process.env.CI를 참조할 뿐,
// 실제 Next.js 앱 빌드 결과물(.next)에 아무런 영향을 주지 않습니다.
// 만약 이 경고를 해결하고자 turbo.json에 CI를 등록해버리면, 로컬과 CI 서버 간의 환경변수 불일치로 인해
// Turborepo의 원격 캐싱(Remote Caching)이 완전히 파괴되어 빌드 시간이 기하급수적으로 늘어납니다.
// 따라서 아키텍처 관점에서 해당 경고를 무시하는 것이 올바른 최적화 방향입니다.

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  snapshotPathTemplate:
    '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  // OS 간 폰트 렌더링 차이 허용치 (5%) 및 애니메이션 비활성화 (Flaky 테스트 방지)
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
      // 스크린샷을 찍을 때 스크롤바를 숨겨서 1px 오차 방지
      stylePath: 'e2e/screenshot-spec.css',
    },
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari (Standard)',
      use: { ...devices['iPhone 12'] }, // 기준 390px
    },
    {
      name: 'Mobile Safari (Min-Width)',
      use: { ...devices['iPhone 11 Pro'] }, // 최소 방어선 375px
    },
  ],

  // 테스트 실행 전 Next.js 서버를 자동으로 띄움 (사전 빌드 필요)
  webServer: {
    command: 'pnpm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
