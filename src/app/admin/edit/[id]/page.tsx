"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { use } from 'react';
import { resizeImage, compressImageIfNeeded } from '@/lib/imageUtils';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditIssue({ params }: PageProps) {
  const unwrappedParams = use(params as any) as { id: string };
  const id = unwrappedParams.id;
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<string | null>(null);
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
          
          // 썸네일 URL이 있으면 미리보기에 표시
          if (data.thumbnail) {
            setPreviewUrl(data.thumbnail);
          }
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
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const originalFile = files[0];
    setUploadLoading(true);
    setImageInfo(`원본 이미지: ${(originalFile.size / 1024 / 1024).toFixed(2)}MB`);

    try {
      // 파일 미리보기 생성 (원본으로 미리보기만 표시)
      const objectUrl = URL.createObjectURL(originalFile);
      setPreviewUrl(objectUrl);
      
      // 이미지 압축 및 리사이징 처리
      console.log('이미지 리사이징 시작');
      const compressedFile = await compressImageIfNeeded(originalFile, 2); // 최대 2MB
      console.log(`압축 후 크기: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      setImageInfo(`원본: ${(originalFile.size / 1024 / 1024).toFixed(2)}MB → 
                  압축됨: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

      // 파일명 생성 (현재 시간+랜덤값으로 고유한 파일명 생성)
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage
        .from('issue-images') // 스토리지 버킷 이름
        .upload(filePath, compressedFile);

      if (error) {
        throw error;
      }

      // 업로드된 파일의 공개 URL 생성
      const { data: publicUrlData } = supabase.storage
        .from('issue-images')
        .getPublicUrl(filePath);

      // formData에 썸네일 URL 저장
      setFormData((prev) => ({ ...prev, thumbnail: publicUrlData.publicUrl }));
      
      console.log('File uploaded:', publicUrlData.publicUrl);
    } catch (error: any) {
      console.error('Error uploading file:', error.message);
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadLoading(false);
    }
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
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            썸네일 이미지
          </label>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    {uploadLoading ? "업로드 중..." : "클릭하여 이미지 업로드"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, GIF 파일 지원 (자동으로 리사이징됨)
                  </p>
                </div>
              </div>

              {/* 기존 URL 입력 필드 */}
              <div className="mt-2">
                <label className="block text-gray-700 text-xs font-medium mb-1">
                  또는 이미지 URL 직접 입력
                </label>
                <input
                  id="thumbnail"
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            {/* 이미지 미리보기 */}
            <div className="w-full md:w-1/3">
              {(previewUrl || formData.thumbnail) && (
                <div className="space-y-2">
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                    <img
                      src={previewUrl || formData.thumbnail}
                      alt="미리보기"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {imageInfo && (
                    <p className="text-xs text-gray-500">{imageInfo}</p>
                  )}
                </div>
              )}
            </div>
          </div>
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