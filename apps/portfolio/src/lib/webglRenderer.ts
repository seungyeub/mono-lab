/**
 * WebGL을 GPU 없이 CPU로 그리는 환경인지 판정한다.
 *
 * Hero의 3D 카드(three.js + rapier)는 소프트웨어 렌더러에서 매 프레임이 긴 작업이 된다.
 * CI 러너(SwiftShader)에서 메인 스레드 178초 중 93%가 래스터였고 Lighthouse가 45초 내내
 * 페이지가 조용해지기를 기다리다 끝났다(2026-09-16, PR #99). 원격 데스크톱·하드웨어 가속을
 * 끈 브라우저·차단 목록 GPU 사용자도 같은 경로를 타므로, 그때는 카드를 올리지 않는다.
 *
 * 표준 옵션 `failIfMajorPerformanceCaveat`는 SwiftShader에서도 컨텍스트를 내줘서 판정에 쓸 수 없었다.
 */

// Chromium의 SwiftShader, Mesa의 llvmpipe·softpipe, Windows의 WARP
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|microsoft basic render driver/i;

export function isSoftwareRenderer(renderer: string): boolean {
  return SOFTWARE_RENDERER.test(renderer);
}

/**
 * 판정할 수 없으면 false — 지금처럼 카드를 올린다. WebKit은 실제 이름 대신 "Apple GPU"를 주고,
 * Firefox의 지문 방지 설정은 확장 자체를 막는다. WebGL이 아예 없으면 카드 쪽 ErrorBoundary가 받는다.
 */
export function detectSoftwareRenderer(): boolean {
  const gl = document.createElement('canvas').getContext('webgl');
  if (!gl) return false;

  try {
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    if (!info) return false;
    const renderer: unknown = gl.getParameter(info.UNMASKED_RENDERER_WEBGL);
    return typeof renderer === 'string' && isSoftwareRenderer(renderer);
  } finally {
    // 브라우저가 페이지당 WebGL 컨텍스트 수를 제한한다 — 판정용 컨텍스트가 카드의 자리를 잡아먹지 않게 바로 돌려준다
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
