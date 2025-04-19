"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { issues as fallbackIssues } from '@/data/issues';
import Image from 'next/image';

interface Issue {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  slug: string;
}

// 날짜 포맷 함수 추가
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return dateStr; // 유효하지 않은 날짜면 원본 문자열 반환
    }
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('날짜 포맷 에러:', error);
    return dateStr;
  }
}

// URL이 유효한지 확인하는 함수
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// 기본 대체 이미지
const fallbackImage = "https://images.unsplash.com/photo-1523633589114-88eaf4b4f1a8?auto=format&fit=crop&w=1200&q=80";

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIssues() {
      try {
        console.log('Fetching issues from Supabase'); // 디버깅용
        
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          
          // 폴백: 로컬 데이터 사용
          console.log('Using fallback issues data');
          setIssues(fallbackIssues as Issue[]);
        } else if (data && data.length > 0) {
          console.log('Issues found in Supabase:', data.length);
          
          // URL 유효성 검사 및 수정
          const processedData = data.map(issue => ({
            ...issue,
            thumbnail: issue.thumbnail && isValidUrl(issue.thumbnail) 
              ? issue.thumbnail 
              : fallbackImage
          }));
          
          setIssues(processedData);
        } else {
          console.log('No issues found in Supabase, using fallback data');
          setIssues(fallbackIssues as Issue[]);
        }
      } catch (error: any) {
        console.error('Fetch error:', error);
        setError(error.message);
        setIssues(fallbackIssues as Issue[]);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 dark:bg-slate-700 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-gray-300 dark:bg-slate-600"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('Rendering with error, using fallback data');
  }

  // 디버깅용 - 사용 가능한 슬러그 출력
  console.log('Available slugs:', issues.map(issue => issue.slug));

  return (
    <div className="py-12 container mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">
        사회 이슈 탐구
      </h1>
      
      {/* 최신 이슈 섹션 */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-l-4 border-blue-500 pl-4">
          최신 이슈
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {issues.map((issue) => (
            <Link key={issue.id} href={`/${issue.slug}`} className="block group">
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-0 rounded-xl dark:bg-slate-800 dark:border-slate-700">
                <div className="aspect-video relative overflow-hidden rounded-t-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent z-10"></div>
        <Image
                    src={isValidUrl(issue.thumbnail) ? issue.thumbnail : fallbackImage}
                    alt={issue.title}
                    quality={90}
                    priority={true}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardHeader className="p-5">
                  <CardTitle className="text-xl leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                    {issue.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow px-5 pt-0 pb-5">
                  <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-3">
                    {issue.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {formatDate(issue.date)}
                    </p>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                      자세히 보기
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 추천 섹션 */}
      <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          인기 있는 주제
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/environmental-pollution" className="px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-800 dark:text-gray-200 font-medium">환경 오염</Link>
          <Link href="/youth-unemployment" className="px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-800 dark:text-gray-200 font-medium">청년 실업</Link>
          <Link href="/ai-ethics" className="px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-800 dark:text-gray-200 font-medium">AI 윤리</Link>
        </div>
      </div>
    </div>
  );
}
