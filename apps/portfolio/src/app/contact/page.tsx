import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { CONTACT_PUBLIC_EMAIL, SITE_NAME, buildPageOpenGraph } from '@/lib/siteConfig';
import ContactForm from '@/features/contact/ContactForm';
import RollingLink from '@/components/RollingText/RollingLink';

const NETWORKS = [
  { label: 'GitHub', href: 'https://github.com/seungyeub' },
  { label: 'Pinterest', href: 'https://pinterest.com/bseungyeub' },
  { label: 'Blog', href: 'https://blog.naver.com/backsajang420' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/seungyeub-baek-23aa9016a/' },
];

/** 연락처 한 행. 아래 선 위에 흰 선이 겹쳐 있다가 hover 시 왼쪽에서 오른쪽으로 자란다 */
function ContactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='group/row border-line relative flex flex-col gap-1 border-b py-4'>
      <dt className='text-label tracking-label font-medium text-white uppercase'>{label}</dt>
      <dd>{children}</dd>
      <span
        aria-hidden='true'
        className='absolute bottom-[-1px] left-0 h-px w-0 bg-white transition-[width] duration-500 ease-out group-hover/row:w-full'
      />
    </div>
  );
}

const DESCRIPTION =
  '프론트엔드 개발 협업 및 채용 문의를 위해 백승엽에게 연락할 수 있는 페이지입니다.';

// 제목에 사이트명을 넣지 않는다 — 루트 layout의 title.template가 한 번만 덧붙인다
export const metadata: Metadata = {
  title: 'Contact',
  description: DESCRIPTION,
  // canonical이 없으면 쿼리스트링이 붙은 주소가 별도 페이지로 색인될 수 있다
  alternates: { canonical: '/contact' },
  ...buildPageOpenGraph({
    title: `Contact | ${SITE_NAME}`,
    description: DESCRIPTION,
    path: '/contact',
  }),
};

export default function ContactPage() {
  return (
    <div className='site-container min-h-screen w-full px-6 pt-32 pb-24 md:px-12'>
      {/* 페이지 헤더 — /projects와 같은 구성. 제목이 페이지의 목적(프로젝트 이야기)을 말한다 */}
      <div className='border-line border-b pb-12'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl font-medium tracking-tight md:text-6xl'>Contact©</h1>
          <p className='mt-2 max-w-xl text-base text-gray-400 md:text-lg'>
            궁금한 점이 있다면 언제든지 편하게 문의 주세요. 채용 제안과 협업 문의 모두 환영합니다.
          </p>
        </div>
      </div>

      {/*
        폼과 연락처를 나란히 둔다. 폼만 왼쪽 절반에 두면 오른쪽이 통째로 비었다.
        모바일은 연락처 → 폼 순서를 유지한다(짧은 정보를 먼저, 긴 입력을 뒤에).
      */}
      <div className='mt-12 flex flex-col gap-20 md:mt-16 lg:flex-row lg:justify-between lg:gap-16'>
        <div className='order-2 w-full lg:order-1 lg:max-w-4xl'>
          <ContactForm />
        </div>

        {/*
          연락 채널. 푸터의 목록은 사이트 내비게이션이고 여기는 연락 수단이라 역할이 다르다.
          행 위에 마우스를 올리면 아래 선이 왼쪽에서 오른쪽으로 흰색으로 채워지고,
          링크 글자는 헤더 메뉴와 같은 롤링 효과를 낸다.
        */}
        <aside className='order-1 w-full lg:order-2 lg:w-80 lg:shrink-0'>
          <p className='mb-2 font-semibold text-white'>Channels</p>
          <dl className='text-sm text-gray-400'>
            <ContactRow label='Email'>
              <RollingLink
                href={`mailto:${CONTACT_PUBLIC_EMAIL}`}
                text={CONTACT_PUBLIC_EMAIL}
                stagger={0}
                className='transition-colors hover:text-white'
              />
            </ContactRow>
            <ContactRow label='Based in'>Seoul, 한국</ContactRow>
            <ContactRow label='Networks'>
              <span className='flex flex-wrap gap-x-4 gap-y-1'>
                {NETWORKS.map((network) => (
                  <RollingLink
                    key={network.label}
                    href={network.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    text={network.label}
                    stagger={0}
                    className='transition-colors hover:text-white'
                  />
                ))}
              </span>
            </ContactRow>
          </dl>
        </aside>
      </div>
    </div>
  );
}
