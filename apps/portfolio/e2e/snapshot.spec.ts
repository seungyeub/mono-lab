import { test, expect } from '@playwright/test';

test.describe('Visual Snapshot Tests', () => {
  test('Home Page Snapshot', async ({ page }) => {
    // 1. 메인 페이지 진입
    await page.goto('/');
    
    // 2. 폰트/이미지 등 네트워크 리소스가 모두 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
    
    // 3. 전체 화면 스냅샷 촬영 및 기준점(Golden Master)과 비교
    // 로컬 최초 실행 시 에러가 발생하며 기준점 이미지 자동 생성
    await expect(page).toHaveScreenshot('home-page-baseline.png', { fullPage: true });
  });

  // 향후 /work, /about 등 핵심 페이지 테스트를 이 곳에 추가할 수 있습니다.
});
