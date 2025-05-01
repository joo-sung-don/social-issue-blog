"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import Image from 'next/image';
import { resizeImage, compressImageIfNeeded } from '@/lib/imageUtils';

const categoryNames: Record<string, string> = {
  'economics': '경제',
  'technology': '기술',
  'environment': '환경',
  'society': '사회',
  'politics': '정치'
};

export default function CreateIssue() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: 'society',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState('');

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    setLoading(true);

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const now = new Date();
      const date = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

      const { error } = await supabase
        .from('issues')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            thumbnail: formData.thumbnail,
            content: content,
            date: date,
            slug: slug,
            category: formData.category,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
      
      router.push('/admin');
    } catch (error: any) {
      console.error('Error creating issue:', error.message);
      alert('게시글 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const menuButtonClass = "px-2 py-1 border rounded hover:bg-gray-100 mr-1 mb-1 text-sm";
  const activeMenuButtonClass = "px-2 py-1 border rounded bg-blue-100 text-blue-700 mr-1 mb-1 text-sm font-bold";

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">새 게시글 작성</h1>
      
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            카테고리
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg bg-white"
          >
            {Object.entries(categoryNames).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
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
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
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
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '저장 중...' : '저장'}
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