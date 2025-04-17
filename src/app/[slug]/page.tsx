import { issues } from "@/data/issues";
import { notFound } from "next/navigation";
import Image from 'next/image';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function IssuePage({ params }: PageProps) {
  const issue = issues.find((issue) => issue.slug === params.slug);

  if (!issue) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <div className="relative w-full h-[400px] mb-8">
          <img
            src={issue.thumbnail}
            alt={issue.title}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">{issue.title}</h1>
        <p className="text-gray-500 mb-8">{issue.date}</p>
        <div className="prose prose-lg max-w-none">
          {issue.content?.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
} 