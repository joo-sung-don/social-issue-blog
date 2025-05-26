"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { issues as fallbackIssues } from '@/data/issues';
import { use } from 'react';
import IssueChat from '@/components/IssueChat';

interface Issue {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  content: string;
  slug: string;
}

// Next.js 15 Promise 타입으로 변경
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function IssuePage({ params }: PageProps) {
  // params를 React.use()로 unwrap
  const unwrappedParams = use(params);
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
      <main className="container mx-auto px-4 py-8">
        <p>로딩 중...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-red-50 p-4 rounded-lg">
          <h1 className="text-xl font-bold text-red-700">오류가 발생했습니다</h1>
          <p className="text-red-600">{error}</p>
          <p className="mt-4">
            <a href="/" className="text-blue-600 hover:underline">메인 페이지로 돌아가기</a>
          </p>
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
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <div className="w-full mb-8">
          <img
            src={issue.thumbnail}
            alt={issue.title}
            className="object-contain w-full rounded-lg"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">{issue.title}</h1>
        <p className="text-gray-500 mb-8">{issue.date}</p>
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: issue.content || '' }} />
        </div>
        <div className="mt-8 mb-12">
          <a href="/" className="text-blue-600 hover:underline">← 메인 페이지로 돌아가기</a>
        </div>
        
        {/* 실시간 채팅 섹션 */}
        <IssueChat issueSlug={slug} />
      </article>
    </main>
  );
} 