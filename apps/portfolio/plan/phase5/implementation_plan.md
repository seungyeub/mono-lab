# Phase 5: Contact 폼 처리 + 페이지 트랜지션

PRD 마일스톤의 **Phase 5: Contact 폼 처리 및 페이지 트랜지션 애니메이션** 작업을 진행합니다.
- `/contact` 페이지에 React Hook Form + Zod 유효성 검사를 적용하고, Next.js Server Action을 통해 Resend API로 이메일을 전송합니다.
- Framer Motion의 `AnimatePresence`를 이용한 페이지 전환 효과를 추가합니다.

> [!NOTE]
> **Resend API Key가 필요합니다.** 이메일 전송 기능을 실제로 사용하려면 [resend.com](https://resend.com)에서 무료 계정을 만들고 API Key를 발급받아야 합니다.
> 해당 키는 `apps/portfolio/.env.local` 파일에 `RESEND_API_KEY=re_...` 형식으로 저장하시면 됩니다.
> 지금은 **Resend 없이도 폼 UI와 유효성 검사는 동작**하도록 구현합니다.

## Proposed Changes

### 1. 패키지 설치
- `react-hook-form`, `zod`, `@hookform/resolvers`, `resend` 패키지 설치.

### 2. Contact 서버 액션 (`src/lib/actions.ts`)
- **[NEW]** Next.js Server Action으로 폼 데이터를 수신하고, Resend API로 이메일을 전송하는 함수 작성.
- `.env.local`에 API Key가 없으면 콘솔에만 로깅하고 에러 없이 처리.

### 3. Contact 폼 컴포넌트 (`src/features/contact/ContactForm.tsx`)
- **[NEW]** React Hook Form + Zod 기반의 유효성 검사 폼 컴포넌트 구현.
- 제출 상태(Loading, Success, Error)에 따른 UI 피드백.

### 4. Contact 페이지 (`app/contact/page.tsx`)
- **[NEW]** `/contact` 라우트 페이지 생성 및 ContactForm 컴포넌트 통합.

### 5. 페이지 트랜지션 (`app/template.tsx`)
- **[NEW]** `app/template.tsx` 파일을 이용하여 페이지 이동 시 Framer Motion의 자연스러운 Fade 트랜지션을 적용. (`layout.tsx`가 아닌 `template.tsx`를 사용하는 이유: 라우트 변경 시마다 새로 마운트되어 AnimatePresence 효과가 발생함.)

## Verification Plan
- `/contact` 접속 → 빈 폼 제출 시 각 필드에 에러 메시지 표시 확인.
- 각 페이지(`/`, `/work`, `/gallery`, `/contact`) 이동 시 부드러운 Fade 전환 효과 확인.
