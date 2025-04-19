"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Issue {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  content: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function IssuePage({ params }: PageProps) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIssue() {
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('slug', params.slug)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return notFound();
          }
          throw error;
        }

        setIssue(data);
      } catch (error) {
        console.error('Error fetching issue:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIssue();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p>로딩 중...</p>
      </main>
    );
  }

  if (!issue) {
    return notFound();
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