// 경력/자격증 데이터 모듈 — ExperienceSection(홈)과 Resume 페이지에서 공유
export interface Experience {
  company: string;
  period: string;
  role: string;
  type: string;
}

export interface Achievement {
  certificate: string;
  date: string;
  organization: string;
  result: string;
}

export const EXPERIENCES: Experience[] = [
  {
    company: '(주) 나비이',
    period: '2020.08 - 2025.08',
    role: 'Frontend Engineer',
    type: 'Co-Founder',
  },
  {
    company: '(주) 딘코퍼레이션',
    period: '2019.02 - 2020.06',
    role: 'Frontend Engineer',
    type: 'Junior',
  },
  {
    company: '(주) 딘코퍼레이션',
    period: '2018.12 - 2019.01',
    role: 'Frontend Engineer',
    type: 'Contractor',
  },
  {
    company: '(주) 티몬',
    period: '2018.07 - 2018.08',
    role: 'Frontend Engineer',
    type: 'Internship',
  },
  {
    company: '(주) 코아리버',
    period: '2017.05 - 2018.06',
    role: 'Full Stack Engineer',
    type: 'Junior',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    certificate: '정보처리기사',
    date: '2015.10',
    organization: '한국산업인력공단',
    result: '취득',
  },
  {
    certificate: 'OCJP',
    date: '2016.03',
    organization: 'Oracle',
    result: '취득',
  },
];
