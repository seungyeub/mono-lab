import { sendContactEmail } from './actions';

// 테스트 중 콘솔 출력을 막기 위해 mock 처리
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// resend 모듈의 send 함수를 mocking
const mockSend = jest.fn();

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
  };
});

describe('sendContactEmail Server Action', () => {
  const mockData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'Hello\nWorld',
  };

  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    jest.clearAllMocks();
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_EMAIL;
  });

  it('API 키가 없으면 콘솔에 로깅하고 성공을 반환한다', async () => {
    const result = await sendContactEmail(mockData);

    expect(result).toEqual({ success: true });
    expect(console.log).toHaveBeenCalledWith('--- Contact Form Submission (No API Key) ---');
    expect(console.log).toHaveBeenCalledWith('Name:', 'Test User');
    expect(console.log).toHaveBeenCalledWith('Email:', 'test@example.com');
  });

  it('API 키가 있으면 이메일을 발송하고 성공을 반환한다', async () => {
    process.env.RESEND_API_KEY = 'test_api_key';
    mockSend.mockResolvedValueOnce({ id: 'test_id' });

    const result = await sendContactEmail(mockData);

    expect(result).toEqual({ success: true });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'test@example.com', // CONTACT_EMAIL이 없으므로 입력받은 email 사용
        subject: 'New message from Test User',
      })
    );
  });

  it('CONTACT_EMAIL 환경변수가 있으면 해당 이메일로 발송한다', async () => {
    process.env.RESEND_API_KEY = 'test_api_key';
    process.env.CONTACT_EMAIL = 'admin@example.com';
    mockSend.mockResolvedValueOnce({ id: 'test_id' });

    const result = await sendContactEmail(mockData);

    expect(result).toEqual({ success: true });
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'admin@example.com',
      })
    );
  });

  it('이메일 발송에 실패하면 에러 메시지와 함께 실패를 반환한다', async () => {
    process.env.RESEND_API_KEY = 'test_api_key';
    mockSend.mockRejectedValueOnce(new Error('Resend API Error'));

    const result = await sendContactEmail(mockData);

    expect(result).toEqual({
      success: false,
      error: 'Failed to send message. Please try again.',
    });
    expect(console.error).toHaveBeenCalledWith('Email sending failed:', expect.any(Error));
  });
});
