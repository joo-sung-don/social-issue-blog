import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

// 카테고리 배지 색상 맵핑
const categoryColors: Record<string, { bg: string, text: string }> = {
  'economics': { bg: 'bg-green-100', text: 'text-green-800' },
  'technology': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'environment': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  'society': { bg: 'bg-purple-100', text: 'text-purple-800' },
  'politics': { bg: 'bg-red-100', text: 'text-red-800' }
};

// 카테고리 한글 이름 맵핑
const categoryNames: Record<string, string> = {
  'economics': '경제',
  'technology': '기술',
  'environment': '환경',
  'society': '사회',
  'politics': '정치'
};

interface Issue {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  slug: string;
  category?: string;
  created_at?: string;
}

export default async function Home() {
  // Supabase에서 모든 게시글 가져오기
  const { data: issues, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching issues:', error);
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">최신 소셜 이슈</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          사회적으로 중요한 이슈들에 대한 심층 분석과 다양한 관점을 만나보세요. 
          경제, 기술, 환경, 사회, 정치 등 다양한 분야의 이슈를 다룹니다.
        </p>
      </div>
      
      {issues && issues.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 items-stretch">
          {issues.map((issue) => (
            <Link href={`/${issue.slug}`} key={issue.id} className="h-full">
              <Card className="h-full p-3 flex flex-col hover:shadow-lg transition-shadow duration-200">
                <div className="relative w-full h-48 mb-3 overflow-hidden rounded-lg">
                  <Image
                    src={issue.thumbnail || 'https://via.placeholder.com/640x360'}
                    alt={issue.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {issue.category && (
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[issue.category]?.bg || 'bg-gray-100'} ${categoryColors[issue.category]?.text || 'text-gray-800'}`}>
                        {categoryNames[issue.category] || issue.category}
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader className="p-2 pb-0">
                  <CardTitle className="text-lg leading-tight mb-1">
                    {issue.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow p-2 pt-1">
                  <p className="mb-2 text-sm leading-snug line-clamp-3 text-gray-600">
                    {issue.description}
                  </p>
                  <p className="text-xs leading-tight text-gray-500 mt-auto">
                    {formatDistanceToNow(new Date(issue.created_at || issue.date), { addSuffix: true, locale: ko })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">아직 게시글이 없습니다</h2>
          <p className="text-gray-600 mb-6">새로운 게시글이 곧 업데이트될 예정입니다.</p>
        </div>
      )}
    </main>
  );
}
