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
          setIssues(data);
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
      <main className="container mx-auto px-[16px] py-[32px]">
        <p>로딩 중...</p>
      </main>
    );
  }

  if (error) {
    console.log('Rendering with error, using fallback data');
  }

  // 디버깅용 - 사용 가능한 슬러그 출력
  console.log('Available slugs:', issues.map(issue => issue.slug));

  return (
    <main className="container mx-auto px-[16px] py-[32px]" style={{ maxWidth: "1100px" }}>
      {error && (
        <div className="mb-[16px] p-[16px] bg-yellow-50 rounded-[8px]">
          <p className="text-yellow-700">
            데이터베이스 연결 중 오류가 발생했습니다. 샘플 데이터를 표시합니다.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-[30px]">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <Link 
              key={issue.id} 
              href={{
                pathname: `/${issue.slug}`,
              }}
              legacyBehavior={false}
              prefetch={false}
              className="block"
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow hover:translate-y-[-3px] duration-[300ms] rounded-[20px]">
                <div className="p-[16px] pt-[20px] bg-blue-600">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1 text-white text-center">
                    {issue.title}
                  </h3>
                </div>
                <div className="relative w-full h-[400px] overflow-hidden flex items-center justify-center p-[16px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"></div>
                  <div className="relative z-10 w-[80%] h-[80%] overflow-hidden rounded-[16px] shadow-md transform hover:scale-105 transition-transform duration-300">
                    <img
                      src={issue.thumbnail}
                      
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-[20px] bg-white rounded-b-[20px]">
                  <p className="text-[14px] text-gray-600 mb-[16px] line-clamp-2" style={{ maxHeight: "42px" }}>
                    {issue.description}
                  </p>
                  <p className="text-[12px] text-gray-500 pt-[8px] border-t border-gray-100">
                    {issue.date}
                  </p>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <p className="col-span-3 text-center py-[32px]">게시글이 없습니다.</p>
        )}
      </div>
    </main>
  );
}
