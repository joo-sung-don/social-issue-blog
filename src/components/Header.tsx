"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 기능 구현 (추후 추가)
    console.log('검색어:', searchQuery);
    // 검색 페이지로 이동하는 로직 추가 예정
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 mr-2">Social Issue Blog</span>
            </Link>
          </div>

          {/* 데스크톱 메뉴 - 중간 크기 이상에서만 표시 */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/category/environment" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">환경</Link>
            <Link href="/category/society" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">사회</Link>
            <Link href="/category/politics" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">정치</Link>
            <Link href="/category/economics" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">경제</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">소개</Link>
          </div>

          {/* 우측 기능 버튼들 */}
          <div className="flex items-center space-x-2">
            {/* 검색 폼 - 중간 크기 이상에서만 표시 */}
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <input
                  type="text"
                  placeholder="이슈 검색..."
                  className="bg-gray-100 px-4 py-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* 관리자 버튼 */}
            <Link
              href="/admin"
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              관리자
            </Link>

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
            <Link href="/category/environment" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">환경</Link>
            <Link href="/category/society" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">사회</Link>
            <Link href="/category/politics" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">정치</Link>
            <Link href="/category/economics" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">경제</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">소개</Link>
            
            {/* 모바일 검색 폼 */}
            <form onSubmit={handleSearch} className="pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="이슈 검색..."
                  className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-3 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </nav>
    </header>
  );
} 