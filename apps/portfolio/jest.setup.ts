import '@testing-library/jest-dom';

/**
 * jsdom은 window.matchMedia를 제공하지 않는다.
 * 반응형 분기를 쓰는 컴포넌트(WorkGrid 등)가 effect에서 이를 호출하면
 * TypeError로 죽으므로 최소 구현을 채워 둔다.
 *
 * 기본값은 matches: false — 모바일 우선으로, SSR 초기 상태와 같다.
 * 특정 테스트에서 데스크톱을 흉내 내려면 이 함수를 직접 목킹하면 된다.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
