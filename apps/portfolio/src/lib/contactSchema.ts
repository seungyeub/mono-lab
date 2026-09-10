import { z } from 'zod';

/**
 * 문의 폼 입력 규칙. 브라우저(즉시 피드백)와 서버 액션(재검증)이 같은 규칙을 쓴다 —
 * 클라이언트 검증은 우회할 수 있으므로 서버가 다시 확인해야 한다.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(100),
  email: z.string().trim().email('Please enter a valid email address.').max(254),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(5000),
  /**
   * 허니팟. 화면에서 숨겨 사람은 채우지 못하고, 폼을 통째로 채우는 봇만 값을 넣는다.
   * 서버는 값이 있으면 발송하지 않고 조용히 성공으로 응답한다.
   */
  company: z.string().max(200).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
