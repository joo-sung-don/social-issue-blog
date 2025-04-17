import Image from 'next/image';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function IssueDetailPage({ params }: PageProps) {
  // 실제 데이터는 나중에 params.slug를 사용해서 가져올 예정
  const mockData = {
    title: "환경 오염 이슈",
    description: "플라스틱 사용 증가로 인한 환경 문제가 심각해지고 있습니다. 전 세계적으로 매년 수백만 톤의 플라스틱이 바다로 유입되며, 이는 해양 생태계에 치명적인 영향을 미치고 있습니다.",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    date: "2024년 4월 15일",
    content: `
      환경 오염은 현대 사회가 직면한 가장 심각한 문제 중 하나입니다. 특히 플라스틱 사용량이 급증하면서 발생하는 환경 문제는 더욱 심각해지고 있습니다.

      주요 문제점:
      1. 해양 생태계 파괴
      2. 미세플라스틱 오염
      3. 토양 오염
      4. 대기 오염

      이러한 문제를 해결하기 위해서는 개인과 기업, 정부 모두의 노력이 필요합니다. 재활용 촉진, 친환경 제품 사용, 환경 규제 강화 등 다양한 대책이 요구됩니다.
    `
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="space-y-8">
        {/* 헤더 섹션 */}
        <header className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            {mockData.title}
          </h1>
          <p className="text-gray-600">
            {mockData.date}
          </p>
        </header>

        {/* 메인 이미지 */}
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <Image
            src={mockData.thumbnail}
            alt={mockData.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 설명 */}
        <p className="text-xl text-gray-700 leading-relaxed">
          {mockData.description}
        </p>

        {/* 본문 내용 */}
        <div className="prose prose-lg max-w-none">
          {mockData.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* 댓글 섹션 */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">댓글</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600">댓글 기능은 준비 중입니다...</p>
          </div>
        </section>
      </article>
    </div>
  );
} 