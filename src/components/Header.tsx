'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // theme 컴포넌트가 마운트된 후에만 테마 관련 기능을 사용합니다
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (mounted) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <div className="flex justify-between h-[64px]">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-[24px] w-[24px] mr-[8px] text-blue-600 dark:text-blue-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
                />
              </svg>
              <span className="text-[20px] font-[700] text-gray-800 dark:text-white">Social Issue Blog</span>
            </Link>
          </div>
          
          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-[24px]">
            <nav className="flex items-center space-x-[16px]">
              <Link href="/" className="text-[14px] font-[500] text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                홈
              </Link>
              <Link href="/about" className="text-[14px] font-[500] text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                소개
              </Link>
              <Link href="/categories" className="text-[14px] font-[500] text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                카테고리
              </Link>
              <Link href="/contact" className="text-[14px] font-[500] text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                문의하기
              </Link>
            </nav>
            
            {/* 다크 모드 토글 버튼 */}
            <button
              onClick={toggleTheme}
              className="p-[8px] rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {mounted && theme === 'dark' ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-[20px] w-[20px]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-[20px] w-[20px]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                  />
                </svg>
              )}
            </button>
            
            {/* 검색 버튼 */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-[8px] rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="검색"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-[20px] w-[20px]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
            
            {/* 관리자 버튼 */}
            <Link
              href="/admin"
              className="px-[16px] py-[8px] rounded-[8px] text-[14px] font-[500] text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              관리자
            </Link>
          </div>
          
          {/* 모바일 메뉴 버튼 */}
          <div className="flex md:hidden items-center space-x-[12px]">
            {/* 모바일 다크 모드 토글 */}
            <button
              onClick={toggleTheme}
              className="p-[8px] rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {mounted && theme === 'dark' ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-[20px] w-[20px]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-[20px] w-[20px]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                  />
                </svg>
              )}
            </button>
            
            {/* 모바일 메뉴 버튼 */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-[8px] rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="메뉴"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-[24px] w-[24px]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 모바일 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-md">
          <nav className="flex flex-col py-[8px]">
            <Link 
              href="/" 
              className="px-[16px] py-[12px] text-[16px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              홈
            </Link>
            <Link 
              href="/about" 
              className="px-[16px] py-[12px] text-[16px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              소개
            </Link>
            <Link 
              href="/categories" 
              className="px-[16px] py-[12px] text-[16px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              카테고리
            </Link>
            <Link 
              href="/contact" 
              className="px-[16px] py-[12px] text-[16px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              문의하기
            </Link>
            <Link 
              href="/admin" 
              className="mx-[16px] my-[12px] px-[16px] py-[8px] text-[16px] text-center text-white bg-blue-600 dark:bg-blue-500 rounded-[8px] hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              관리자
            </Link>
          </nav>
        </div>
      )}
      
      {/* 검색 오버레이 */}
      {isSearchOpen && (
        <div className="absolute top-[64px] left-0 right-0 bg-white dark:bg-slate-900 shadow-md border-t border-gray-100 dark:border-slate-800 p-[16px]">
          <div className="max-w-[600px] mx-auto relative">
            <input 
              type="text" 
              placeholder="검색어를 입력하세요" 
              className="w-full px-[16px] py-[12px] pr-[48px] border border-gray-300 dark:border-slate-700 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
              autoFocus
            />
            <button 
              className="absolute right-[16px] top-[50%] transform translate-y-[-50%] text-gray-500 dark:text-gray-400"
              aria-label="검색"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-[20px] w-[20px]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
} 