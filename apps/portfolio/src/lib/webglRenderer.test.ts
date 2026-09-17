import { detectSoftwareRenderer, isSoftwareRenderer } from '@/lib/webglRenderer';

/**
 * 문자열은 2026-09-16에 실제 브라우저에서 읽은 값이다. 여기서 판정이 어긋나면
 * GPU가 있는 방문자에게 3D 카드가 사라지거나, CI 러너에서 다시 카드가 돈다.
 */

describe('isSoftwareRenderer', () => {
  it.each([
    [
      'Chrome, GPU 끔 / CI 컨테이너 chromium',
      'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (LLVM 10.0.0) (0x0000C0DE)), SwiftShader driver)',
    ],
    ['Linux Mesa 소프트웨어', 'llvmpipe (LLVM 15.0.7, 256 bits)'],
    ['Mesa softpipe', 'softpipe'],
    [
      'Windows WARP',
      'ANGLE (Microsoft, Microsoft Basic Render Driver Direct3D11 vs_5_0 ps_5_0, D3D11)',
    ],
  ])('%s → 소프트웨어', (_, renderer) => {
    expect(isSoftwareRenderer(renderer)).toBe(true);
  });

  it.each([
    [
      'Chrome, Apple Silicon',
      'ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Max, Unspecified Version)',
    ],
    ['WebKit(실제 이름을 가림)', 'Apple GPU'],
    ['NVIDIA', 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)'],
    ['빈 문자열', ''],
  ])('%s → 하드웨어로 본다', (_, renderer) => {
    expect(isSoftwareRenderer(renderer)).toBe(false);
  });
});

describe('detectSoftwareRenderer', () => {
  const UNMASKED_RENDERER_WEBGL = 0x9246;
  const loseContext = jest.fn();

  function mockContext({
    renderer,
    debugInfo = true,
    loseExtension = true,
  }: {
    renderer: unknown;
    debugInfo?: boolean;
    loseExtension?: boolean;
  }) {
    const gl = {
      getExtension: (name: string) => {
        if (name === 'WEBGL_debug_renderer_info')
          return debugInfo ? { UNMASKED_RENDERER_WEBGL } : null;
        if (name === 'WEBGL_lose_context') return loseExtension ? { loseContext } : null;
        return null;
      },
      getParameter: (param: number) => (param === UNMASKED_RENDERER_WEBGL ? renderer : null),
    };
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(gl as unknown as WebGLRenderingContext);
  }

  afterEach(() => {
    jest.restoreAllMocks();
    loseContext.mockClear();
  });

  it('SwiftShader면 true를 돌려주고 판정용 컨텍스트를 해제한다', () => {
    mockContext({
      renderer: 'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device), SwiftShader driver)',
    });

    expect(detectSoftwareRenderer()).toBe(true);
    expect(loseContext).toHaveBeenCalledTimes(1);
  });

  it('하드웨어 렌더러면 false를 돌려주고 컨텍스트를 해제한다', () => {
    mockContext({
      renderer: 'ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Max, Unspecified Version)',
    });

    expect(detectSoftwareRenderer()).toBe(false);
    expect(loseContext).toHaveBeenCalledTimes(1);
  });

  it('WebGL 컨텍스트를 못 만들면 판정 불가로 false', () => {
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    expect(detectSoftwareRenderer()).toBe(false);
  });

  it('렌더러 확장이 막혀 있으면(지문 방지 등) 판정 불가로 false, 컨텍스트는 해제한다', () => {
    mockContext({ renderer: 'SwiftShader', debugInfo: false });

    expect(detectSoftwareRenderer()).toBe(false);
    expect(loseContext).toHaveBeenCalledTimes(1);
  });

  it('렌더러 값이 문자열이 아니면 false', () => {
    mockContext({ renderer: null });

    expect(detectSoftwareRenderer()).toBe(false);
  });

  it('해제 확장이 없어도 예외 없이 판정한다', () => {
    mockContext({ renderer: 'llvmpipe', loseExtension: false });

    expect(detectSoftwareRenderer()).toBe(true);
    expect(loseContext).not.toHaveBeenCalled();
  });
});
