import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { issues } from "@/data/issues";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="w-full grid grid-cols-3 gap-x-10 gap-y-8 items-stretch">
        {issues.map((issue) => (
          <Link href={`/${issue.slug}`} key={issue.id}>
            <Card className="h-full flex flex-col p-3 hover:shadow-lg transition-shadow">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="text-lg leading-tight mb-1">
                  {issue.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow p-2 pt-1">
                <div className="relative w-full h-48 mb-2">
                  <img
                    src={issue.thumbnail}
                    alt={issue.title}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
                <p className="mb-2 text-sm leading-snug text-gray-600">
                  {issue.description}
                </p>
                <p className="text-xs text-gray-500 leading-tight mt-auto">
                  {issue.date}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
