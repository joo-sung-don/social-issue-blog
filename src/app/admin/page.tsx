"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface Issue {
  id: number;
  title: string;
  description: string;
  date: string;
  slug: string;
  category?: string;
}

// 카테고리 한글 이름 맵핑
const categoryNames: Record<string, string> = {
  'economics': '경제',
  'technology': '기술',
  'environment': '환경',
  'society': '사회',
  'politics': '정치'
};

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  async function fetchIssues() {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error: any) {
      console.error('Error fetching issues:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteIssue(id: number) {
    const confirmed = window.confirm('정말로 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('issues')
        .delete()
        .match({ id });

      if (error) throw error;
      
      // 목록에서 삭제된 항목 제거
      setIssues(issues.filter(issue => issue.id !== id));
    } catch (error: any) {
      console.error('Error deleting issue:', error.message);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">관리자 페이지</h1>
        <Link href="/admin/create">
          <Button>새 게시글 작성</Button>
        </Link>
      </div>
      
      <div className="mt-8">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">게시글이 없습니다</h2>
            <p className="text-gray-600 mb-6">첫 번째 게시글을 작성해보세요.</p>
            <Link href="/admin/create">
              <Button>게시글 작성하기</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {issues.map((issue) => (
                  <tr key={issue.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/${issue.slug}`} className="hover:underline">
                        {issue.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoryNames[issue.category || ''] || issue.category || '미분류'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/edit/${issue.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => deleteIssue(issue.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← 홈페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
} 