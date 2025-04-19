"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditIssue({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    content: '',
    slug: '',
  });

  useEffect(() => {
    async function fetchIssue() {
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          setFormData({
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail,
            content: data.content || '',
            slug: data.slug,
          });
        }
      } catch (error: any) {
        console.error('Error fetching issue:', error.message);
        alert('게시글을 가져오는 중 오류가 발생했습니다.');
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    }

    fetchIssue();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      // 슬러그 업데이트
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const { error } = await supabase
        .from('issues')
        .update({
          title: formData.title,
          description: formData.description,
          thumbnail: formData.thumbnail,
          content: formData.content,
          slug: slug,
        })
        .eq('id', id);

      if (error) throw error;
      
      router.push('/admin');
    } catch (error: any) {
      console.error('Error updating issue:', error.message);
      alert('게시글 수정 중 오류가 발생했습니다.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            제목
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            설명
          </label>
          <input
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnail">
            썸네일 URL
          </label>
          <input
            id="thumbnail"
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={saveLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saveLoading ? '저장 중...' : '저장'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
} 