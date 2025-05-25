"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { highlightText } from '@/lib/highlights';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

// 카테고리 배지 색상 맵핑
const categoryColors: Record<string, { bg: string, text: string }> = {
  'economics': { bg: 'bg-green-100', text: 'text-green-800' },
  'technology': { bg: 'bg-teal-100', text: 'text-teal-800' },
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
  content: string;
  slug: string;
  category?: string;
  created_at?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);

  // 카테고리 기반 관련 키워드
  const categoryKeywords = {
    'economics': ['경제위기', '물가상승', '금리', '주식', '부동산'],
    'technology': ['인공지능', '블록체인', '메타버스', '자율주행', '로봇'],
    'environment': ['기후변화', '탄소중립', '재생에너지', '미세먼지', '플라스틱'],
    'society': ['교육', '인권', '불평등', '복지', '저출산'],
    'politics': ['선거', '정책', '외교', '국방', '민주주의']
  };

  useEffect(() => {
    async function searchIssues() {
      if (!query) {
        setIssues([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Supabase에서 검색어가 제목, 내용, 설명에 포함된 게시글 검색
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setIssues(data || []);
        
        // 결과가 없으면 추천 키워드 생성
        if (data?.length === 0) {
          generateSuggestedKeywords(query);
        }
      } catch (err: any) {
        console.error('검색 중 오류 발생:', err);
        setError(err.message || '검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    searchIssues();
  }, [query]);
  
  // 추천 키워드 생성 함수
  const generateSuggestedKeywords = async (searchQuery: string) => {
    try {
      // 1. 가장 많이 검색된 카테고리 찾기
      const { data: categoryCounts } = await supabase
        .from('issues')
        .select('category')
        .order('created_at', { ascending: false });
      
      // 카테고리별 빈도수 계산
      const categories = categoryCounts?.map(item => item.category) || [];
      const categoryFrequency: Record<string, number> = {};
      
      categories.forEach(category => {
        if (category) {
          categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;
        }
      });
      
      // 가장 많은 카테고리 찾기
      let topCategory = 'society'; // 기본값
      let maxCount = 0;
      
      Object.entries(categoryFrequency).forEach(([category, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topCategory = category;
        }
      });
      
      // 해당 카테고리의 키워드 + 일반 키워드 조합
      const generalKeywords = ['사회이슈', '최신뉴스', '쟁점', '토론'];
      let combinedKeywords = [...(categoryKeywords[topCategory as keyof typeof categoryKeywords] || []), ...generalKeywords];
      
      // 검색어가 포함된 키워드 필터링
      const relatedKeywords = combinedKeywords.filter(keyword => 
        !keyword.includes(searchQuery) && !searchQuery.includes(keyword)
      );
      
      // 랜덤하게 최대 5개 선택
      const randomKeywords = relatedKeywords
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      
      setSuggestedKeywords(randomKeywords);
    } catch (error) {
      console.error('추천 키워드 생성 중 오류:', error);
      setSuggestedKeywords(['사회이슈', '경제', '환경', '정치', '기술']); // 폴백 키워드
    }
  };

  // 검색 결과가 없을 때 보여줄 컴포넌트
  const NoResults = () => (
    <div className="text-center py-16">
      <h2 className="text-2xl font-semibold mb-4">검색 결과가 없습니다</h2>
      <p className="text-gray-600 mb-6">다른 검색어로 다시 시도해 보세요.</p>
      
      {suggestedKeywords.length > 0 && (
        <div className="mb-8">
          <p className="text-gray-700 mb-3">이런 키워드는 어떠세요?</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestedKeywords.map(keyword => (
              <Link 
                key={keyword} 
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="px-4 py-2 bg-teal-50 text-teal-600 rounded-full hover:bg-teal-100 transition-colors"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <Link href="/" className="text-teal-600 hover:underline">메인으로 돌아가기</Link>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">검색 결과: "{query}"</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {issues.length > 0 
            ? `총 ${issues.length}개의 게시글을 찾았습니다.` 
            : loading 
              ? '검색 중...' 
              : '검색 결과가 없습니다.'}
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-4 text-red-600">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      ) : issues.length > 0 ? (
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
                    {highlightText(issue.title, query)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow p-2 pt-1">
                  <p className="mb-2 text-sm leading-snug line-clamp-3 text-gray-600">
                    {highlightText(issue.description, query)}
                  </p>
                  <p className="text-xs leading-tight text-gray-500 mt-auto">
                    {formatDistanceToNow(new Date(issue.created_at || ''), { addSuffix: true, locale: ko })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </main>
  );
} 