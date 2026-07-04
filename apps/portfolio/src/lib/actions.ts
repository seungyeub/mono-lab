'use server';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<ActionResult> {
  const { name, email, message } = data;

  // API Key가 없으면 콘솔에 로깅만 하고 성공 처리
  if (!process.env.RESEND_API_KEY) {
    console.log('--- Contact Form Submission (No API Key) ---');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('-------------------------------------------');
    return { success: true };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL ?? email,
      subject: `New message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: 'Failed to send message. Please try again.',
    };
  }
}
