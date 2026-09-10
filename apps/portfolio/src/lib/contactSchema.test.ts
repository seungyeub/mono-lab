import { contactSchema } from '@/lib/contactSchema';

/**
 * 브라우저와 서버 액션이 같은 규칙을 쓴다. 클라이언트 검증은 우회할 수 있으므로
 * 서버가 다시 확인하는데, 그 근거가 되는 규칙 자체를 여기서 고정한다.
 */

const valid = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: '포지션 관련해서 문의드립니다.',
};

describe('contactSchema', () => {
  it('정상 입력을 통과시킨다', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  describe('앞뒤 공백', () => {
    it('세 항목 모두 trim된 값으로 넘어간다', () => {
      const parsed = contactSchema.safeParse({
        name: '  Jane Doe  ',
        email: '  jane@example.com  ',
        message: '  포지션 관련해서 문의드립니다.  ',
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) expect(parsed.data).toMatchObject(valid);
    });

    it('공백만 채운 이름은 길이 검사에 걸린다', () => {
      // trim 뒤에 길이를 재지 않으면 스페이스 두 개가 이름으로 통과한다
      expect(contactSchema.safeParse({ ...valid, name: '   ' }).success).toBe(false);
    });
  });

  describe('name', () => {
    it('2자 미만은 거부한다', () => {
      expect(contactSchema.safeParse({ ...valid, name: 'J' }).success).toBe(false);
    });

    it('2자와 100자는 통과한다', () => {
      expect(contactSchema.safeParse({ ...valid, name: 'Jo' }).success).toBe(true);
      expect(contactSchema.safeParse({ ...valid, name: 'a'.repeat(100) }).success).toBe(true);
    });

    it('101자는 거부한다', () => {
      expect(contactSchema.safeParse({ ...valid, name: 'a'.repeat(101) }).success).toBe(false);
    });
  });

  describe('email', () => {
    it.each(['jane', 'jane@', '@example.com', 'jane example@com'])('%s를 거부한다', (email) => {
      expect(contactSchema.safeParse({ ...valid, email }).success).toBe(false);
    });

    it('254자를 넘으면 거부한다', () => {
      const local = 'a'.repeat(250);
      expect(contactSchema.safeParse({ ...valid, email: `${local}@example.com` }).success).toBe(
        false,
      );
    });
  });

  describe('message', () => {
    it('10자 미만은 거부하고 10자는 통과한다', () => {
      expect(contactSchema.safeParse({ ...valid, message: '짧은문의' }).success).toBe(false);
      expect(contactSchema.safeParse({ ...valid, message: '1234567890' }).success).toBe(true);
    });

    it('5000자는 통과하고 5001자는 거부한다', () => {
      expect(contactSchema.safeParse({ ...valid, message: 'a'.repeat(5000) }).success).toBe(true);
      expect(contactSchema.safeParse({ ...valid, message: 'a'.repeat(5001) }).success).toBe(false);
    });
  });

  describe('company (허니팟)', () => {
    it('없어도 통과한다 — 사람은 채우지 않는 칸이다', () => {
      expect(contactSchema.safeParse(valid).success).toBe(true);
    });

    it('값이 있어도 스키마는 통과시킨다 — 봇 판정은 서버 액션이 한다', () => {
      const parsed = contactSchema.safeParse({ ...valid, company: 'bot inc' });

      expect(parsed.success).toBe(true);
      if (parsed.success) expect(parsed.data.company).toBe('bot inc');
    });

    it('200자를 넘으면 거부한다', () => {
      expect(contactSchema.safeParse({ ...valid, company: 'a'.repeat(201) }).success).toBe(false);
    });
  });
});
