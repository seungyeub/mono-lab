'use client';

import SkillChips from '@/src/features/home/components/SkillChips';
import { resolveTechSkills } from '@/src/lib/techSkills';
import SectionHeading from './SectionHeading';

/**
 * Technology Stack — 홈 Skills 섹션과 동일한 칩(SkillChips)을 재사용한다(#3 피드백).
 * MDX 표기는 resolveTechSkills가 skillsData 정식 항목으로 매핑해 아이콘·브랜드 컬러를
 * 가져오고, 매핑 실패 항목은 SkillIcon의 글자 폴백으로 렌더링된다.
 *
 * 'use client'인 이유: 해석 결과(SkillItem)에 아이콘 "컴포넌트"가 들어 있어 서버에서
 * 만들어 client로 넘기면 직렬화 오류가 난다 — 문자열 배열만 받아 클라이언트에서 해석한다.
 */
export default function TechStackSection({ techStack }: { techStack: string[] }) {
  if (techStack.length === 0) return null;

  return (
    <section className='mt-20 md:mt-28'>
      <SectionHeading title='Technology Stack' description='이 프로젝트를 구성한 기술들' />
      <div className='flex justify-center'>
        <div className='max-w-4xl'>
          <SkillChips skills={resolveTechSkills(techStack)} categoryName='Tech Stack' />
        </div>
      </div>
    </section>
  );
}
