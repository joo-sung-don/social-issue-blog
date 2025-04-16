import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                Social Issue Blog
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/admin"
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              관리자
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 