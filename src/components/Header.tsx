"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import SearchInput from './SearchInput';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-12 w-12 mr-2">
                <Image 
                  src="/images/logo.jpg" 
                  alt="ISSUE:DA 로고" 
                  width={48} 
                  height={48} 
                />
              </div>
              <span className="text-xl font-bold text-gray-800">ISSUE:DA</span>
            </Link>
          </div>

          {/* 데스크톱 메뉴 - 중간 크기 이상에서만 표시 */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/about" className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md">소개</Link>
            <Link href="/" className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md">전체</Link>
            <Link href="/category/economics" className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md">경제</Link>
            <Link href="/category/technology" className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md">기술</Link>
            <Link href="/category/environment" className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md">환경</Link>
            <Link href="/category/society" className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md">사회</Link>
            <Link href="/category/politics" className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md">정치</Link>
            <Link href="/category/statistics" className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md">통계</Link>
          </div>

          {/* 우측 기능 버튼들 */}
          <div className="flex items-center space-x-4">
            {/* 관리자 버튼 */}
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 z-50 relative"
              >
                관리자
              </Link>
            )}
            
            {/* 검색 폼 - 중간 크기 이상에서만 표시 */}
            <div className="hidden md:block w-64 relative">
              <SearchInput />
            </div>

            {/* 모바일 메뉴 버튼 - 중간 크기 미만에서만 표시 */}
            <button
              type="button"
              className="md:hidden bg-gray-100 p-2 rounded-md text-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 - 토글 상태에 따라 표시/숨김 */}
        {isMenuOpen && (
          <div className="md:hidden py-3 px-2 space-y-1 sm:px-3 border-t">
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">소개</Link>
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">전체</Link>
            <Link href="/category/economics" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">경제</Link>
            <Link href="/category/technology" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">기술</Link>
            <Link href="/category/environment" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">환경</Link>
            <Link href="/category/society" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">사회</Link>
            <Link href="/category/politics" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">정치</Link>
            <Link href="/category/statistics" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">통계</Link>
            {/* 모바일 검색 폼 */}
            <div className="pt-2">
              <SearchInput isMobile={true} />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 