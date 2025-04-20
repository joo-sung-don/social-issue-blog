import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 헤더 섹션 */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Social Issue Blog 소개</h1>
        <p className="text-lg text-gray-600 mb-8">
          사회적 이슈에 대한 깊이 있는 분석과 다양한 관점을 제공하는 플랫폼입니다.
        </p>
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1200&h=400&q=80"
            alt="Social Issue Blog"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
      </div>

      {/* 미션 섹션 */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 pb-2">우리의 미션</h2>
        <p className="text-lg mb-6">
          Social Issue Blog는 현대 사회가 직면한 다양한 이슈들에 대해 사실에 기반한 정보와 다각적인 분석을 제공하고자 합니다. 
          우리는 독자들이 복잡한 사회 문제를 더 잘 이해하고, 자신만의 의견을 형성할 수 있도록 돕는 것을 목표로 합니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">정확한 정보</h3>
            <p>신뢰할 수 있는 출처와 데이터를 기반으로 정확한 정보를 제공합니다.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-green-700">다양한 시각</h3>
            <p>다양한 관점에서 이슈를 조명하여 균형 잡힌 시각을 제공합니다.</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-purple-700">심층 분석</h3>
            <p>표면적인 정보를 넘어 근본 원인과 잠재적 영향에 대한 깊이 있는 분석을 제공합니다.</p>
          </div>
        </div>
      </div>

      {/* 카테고리 섹션 */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 pb-2">다루는 주제</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-green-600">경제</h3>
            <p className="mb-4">경제 정책, 고용, 금융, 빈부 격차 등 경제 관련 이슈를 다룹니다.</p>
            <Link href="/category/economics" className="text-blue-600 hover:underline">자세히 보기 →</Link>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">기술</h3>
            <p className="mb-4">AI, 디지털 혁신, 개인정보 보호, 기술 윤리 등 기술 관련 이슈를 다룹니다.</p>
            <Link href="/category/technology" className="text-blue-600 hover:underline">자세히 보기 →</Link>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-emerald-600">환경</h3>
            <p className="mb-4">기후 변화, 지속 가능성, 생태계 보존, 환경 정책 등 환경 관련 이슈를 다룹니다.</p>
            <Link href="/category/environment" className="text-blue-600 hover:underline">자세히 보기 →</Link>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-purple-600">사회</h3>
            <p className="mb-4">교육, 인권, 복지, 다양성, 형평성 등 사회 관련 이슈를 다룹니다.</p>
            <Link href="/category/society" className="text-blue-600 hover:underline">자세히 보기 →</Link>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-red-600">정치</h3>
            <p className="mb-4">정치 제도, 법률, 국제 관계, 정부 정책 등 정치 관련 이슈를 다룹니다.</p>
            <Link href="/category/politics" className="text-blue-600 hover:underline">자세히 보기 →</Link>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-600">전체 보기</h3>
            <p className="mb-4">모든 카테고리의 게시글을 한 페이지에서 모아 볼 수 있습니다.</p>
            <Link href="/" className="text-blue-600 hover:underline">자세히 보기 →</Link>
          </div>
        </div>
      </div>

      {/* 참여 방법 섹션 */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 pb-2">참여 방법</h2>
        <p className="text-lg mb-8">
          Social Issue Blog는 독자 여러분의 참여를 환영합니다. 
          다양한 방법으로 소통하고 의견을 나눌 수 있습니다.
        </p>
        <div className="bg-gray-50 p-8 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4">함께 해보세요</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-lg">댓글 작성</h4>
                <p className="text-gray-600">각 게시글에 댓글을 남겨 의견을 공유하고 토론에 참여하세요.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-lg">뉴스레터 구독</h4>
                <p className="text-gray-600">정기적으로 최신 이슈와 분석을 이메일로 받아보세요.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-lg">실시간 토론</h4>
                <p className="text-gray-600">실시간 채팅을 통해 다른 독자들과 의견을 교환하세요.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 