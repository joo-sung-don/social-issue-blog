"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchInputProps {
  placeholder?: string;
  isMobile?: boolean;
}

export default function SearchInput({ placeholder = "이슈 검색...", isMobile = false }: SearchInputProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // 인기 검색어 (실제로는 API에서 가져오는 것이 좋을 것입니다)
  const popularKeywords = [
    '의대 정원', '국민연금', '여성가족부', '대선후보'
  ];

  // 최근 검색어 불러오기
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        const parsedSearches = JSON.parse(savedSearches);
        setRecentSearches(Array.isArray(parsedSearches) ? parsedSearches : []);
      } catch (e) {
        console.error('최근 검색어 파싱 오류:', e);
        setRecentSearches([]);
      }
    }
  }, []);

  // 검색창 이외의 영역 클릭 시 자동완성 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 검색 실행 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 최근 검색어에 추가
      saveRecentSearch(searchQuery.trim());
      
      // 검색 페이지로 이동
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  // 최근 검색어 저장 함수
  const saveRecentSearch = (query: string) => {
    const updatedSearches = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // 최근 검색어 삭제 함수
  const removeRecentSearch = (query: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const updatedSearches = recentSearches.filter(item => item !== query);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // 검색어 제안이 있는지 확인
  const hasSuggestions = recentSearches.length > 0 || popularKeywords.length > 0;

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            className={`${isMobile ? 'w-full' : ''} bg-gray-100 px-4 py-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
          />
          <button 
            type="submit" 
            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-teal-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* 검색어 자동완성 및 최근 검색어 */}
      {showSuggestions && hasSuggestions && (
        <div className="absolute z-[40] mt-1 w-full max-w-md right-0 bg-white rounded-md shadow-lg border border-gray-200 py-2">
          {recentSearches.length > 0 && (
            <div className="px-3 py-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-500">최근 검색어</h3>
                <button 
                  className="text-xs text-teal-500 hover:text-teal-700"
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('recentSearches');
                  }}
                >
                  전체 삭제
                </button>
              </div>
              <ul className="space-y-1">
                {recentSearches.map((query) => (
                  <li key={`recent-${query}`} className="group">
                    <Link 
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{query}</span>
                      </div>
                      <button 
                        onClick={(e) => removeRecentSearch(query, e)}
                        className="text-gray-400 hover:text-gray-600 hidden group-hover:block"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {popularKeywords.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100">
              <h3 className="text-xs font-medium text-gray-500 mb-2">인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((keyword) => (
                  <Link
                    key={`popular-${keyword}`}
                    href={`/search?q=${encodeURIComponent(keyword)}`}
                    onClick={() => {
                      saveRecentSearch(keyword);
                      setShowSuggestions(false);
                    }}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    {keyword}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 