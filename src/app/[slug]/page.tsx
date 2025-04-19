"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { issues as fallbackIssues } from '@/data/issues';
import { use } from 'react';
import Link from 'next/link';

interface Issue {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  content: string;
  slug: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function IssuePage({ params }: PageProps) {
  // params를 React.use()로 unwrap
  const unwrappedParams = use(params as any) as { slug: string };
  // URL 디코딩을 추가
  const slug = decodeURIComponent(unwrappedParams.slug);

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 디버깅용 로그
  console.log("상세 페이지 컴포넌트 렌더링");
  console.log("원본 slug 파라미터:", unwrappedParams.slug);
  console.log("디코딩된 slug 파라미터:", slug);
  console.log("폴백 데이터의 slugs:", fallbackIssues.map(i => i.slug));

  useEffect(() => {
    async function fetchIssue() {
      try {
        console.log('Fetching issue with slug:', slug); // 디버깅용

        // 폴백 데이터에서 먼저 확인 - 디버깅용
        const localIssue = fallbackIssues.find(i => i.slug === slug);
        console.log('Local issue match:', localIssue ? "found" : "not found");

        // Supabase에서 데이터 가져오기
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('slug', slug)
          .limit(1);

        console.log('Supabase response:', { data, error });

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          
          // 폴백: 로컬 데이터에서 검색
          console.log('Falling back to local data');
          if (localIssue) {
            console.log('Found issue in local data');
            setIssue(localIssue as Issue);
          } else {
            console.log('Issue not found in local data');
          }
        } else if (data && data.length > 0) {
          console.log('Issue found in Supabase:', data[0]);
          setIssue(data[0]);
        } else {
          console.log('No data returned from Supabase');
          // 폴백: 로컬 데이터에서 검색
          console.log('Trying local data');
          if (localIssue) {
            console.log('Found issue in local data');
            setIssue(localIssue as Issue);
          } else {
            console.log('No issue found with slug:', slug);
            // 슬러그 대소문자 무시하고 검색 시도
            const caseInsensitiveMatch = fallbackIssues.find(
              i => i.slug.toLowerCase() === slug.toLowerCase()
            );
            if (caseInsensitiveMatch) {
              console.log('Found case-insensitive match in fallback data');
              setIssue(caseInsensitiveMatch as Issue);
            }
          }
        }
      } catch (error: any) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchIssue();
  }, [slug]);

  if (loading) {
    return (
      <main className="container mx-auto px-[16px] py-[32px]" style={{ maxWidth: "1100px" }}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-[18px]">로딩 중...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-[16px] py-[32px]" style={{ maxWidth: "1100px" }}>
        <div className="max-w-[800px] mx-auto bg-red-50 p-[24px] rounded-[16px] shadow-md">
          <h1 className="text-[24px] font-bold text-red-700 mb-[16px]">오류가 발생했습니다</h1>
          <p className="text-red-600 mb-[16px]">{error}</p>
          <Link href="/" className="inline-flex items-center text-blue-600 hover:underline">
            <span>← 메인 페이지로 돌아가기</span>
          </Link>
        </div>
      </main>
    );
  }

  if (!issue) {
    console.log('No issue found, returning 404');
    return notFound();
  }

  console.log('Rendering issue page for:', issue.title);

  return (
    <main className="container mx-auto px-[16px] py-[32px]" style={{ maxWidth: "1100px" }}>
      <div className="max-w-[800px] mx-auto bg-white rounded-[20px] shadow-md overflow-hidden">
        {/* 상단 내비게이션 */}
        <div className="p-[16px] bg-gray-50 border-b border-gray-100">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[16px] w-[16px] mr-[8px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>메인페이지로 돌아가기</span>
          </Link>
        </div>
        
        {/* 이미지 영역 */}
        <div className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="relative w-full h-[400px]">
            <img
              src={issue.thumbnail}
              alt={issue.title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        {/* 콘텐츠 영역 */}
        <div className="p-[32px]">
          <h1 className="text-[32px] font-[700] mb-[16px] text-gray-800">{issue.title}</h1>
          <p className="text-[14px] text-gray-500 mb-[32px] pb-[16px] border-b border-gray-100">{issue.date}</p>
          
          <div className="prose prose-lg max-w-none">
            {issue.content?.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-[24px] text-[16px] leading-[1.8] text-gray-700">
                {paragraph.trim()}
              </p>
            ))}
          </div>
          
          {/* 하단 내비게이션 */}
          <div className="mt-[40px] pt-[24px] border-t border-gray-100">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[16px] w-[16px] mr-[8px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>메인페이지로 돌아가기</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 