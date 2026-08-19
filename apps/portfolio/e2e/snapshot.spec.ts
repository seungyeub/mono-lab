import { test, expect } from '@playwright/test';

test.describe('Visual Snapshot Tests (Component-level)', () => {
  test('Capture Core Sections', async ({ page }) => {
    // 1. 메인 페이지 진입
    await page.goto('/');

    // 2. 폰트/이미지 등 네트워크 리소스가 모두 로드될 때까지 대기
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('main')).toBeVisible();

    // 3. PageLoader(1.6초간 화면 전체를 덮는 fixed 오버레이)가 DOM에서 사라질 때까지 대기.
    // 이 대기가 없으면 스냅샷에 로더 오버레이와 스피너가 찍혀 baseline이 오염된다.
    await page.locator('data-testid=page-loader').waitFor({ state: 'detached' });

    // 4. 각 구역(Component)별 스냅샷 촬영
    // fullPage: true를 제거하여 전체 페이지 촬영 시 발생하는 폰트 누적 오차(나비효과)를 방지합니다.
    await expect(page.locator('data-testid=header')).toHaveScreenshot('header-baseline.png');
    await expect(page.locator('data-testid=hero-section')).toHaveScreenshot('hero-baseline.png');
    await expect(page.locator('data-testid=works-section')).toHaveScreenshot('works-baseline.png');
    await expect(page.locator('data-testid=experience-section')).toHaveScreenshot(
      'experience-baseline.png',
    );
    await expect(page.locator('data-testid=faq-section')).toHaveScreenshot('faq-baseline.png');
    await expect(page.locator('data-testid=footer')).toHaveScreenshot('footer-baseline.png');
  });
});
