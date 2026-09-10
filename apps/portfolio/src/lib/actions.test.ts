import { sendContactEmail } from './actions';

const send = jest.fn();
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send } })),
}));

const valid = {
  name: '홍길동',
  email: 'visitor@example.com',
  message: '열 글자가 넘는 문의 메시지입니다.',
};

describe('sendContactEmail', () => {
  const env = process.env;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env = { ...env, RESEND_API_KEY: 'test-key', CONTACT_EMAIL: 'owner@example.com' };
    send.mockReset();
    send.mockResolvedValue({ data: { id: 'email_1' }, error: null });
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = env;
    errorSpy.mockRestore();
  });

  it('입력이 규칙에 어긋나면 발송하지 않고 invalid를 돌려준다', async () => {
    const result = await sendContactEmail({ ...valid, message: '짧음' });
    expect(result).toEqual({ success: false, error: 'invalid' });
    expect(send).not.toHaveBeenCalled();
  });

  it('허니팟이 채워지면 발송하지 않고 성공인 척한다', async () => {
    const result = await sendContactEmail({ ...valid, company: 'bot inc' });
    // 화면에는 성공이지만 분석에는 세지 않는다 — 메일이 가지 않았다
    expect(result).toEqual({ success: true, trackAnalytics: false });
    expect(send).not.toHaveBeenCalled();
  });

  it('발송 설정이 없으면 성공을 가장하지 않고 unavailable을 돌려준다', async () => {
    delete process.env.RESEND_API_KEY;
    const result = await sendContactEmail(valid);
    expect(result).toEqual({ success: false, error: 'unavailable' });
    expect(send).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('정상 입력이면 계정 이메일로 보내고 방문자 주소를 replyTo에 싣는다', async () => {
    const result = await sendContactEmail(valid);
    expect(result).toEqual({ success: true });
    expect(send).toHaveBeenCalledTimes(1);
    const options = send.mock.calls[0][0];
    expect(options.to).toBe('owner@example.com');
    expect(options.replyTo).toBe('visitor@example.com');
    expect(options.subject).toContain('홍길동');
  });

  it('본문의 HTML 특수문자를 이스케이프한다', async () => {
    await sendContactEmail({
      ...valid,
      name: '<b>이름</b>',
      message: '태그 <script>alert(1)</script> 포함 메시지',
    });
    const options = send.mock.calls[0][0];
    expect(options.html).toContain('&lt;b&gt;이름&lt;/b&gt;');
    expect(options.html).not.toContain('<script>');
  });

  it('Resend가 오류를 돌려주면 failed로 응답한다', async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: 'rate_limit_exceeded', message: 'slow down' },
    });
    const result = await sendContactEmail(valid);
    expect(result).toEqual({ success: false, error: 'failed' });
  });

  it('발송 중 예외가 나도 failed로 응답한다', async () => {
    send.mockRejectedValue(new Error('network'));
    const result = await sendContactEmail(valid);
    expect(result).toEqual({ success: false, error: 'failed' });
  });
});
