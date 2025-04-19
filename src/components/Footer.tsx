import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">사회 이슈 블로그</h3>
            <p className="text-slate-300 dark:text-slate-400">
              현대 사회의 다양한 이슈와 문제점을 다루는 블로그입니다.
              함께 고민하고 해결책을 모색해봅시다.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">빠른 링크</h3>
            <ul className="flex flex-wrap gap-[40px]">
              <li>
                <Link href="/" className="text-slate-300 dark:text-slate-400 hover:text-white transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 dark:text-slate-400 hover:text-white transition-colors">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-300 dark:text-slate-400 hover:text-white transition-colors">
                  관리자
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">문의하기</h3>
            <p className="text-slate-300 dark:text-slate-400 mb-2">
              이메일: contact@socialissues.com
            </p>
            <p className="text-slate-300 dark:text-slate-400">
              전화: 02-123-4567
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-slate-300 dark:text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-slate-300 dark:text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-slate-300 dark:text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 dark:border-slate-800 mt-8 pt-6 text-center text-slate-400 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} 사회 이슈 블로그. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 