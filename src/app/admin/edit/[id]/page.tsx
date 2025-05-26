"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { resizeImage, compressImageIfNeeded } from '@/lib/imageUtils';
import { use } from 'react';

const categoryNames: Record<string, string> = {
  'economics': '경제',
  'technology': '기술',
  'environment': '환경',
  'society': '사회',
  'politics': '정치'
};

// Next.js 15 Promise 기반 params 타입으로 수정
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditIssue({ params }: PageProps) {
  const unwrappedParams = use(params) as { id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    category: '',
    thumbnail: '',
  });
  const [content, setContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Color.configure({ types: [TextStyle.name] }),
      TextStyle,
      Placeholder.configure({
        placeholder: '내용을 입력하세요...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[250px] px-4 py-2',
      },
    },
  });

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        console.log('조회 시도 ID:', unwrappedParams.id, typeof unwrappedParams.id);
        
        // ID가 유효한 숫자인지 확인
        const issueId = parseInt(unwrappedParams.id);
        if (isNaN(issueId)) {
          throw new Error('유효하지 않은 ID입니다');
        }
        
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('id', issueId)
          .single();

        if (error) throw error;
        
        console.log('조회된 게시글:', data);
          setFormData({
          title: data.title || '',
          description: data.description || '',
          slug: data.slug || '',
          category: data.category || 'society',
          thumbnail: data.thumbnail || '',
        });

        setContent(data.content || '');
        if (editor && data.content) {
          editor.commands.setContent(data.content);
        }

          if (data.thumbnail) {
            setPreviewUrl(data.thumbnail);
        }

        setLoading(false);
      } catch (error) {
        console.error('게시글 불러오기 오류:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다.');
        router.push('/admin');
      }
    };

    fetchIssue();
  }, [unwrappedParams.id, router, editor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const originalFile = files[0];
    setUploadLoading(true);
    setImageInfo(`원본 이미지: ${(originalFile.size / 1024 / 1024).toFixed(2)}MB`);

    try {
      const objectUrl = URL.createObjectURL(originalFile);
      setPreviewUrl(objectUrl);
      
      console.log('이미지 리사이징 시작');
      const compressedFile = await compressImageIfNeeded(originalFile, 2);
      console.log(`압축 후 크기: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      setImageInfo(`원본: ${(originalFile.size / 1024 / 1024).toFixed(2)}MB → 압축됨: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { data, error } = await supabase.storage
        .from('issue-images')
        .upload(filePath, compressedFile);

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('issue-images')
        .getPublicUrl(filePath);

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
    setSaving(true);

    try {
      console.log('수정 시도 중...', unwrappedParams.id, formData);
      
      // ID가 유효한 숫자인지 확인
      const issueId = parseInt(unwrappedParams.id);
      if (isNaN(issueId)) {
        throw new Error('유효하지 않은 ID입니다');
      }
      
      const { data, error } = await supabase
        .from('issues')
        .update({
          ...formData,
          content: content,
        })
        .eq('id', issueId)
        .select();

      if (error) throw error;
      
      console.log('수정 성공!', data);
      alert('게시글이 성공적으로 수정되었습니다.');
      router.replace('/admin');
    } catch (error: any) {
      console.error('게시글 수정 오류:', error);
      console.error('오류 세부 정보:', error.message, error.details, error.hint, error.code);
      alert(`게시글 수정 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const menuButtonClass = "px-2 py-1 border rounded hover:bg-gray-100 mr-1 mb-1 text-sm";
  const activeMenuButtonClass = "px-2 py-1 border rounded bg-blue-100 text-blue-700 mr-1 mb-1 text-sm font-bold";

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            설명
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
            슬러그 (URL)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            카테고리
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">카테고리 선택</option>
            {Object.entries(categoryNames).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            썸네일 이미지
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3">
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
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
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            내용
          </label>
          {editor && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-2 border-b flex flex-wrap">
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive('bold') ? activeMenuButtonClass : menuButtonClass}
                  title="굵게"
                >
                  <strong>B</strong>
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive('italic') ? activeMenuButtonClass : menuButtonClass}
                  title="기울임"
                >
                  <em>I</em>
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={editor.isActive('underline') ? activeMenuButtonClass : menuButtonClass}
                  title="밑줄"
                >
                  <u>U</u>
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={editor.isActive('strike') ? activeMenuButtonClass : menuButtonClass}
                  title="취소선"
                >
                  <s>S</s>
                </button>
                
                <span className="mx-1 border-l h-6 border-gray-300"></span>
                
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={editor.isActive('heading', { level: 1 }) ? activeMenuButtonClass : menuButtonClass}
                  title="제목 1"
                >
                  H1
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={editor.isActive('heading', { level: 2 }) ? activeMenuButtonClass : menuButtonClass}
                  title="제목 2"
                >
                  H2
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={editor.isActive('heading', { level: 3 }) ? activeMenuButtonClass : menuButtonClass}
                  title="제목 3"
                >
                  H3
                </button>
                
                <span className="mx-1 border-l h-6 border-gray-300"></span>
                
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive('bulletList') ? activeMenuButtonClass : menuButtonClass}
                  title="글머리 기호"
                >
                  • 목록
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={editor.isActive('orderedList') ? activeMenuButtonClass : menuButtonClass}
                  title="번호 매기기"
                >
                  1. 목록
                </button>
                
                <span className="mx-1 border-l h-6 border-gray-300"></span>
                
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={editor.isActive('blockquote') ? activeMenuButtonClass : menuButtonClass}
                  title="인용구"
                >
                  " 인용
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={editor.isActive('codeBlock') ? activeMenuButtonClass : menuButtonClass}
                  title="코드 블록"
                >
                  {"</>"}
                </button>
                
                <span className="mx-1 border-l h-6 border-gray-300"></span>
                
                <button 
                  type="button"
                  onClick={() => {
                    const url = prompt('링크 URL을 입력하세요:');
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                  className={editor.isActive('link') ? activeMenuButtonClass : menuButtonClass}
                  title="링크 추가"
                >
                  🔗 링크
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  disabled={!editor.isActive('link')}
                  className={`${menuButtonClass} ${!editor.isActive('link') ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="링크 제거"
                >
                  🔗❌
                </button>
                
                <span className="mx-1 border-l h-6 border-gray-300"></span>
                
                <div className="flex items-center">
                  <label className="mr-1 text-sm">색상:</label>
                  <input
                    type="color"
                    onInput={(e) => {
                      editor.chain().focus().setColor((e.target as HTMLInputElement).value).run();
                    }}
                    value={editor.getAttributes('textStyle').color || '#000000'}
                    className="w-8 h-8 border rounded cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="p-4 min-h-[300px] prose-headings:my-3 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg">
                <EditorContent editor={editor} className="prose max-w-none" />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
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