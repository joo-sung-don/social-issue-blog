"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Issue {
  id: number;
  title: string;
  description: string;
  date: string;
  slug: string;
}

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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">게시글 관리</h1>
        <Link
          href="/admin/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          새 게시글 작성
        </Link>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : issues.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.title}</td>
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
  );
} 