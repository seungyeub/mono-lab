import { test, expect } from '@playwright/test';

test.describe('Visual Snapshot Tests (Full Page)', () => {
  test('Capture Core Sections', async ({ page }) => {
    // 1. 메인 페이지 진입
    await page.goto('/');

    // 2. 폰트/이미지 등 네트워크 리소스가 모두 로드될 때까지 대기
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('main')).toBeVisible();

    // 3. 전체 페이지 스냅샷 캡처 (1px 박스 오차 방지를 위해 통짜 캔버스로 캡처)
    await expect(page).toHaveScreenshot('home-page-baseline.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05, // 폰트 렌더링 나비효과를 덮기 위한 넉넉한 픽셀 오차 허용치
    });
  });
});
