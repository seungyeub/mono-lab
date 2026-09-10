import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import ContactForm from '@/features/contact/ContactForm';
import { sendContactEmail } from '@/lib/actions';
import { sendGAEvent } from '@next/third-parties/google';
import { useCursorStore } from '@/store/useCursorStore';

/**
 * 제출 분기가 네 갈래다 — 정상 성공, 허니팟 성공(발송 없음), 타입 있는 오류, 예외.
 * 특히 허니팟 성공을 전환으로 세면 문의 지표가 봇만큼 부풀려지고(P6-15),
 * 예외를 놓치면 버튼이 loading에 묶여 다시 제출할 수 없다.
 */

jest.mock('framer-motion', () => {
  // 애니메이션 전용 prop은 DOM으로 흘리면 React가 경고한다 — 이름으로 걸러낸다
  const MOTION_ONLY = ['initial', 'animate', 'exit', 'transition', 'whileInView', 'viewport'];
  const stripMotionProps = (props: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(props).filter(([key]) => !MOTION_ONLY.includes(key)));

  return {
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    motion: new Proxy(
      {},
      {
        get: (_target, tag: string) =>
          function MotionTag({
            children,
            ...rest
          }: Record<string, unknown> & { children?: React.ReactNode }) {
            return React.createElement(tag, stripMotionProps(rest), children);
          },
      },
    ),
  };
});

jest.mock('@/lib/actions', () => ({ sendContactEmail: jest.fn() }));
jest.mock('@next/third-parties/google', () => ({ sendGAEvent: jest.fn() }));
jest.mock('@/lib/siteConfig', () => ({
  ...jest.requireActual('@/lib/siteConfig'),
  GA_MEASUREMENT_ID: 'G-TEST0000',
}));
jest.mock('@/store/useCursorStore');

const mockSend = sendContactEmail as jest.MockedFunction<typeof sendContactEmail>;
const mockGA = sendGAEvent as jest.Mock;

function submit() {
  fireEvent.click(screen.getByRole('button', { name: /send message/i }));
}

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByLabelText('Message'), {
    target: { value: '포지션 관련해서 문의드립니다.' },
  });
  submit();
}

describe('ContactForm', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useCursorStore as unknown as jest.Mock).mockImplementation(() => jest.fn());
  });

  it('정상 성공 — 성공 문구를 보이고 전환을 세며 입력을 비운다', async () => {
    mockSend.mockResolvedValue({ success: true });

    render(<ContactForm />);
    fillAndSubmit();

    expect(await screen.findByText(/message sent successfully/i)).toBeInTheDocument();
    expect(mockGA).toHaveBeenCalledWith('event', 'contact_submit', { form: 'contact' });
    await waitFor(() => expect(screen.getByLabelText('Name')).toHaveValue(''));
  });

  it('허니팟 성공 — 화면에는 성공이지만 전환으로 세지 않는다', async () => {
    // 봇에게 거부를 알리면 우회를 시도하므로 성공인 척한다. 다만 메일은 가지 않았다
    mockSend.mockResolvedValue({ success: true, trackAnalytics: false });

    render(<ContactForm />);
    fillAndSubmit();

    expect(await screen.findByText(/message sent successfully/i)).toBeInTheDocument();
    expect(mockGA).not.toHaveBeenCalled();
  });

  it('발송 설정이 없으면 직접 연락 안내를 보이고 전환을 세지 않는다', async () => {
    mockSend.mockResolvedValue({ success: false, error: 'unavailable' });

    render(<ContactForm />);
    fillAndSubmit();

    expect(await screen.findByText(/sending is unavailable/i)).toBeInTheDocument();
    expect(mockGA).not.toHaveBeenCalled();
  });

  it('서버 액션이 거부돼도 버튼이 다시 눌린다', async () => {
    // catch가 없으면 status가 loading에 묶여 버튼이 영영 비활성으로 남는다
    mockSend.mockRejectedValue(new Error('network down'));
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ContactForm />);
    fillAndSubmit();

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
    consoleError.mockRestore();
  });

  it('입력이 비면 서버를 부르지 않고 각 칸에 오류를 연결한다', async () => {
    render(<ContactForm />);
    submit();

    await waitFor(() =>
      expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true'),
    );
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-describedby', 'contact-name-error');
    expect(mockSend).not.toHaveBeenCalled();
  });
  it('성공 문구는 role="status"로 바로 읽히고, 5초쯤 뒤 사라진다', async () => {
    // 경계(정확히 5000ms)에 맞추면 타이머 스케줄 시점의 오차로 흔들린다 — 앞뒤로 여유를 둔다
    jest.useFakeTimers();
    mockSend.mockResolvedValue({ success: true });

    render(<ContactForm />);
    fillAndSubmit();

    const notice = await screen.findByRole('status');
    expect(notice).toHaveTextContent(/message sent successfully/i);

    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(screen.getByRole('status')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1100);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('성공 뒤 다시 입력을 시작하면 성공 문구가 바로 사라진다', async () => {
    // 비워진 칸에 새 문의를 쓰는데 이전 성공 문구가 남아 있으면 이미 보낸 것처럼 읽힌다
    mockSend.mockResolvedValue({ success: true });

    render(<ContactForm />);
    fillAndSubmit();
    await screen.findByRole('status');

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'J' } });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('오류 문구는 시간이 지나도 남는다', async () => {
    // 직접 연락할 주소를 읽고 옮겨 적을 시간이 필요하다
    jest.useFakeTimers();
    mockSend.mockResolvedValue({ success: false, error: 'unavailable' });

    render(<ContactForm />);
    fillAndSubmit();
    expect(await screen.findByText(/sending is unavailable/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(screen.getByText(/sending is unavailable/i)).toBeInTheDocument();
  });
});
