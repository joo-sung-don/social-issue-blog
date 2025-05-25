import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

// 카테고리 맵핑 (URL 파라미터 -> 실제 카테고리 이름)
const categoryMappings: Record<string, string> = {
  'economics': '경제',
  'technology': '기술',
  'environment': '환경',
  'society': '사회',
  'politics': '정치',
  'statistics': '통계'
};

// 카테고리 타이틀 이미지 맵핑
const categoryImages: Record<string, string> = {
  'economics': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&h=400&q=80',
  'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=400&q=80',
  'environment': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&h=400&q=80',
  'society': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&h=400&q=80',
  'politics': 'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=1200&h=400&q=80',
  'statistics': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=400&q=80'
};

// 페이지 컴포넌트
export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const categoryTitle = categoryMappings[category] || category;
  const categoryImage = categoryImages[category] || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&h=400&q=80';

  // 먼저 전체 데이터를 가져와서 클라이언트에서 필터링
  let { data: issues, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });
    
  // 오류가 발생한 경우 또는 issues가 undefined인 경우
  if (error) {
    console.error('Error fetching all posts:', error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">데이터 로딩 오류</h1>
        <p className="mb-4">카테고리 데이터를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-600 mb-4">오류 세부 정보: {error.message}</p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // issues가 undefined인 경우 빈 배열로 초기화
  if (!issues) {
    issues = [];
  }

  // 클라이언트에서 카테고리 필터링
  const filteredIssues = issues.filter(issue => {
    // category 필드가 있으면 그대로 사용, 없으면 빈 문자열로 처리
    const issueCategory = issue.category || '';
    return issueCategory === category;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 카테고리 헤더 */}
      <div className="relative w-full h-60 mb-8 rounded-xl overflow-hidden">
        <Image 
          src={categoryImage}
          alt={`${categoryTitle} 카테고리`}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{categoryTitle}</h1>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      {filteredIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredIssues.map((issue) => (
            <Link href={`/${issue.slug}`} key={issue.id} className="h-full">
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
                <div className="relative w-full h-48">
                  <Image
                    src={issue.thumbnail || 'https://via.placeholder.com/640x360'}
                    alt={issue.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg font-bold line-clamp-2">
                    {issue.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow p-4 pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {issue.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-auto">
                    {formatDistanceToNow(new Date(issue.created_at || issue.date), { addSuffix: true, locale: ko })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">아직 게시글이 없습니다</h2>
          <p className="text-gray-600 mb-6">이 카테고리에는 아직 게시된 글이 없습니다.</p>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            전체 게시글 보기
          </Link>
        </div>
      )}
    </div>
  );
} 