"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
        {/* 푸터 메인 콘텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 사이트 소개 */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="relative h-12 w-12 mr-2">
                <Image 
                  src="/images/logo.jpg" 
                  alt="ISSUE:DA 로고" 
                  width={48} 
                  height={48} 
                />
              </div>
              <h4 className="text-gray-900 font-bold text-lg">ISSUE:DA</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              다양한 사회 이슈에 대한 깊이 있는 분석과 토론을 통해 더 나은 사회를 향한 담론을 만들어갑니다.
            </p>
            {/* 소셜 미디어 아이콘 */}
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-teal-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-teal-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-teal-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-teal-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 카테고리 링크 */}
          <div className="md:col-span-1">
            <h4 className="text-gray-900 font-bold text-lg mb-4">카테고리</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-teal-600">소개</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-teal-600">전체</Link></li>
              <li><Link href="/category/economics" className="text-gray-600 hover:text-teal-600">경제</Link></li>
              <li><Link href="/category/technology" className="text-gray-600 hover:text-teal-600">기술</Link></li>
              <li><Link href="/category/environment" className="text-gray-600 hover:text-teal-600">환경</Link></li>
              <li><Link href="/category/society" className="text-gray-600 hover:text-teal-600">사회</Link></li>
              <li><Link href="/category/politics" className="text-gray-600 hover:text-teal-600">정치</Link></li>
              <li><Link href="/category/statistics" className="text-gray-600 hover:text-teal-600">통계</Link></li>
            </ul>
          </div>

          {/* 사이트 링크 */}
          <div className="md:col-span-1">
            <h4 className="text-gray-900 font-bold text-lg mb-4">사이트</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-teal-600">소개</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-teal-600">문의하기</Link></li>
              <li><Link href="/contributors" className="text-gray-600 hover:text-teal-600">기고자</Link></li>
              <li><Link href="/archive" className="text-gray-600 hover:text-teal-600">전체 글 보기</Link></li>
            </ul>
          </div>

          {/* 법적 정보 */}
          <div className="md:col-span-1">
            <h4 className="text-gray-900 font-bold text-lg mb-4">정책</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-600 hover:text-teal-600">이용약관</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-teal-600">개인정보처리방침</Link></li>
              <li><Link href="/copyright" className="text-gray-600 hover:text-teal-600">저작권 정책</Link></li>
              <li><Link href="/disclaimer" className="text-gray-600 hover:text-teal-600">면책조항</Link></li>
              <li><Link href="/accessibility" className="text-gray-600 hover:text-teal-600">접근성 안내</Link></li>
            </ul>
          </div>
        </div>

        {/* 저작권 정보 */}
        <div className="border-t border-gray-200 py-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ISSUE:DA. 모든 콘텐츠는 저작권법의 보호를 받으며, 무단 복제 및 배포를 금합니다.<br />
            본 사이트의 콘텐츠는 정보 제공 목적으로만 작성되었으며, 법적 또는 전문적인 조언으로 해석되어서는 안 됩니다.
          </p>
        </div>
      </div>
    </footer>
  );
} 