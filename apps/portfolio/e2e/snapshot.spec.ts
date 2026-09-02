import { test, expect, type Page } from '@playwright/test';

/**
 * whileInView 리빌(카드 stagger·SkillChips 등)은 뷰포트 진입 시에만 발화하는데,
 * 스크린샷은 실제 스크롤 없이 찍혀 화면 아래 요소가 opacity 0으로 남는다.
 * 캡쳐 전에 페이지를 끝까지 훑어 once:true 리빌을 전부 발화시킨다.
 */
async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
    // 발화만으로는 부족하다 — 리빌이 끝나야 한다. Works 카드는 stagger가
    // 카드당 0.1s씩 붙고(8장이면 최대 0.7s) 트랜지션이 0.9s라 1.6s가 필요하고,
    // CI 컨테이너는 로컬보다 느리다. 여유를 둬 미완성 상태가 굳는 것을 막는다.
    await new Promise((resolve) => setTimeout(resolve, 2500));
  });
}

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

    // 4. 화면 아래 섹션의 리빌까지 발화시킨 뒤 촬영 (미발화 시 카드가 빈 채로 굳는다)
    await revealAll(page);

    // 5. 각 구역(Component)별 스냅샷 촬영
    // fullPage: true를 제거하여 전체 페이지 촬영 시 발생하는 폰트 누적 오차(나비효과)를 방지합니다.
    await expect(page.locator('data-testid=header')).toHaveScreenshot('header-baseline.png');
    await expect(page.locator('data-testid=hero-section')).toHaveScreenshot('hero-baseline.png');
    await expect(page.locator('data-testid=works-section')).toHaveScreenshot('works-baseline.png');
    await expect(page.locator('data-testid=experience-section')).toHaveScreenshot(
      'experience-baseline.png',
    );
    await expect(page.locator('data-testid=faq-section')).toHaveScreenshot('faq-baseline.png');
    // 캐러셀은 외부 CDN GIF 243장을 lazy-load하므로 로드 여부가 실행 환경/타이밍마다 달라진다.
    // 해당 영역만 마스킹해 나머지(라벨·태그 바·철학 문구·버튼) 회귀는 계속 감지한다.
    await expect(page.locator('data-testid=epilogue-section')).toHaveScreenshot(
      'epilogue-baseline.png',
      { mask: [page.locator('data-testid=epilogue-carousel')] },
    );
    await expect(page.locator('data-testid=footer')).toHaveScreenshot('footer-baseline.png');
  });

  // Work 상세는 P1-1에서 섹션이 대폭 늘어난 화면인데 VRT 사각지대였다.
  // 대표 프로젝트 한 곳을 촬영해 구조 변경 시 회귀를 감지한다.
  test('Capture Work Detail Page', async ({ page }) => {
    // order 1이자 구조화 섹션(Overview·Tech Stack·Features·Implementation·Impact)이
    // 전부 채워진 대표 프로젝트를 촬영한다.
    await page.goto('/work/app-review-tracker');

    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('data-testid=work-detail')).toBeVisible();
    await page.locator('data-testid=page-loader').waitFor({ state: 'detached' });

    await revealAll(page);

    await expect(page.locator('data-testid=work-detail')).toHaveScreenshot(
      'work-detail-baseline.png',
    );
  });
});
