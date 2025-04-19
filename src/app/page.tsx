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
      <main className="container mx-auto px-4 py-8">
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
    <main className="container mx-auto px-4 py-8" style={{ maxWidth: "1100px" }}>
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-700">
            데이터베이스 연결 중 오류가 발생했습니다. 샘플 데이터를 표시합니다.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[80px]">
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
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow hover:translate-y-[-3px] duration-300">
                <div className="relative w-full overflow-hidden" style={{ height: "230px" }}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center p-5">
                    <img
                      src={issue.thumbnail}
                      alt={issue.title}
                      style={{ 
                        maxWidth: "90%", 
                        maxHeight: "90%",
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                        borderRadius: "6px",
                        transition: "transform 0.3s ease"
                      }}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-medium mb-2 line-clamp-1">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2" style={{ maxHeight: "40px" }}>
                    {issue.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {issue.date}
                  </p>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <p className="col-span-3 text-center py-8">게시글이 없습니다.</p>
        )}
      </div>
    </main>
  );
}
