import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import RollingLink from '@/components/RollingText/RollingLink';
import { CONTACT_PUBLIC_EMAIL, SITE_NAME, buildPageOpenGraph } from '@/lib/siteConfig';

/**
 * 개인정보 처리방침.
 *
 * P6-12에서는 폼 아래 고지만 두고 이 페이지를 만들지 않았다. 문의 폼은 이름·이메일을
 * 실제로 입력하는 자리에서 알리면 되지만, **GA는 모든 페이지에서 쿠키를 쓰는데 `/contact`에만
 * 고지가 있어 닿지 않는 방문자가 대부분이었다.** Google Analytics 이용약관은 GA를 쓰는 사이트에
 * 처리방침 게시와 쿠키·식별자 사용 고지를 요구한다(법과 별개의 약관상 의무).
 *
 * 문장은 실제 동작과 어긋나면 안 된다 - "보관하지 않는다"처럼 지킬 수 없는 약속은 쓰지 않는다.
 * 수집 항목이나 사용하는 서비스가 바뀌면 이 페이지도 같이 고친다.
 */

const DESCRIPTION =
  '이 사이트가 수집하는 정보와 목적, 이용하는 외부 서비스, 수집을 거부하는 방법을 안내합니다.';

// 제목에 사이트명을 넣지 않는다 - 루트 layout의 title.template가 한 번만 덧붙인다
export const metadata: Metadata = {
  title: 'Privacy',
  description: DESCRIPTION,
  alternates: { canonical: '/privacy' },
  ...buildPageOpenGraph({
    title: `Privacy | ${SITE_NAME}`,
    description: DESCRIPTION,
    path: '/privacy',
  }),
};

/**
 * 항목 한 칸. `/contact`의 ContactRow와 같은 구분선 형태를 쓰되 제목을 본문보다 크게 둔다 -
 * 연락처 목록은 값이 한 줄이라 작은 라벨로 충분하지만, 여기는 문단을 읽는 페이지라
 * 라벨이 본문보다 작으면 구분이 되지 않는다. 제목이므로 `h2`로 두어 목차로도 읽히게 한다.
 */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className='border-line flex flex-col gap-3 border-b py-8 md:flex-row md:gap-12'>
      <h2 className='shrink-0 text-lg font-medium text-white md:w-52 md:text-xl'>{label}</h2>
      <div className='text-sm leading-relaxed break-keep text-gray-400 md:text-base'>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className='site-container min-h-screen w-full px-6 pt-32 pb-24 md:px-12'>
      <div className='border-line border-b pb-12'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl font-medium tracking-tight md:text-6xl'>Privacy©</h1>
          <p className='mt-2 max-w-xl text-base text-gray-400 md:text-lg'>
            이 사이트가 무엇을 수집하고 어디에 쓰는지, 원하지 않을 때 어떻게 막는지 적어 둡니다.
          </p>
        </div>
      </div>

      <div className='mt-12 max-w-4xl md:mt-16'>
        <Row label='수집하는 정보'>
          <p>
            <strong className='font-medium text-white'>문의 폼</strong> - 이름, 이메일, 메시지. 직접
            입력한 내용만 받습니다.
          </p>
          <p className='mt-2'>
            <strong className='font-medium text-white'>방문 기록</strong> - 방문한 페이지, 접속
            시각, 브라우저와 기기 종류, 대략적인 지역. Google Analytics가 쿠키로 같은 방문자를
            구분합니다. 이름이나 이메일과 연결되지 않습니다.
          </p>
        </Row>

        <Row label='쓰는 곳'>
          문의에 답장하기 위해 씁니다. 방문 기록은 어떤 페이지가 읽히는지 파악해 사이트를 고치는
          데만 씁니다. 광고에 쓰거나 다른 곳에 팔지 않습니다.
        </Row>

        <Row label='남는 곳'>
          보낸 문의는 메일함과 발송 대행 서비스의 기록에 남습니다. 방문 기록은 Google Analytics에
          쌓이고 기본 보관 기간은 14개월입니다.
        </Row>

        <Row label='이용하는 서비스'>
          <ul className='flex flex-col gap-1'>
            <li>Google Analytics - 방문 통계</li>
            <li>Vercel - 사이트 호스팅, 성능 측정</li>
            <li>Resend - 문의 메일 발송</li>
          </ul>
          <p className='mt-2'>
            각 서비스는 처리 과정에서 접속 IP 같은 정보를 다룰 수 있고, 서버가 국외에 있을 수
            있습니다.
          </p>
        </Row>

        <Row label='거부하는 방법'>
          <p>
            브라우저에서 쿠키를 차단하면 방문 기록이 남지 않습니다.{' '}
            <RollingLink
              href='https://tools.google.com/dlpage/gaoptout'
              target='_blank'
              rel='noopener noreferrer'
              text='Google의 차단 부가기능'
              stagger={0}
              className='text-white underline underline-offset-4 transition-colors hover:text-white/70'
            />
            을 설치해도 됩니다. 어느 쪽이든 사이트 이용에는 영향이 없습니다.
          </p>
          <p className='mt-2'>문의 폼은 직접 보내지 않으면 아무것도 수집하지 않습니다.</p>
        </Row>

        <Row label='문의'>
          <RollingLink
            href={`mailto:${CONTACT_PUBLIC_EMAIL}`}
            text={CONTACT_PUBLIC_EMAIL}
            stagger={0}
            className='transition-colors hover:text-white'
          />
        </Row>
      </div>
    </div>
  );
}
