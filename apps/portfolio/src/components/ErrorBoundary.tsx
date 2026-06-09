'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

// ── [ErrorBoundary 클래스] ──
// React의 선언적 에러 처리를 위한 컴포넌트입니다.
// 3D 렌더링(WebGL) 환경은 브라우저 리소스 부족 등으로 크래시가 발생하기 쉽기 때문에,
// 에러 발생 시 앱 전체가 멈추는 것을 방지하고 사용자에게 우아한 폴백(Fallback) 화면을 보여주기 위해 사용합니다.
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // ── [에러 상태 업데이트] ──
  // 하위 컴포넌트(예: 3D Canvas)에서 렌더링 중 에러가 발생하면 이 메서드가 호출됩니다.
  // 에러 발생 시 state를 업데이트하여 다음 렌더링에서 폴백(fallback) UI가 보이도록 합니다.
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // ── [에러 로깅] ──
  // WebGL 컨텍스트 유실이나 렌더링 크래시 등 상세 에러 정보를 콘솔에 기록하여 디버깅을 돕습니다.
  // 프로덕션 환경에서는 이 곳에 Sentry 등의 에러 모니터링 도구를 연동할 수 있습니다.
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
