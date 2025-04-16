import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const dummyData = [
  {
    id: 1,
    title: "환경 오염 이슈",
    description: "플라스틱 사용 증가로 인한 환경 문제",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    date: "2024년 4월 15일"
  },
  {
    id: 2,
    title: "청년 실업률 증가",
    description: "청년층의 구직난과 사회적 대책",
    thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    date: "2024년 4월 14일"
  },
  {
    id: 3,
    title: "AI 윤리 논쟁",
    description: "AI 기술 발전과 윤리적 문제",
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    date: "2024년 4월 13일"
  },
  {
    id: 4,
    title: "기후 변화",
    description: "지구 온난화와 해수면 상승 문제",
    thumbnail: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    date: "2024년 4월 12일"
  },
  {
    id: 5,
    title: "디지털 격차",
    description: "정보 접근성의 불평등",
    thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    date: "2024년 4월 11일"
  },
  {
    id: 6,
    title: "저출산 고령화",
    description: "인구 구조 변화와 사회적 영향",
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    date: "2024년 4월 10일"
  },
  {
    id: 7,
    title: "젠더 이슈",
    description: "성평등과 사회적 논쟁",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    date: "2024년 4월 9일"
  },
  {
    id: 8,
    title: "플랫폼 노동",
    description: "긱 이코노미와 노동 환경 변화",
    thumbnail: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    date: "2024년 4월 8일"
  },
  {
    id: 9,
    title: "에너지 전환",
    description: "재생에너지 확대와 정책 변화",
    thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    date: "2024년 4월 7일"
  }
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        최신 소셜 이슈
      </h1>
      <div className="w-full grid grid-cols-3 gap-x-10 gap-y-8 items-stretch">
        {dummyData.map((item) => (
          <Card key={item.id} className="h-full flex flex-col p-3">
            <Image
              src={item.thumbnail}
              alt={item.title}
              width={400}
              height={200}
              className="rounded-t-lg object-cover w-full h-48"
            />
            <CardHeader className="p-2 pb-0">
              <CardTitle className="text-lg leading-tight mb-1">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow p-2 pt-1">
              <p className="text-gray-600 mb-2 text-sm leading-snug">{item.description}</p>
              <span className="text-xs text-gray-400 mt-auto block leading-tight">{item.date}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
