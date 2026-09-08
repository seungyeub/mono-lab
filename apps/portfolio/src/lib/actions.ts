'use server';

import { Resend } from 'resend';
import { contactSchema, type ContactFormData } from '@/lib/contactSchema';

/**
 * invalid: 입력이 규칙에 맞지 않음 · unavailable: 서버에 발송 설정이 없음 ·
 * failed: 발송을 시도했으나 실패
 */
export type ContactErrorCode = 'invalid' | 'unavailable' | 'failed';

export interface ActionResult {
  success: boolean;
  error?: ContactErrorCode;
}

/** 메일 본문은 HTML이라 방문자 입력을 그대로 넣으면 태그가 해석된다 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 문의 폼 발송. Resend의 테스트 발신 주소(onboarding@resend.dev)는 계정 이메일로만
 * 보낼 수 있으므로 수신자는 CONTACT_EMAIL 하나다. 방문자 주소는 replyTo에 실어
 * 받은 메일에서 바로 답장할 수 있게 한다.
 *
 * 설정이 없으면 실패를 돌려준다. 예전에는 콘솔에만 남기고 성공으로 응답해, 프로덕션에서
 * 메일은 가지 않는데 방문자에게는 "보냈다"고 표시되는 결함이 있었다(2026-09-08 실측).
 */
export async function sendContactEmail(input: ContactFormData): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'invalid' };

  const { name, email, message, company } = parsed.data;

  // 허니팟이 채워졌으면 봇이다. 거부했다고 알려 주면 우회를 시도하므로 성공인 척한다
  if (company) return { success: true };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    console.error(
      'Contact form: RESEND_API_KEY 또는 CONTACT_EMAIL이 설정되지 않아 발송할 수 없다.',
    );
    return { success: false, error: 'unavailable' };
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to,
      replyTo: email,
      subject: `[Portfolio] ${name}님의 문의`,
      html: `
        <h2>포트폴리오 문의</h2>
        <p><strong>이름:</strong> ${safeName}</p>
        <p><strong>이메일:</strong> ${safeEmail}</p>
        <p><strong>메시지:</strong></p>
        <p>${safeMessage}</p>
      `,
      text: `이름: ${name}\n이메일: ${email}\n\n${message}`,
    });

    if (error) {
      console.error(`Contact form: 발송 실패 [${error.name}] ${error.message}`);
      return { success: false, error: 'failed' };
    }
    return { success: true };
  } catch (cause) {
    console.error('Contact form: 발송 중 예외', cause);
    return { success: false, error: 'failed' };
  }
}
