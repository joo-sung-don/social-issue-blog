export interface Issue {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  content?: string;
  slug: string;
  category?: string;
}

export const issues: Issue[] = [
  {
    id: 1,
    title: "환경 오염 이슈",
    description: "플라스틱 사용 증가로 인한 환경 문제가 심각해지고 있습니다. 전 세계적으로 매년 수백만 톤의 플라스틱이 바다로 유입되며, 이는 해양 생태계에 치명적인 영향을 미치고 있습니다.",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    date: "2024년 4월 15일",
    slug: "environmental-pollution",
    category: "environment",
    content: `
      환경 오염은 현대 사회가 직면한 가장 심각한 문제 중 하나입니다. 특히 플라스틱 사용량이 급증하면서 발생하는 환경 문제는 더욱 심각해지고 있습니다.

      주요 문제점:
      1. 해양 생태계 파괴
      2. 미세플라스틱 오염
      3. 토양 오염
      4. 대기 오염

      이러한 문제를 해결하기 위해서는 개인과 기업, 정부 모두의 노력이 필요합니다. 재활용 촉진, 친환경 제품 사용, 환경 규제 강화 등 다양한 대책이 요구됩니다.
    `
  },
  {
    id: 2,
    title: "청년 실업률 증가",
    description: "청년층의 구직난과 사회적 대책이 시급합니다. 높은 실업률과 불안정한 고용 상황은 청년들의 미래를 위협하고 있습니다.",
    thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80",
    date: "2024년 4월 14일",
    slug: "youth-unemployment",
    category: "society",
    content: `
      청년 실업 문제는 현대 사회의 중요한 과제입니다. 고용 시장의 구조적 변화와 경제 불황으로 인해 청년들의 취업이 더욱 어려워지고 있습니다.

      주요 원인:
      1. 일자리 미스매치
      2. 경제 성장 둔화
      3. 고용 시장 경직성
      4. 교육과정과 산업 수요 간 격차

      해결을 위해서는 정부의 청년 일자리 정책 강화, 기업의 채용 확대, 교육 시스템 개선 등 종합적인 접근이 필요합니다.
    `
  },
  {
    id: 3,
    title: "AI 윤리 논쟁",
    description: "AI 기술 발전과 윤리적 문제에 대한 사회적 논의가 필요한 시점입니다.",
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80",
    date: "2024년 4월 13일",
    slug: "ai-ethics",
    category: "technology",
    content: `
      인공지능 기술의 급속한 발전으로 인해 다양한 윤리적 문제가 제기되고 있습니다. 

      주요 쟁점:
      1. 개인정보 보호
      2. 알고리즘 편향성
      3. AI 결정의 책임소재
      4. 일자리 대체 문제

      이러한 문제들을 해결하기 위해서는 기술 발전과 함께 윤리적 가이드라인 수립이 필요합니다.
    `
  }
]; 