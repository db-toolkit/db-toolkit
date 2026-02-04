import { renderDocContent, getDocBySlug, getAllDocs } from '@/lib/docs';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export default async function DocPage({ params }: { params: { slug: string } }) {
  const doc = getDocBySlug(params.slug);
  const mdxSource = await renderDocContent(doc.content);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/docs" className="text-sm text-cyan-600 hover:underline">
          ← Back to docs
        </Link>
        <header>
          <p className="text-sm text-slate-500">{doc.readingTime}</p>
          <h1 className="text-4xl font-bold">{doc.title}</h1>
        </header>
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <MDXRemote source={mdxSource} />
        </article>
      </div>
    </main>
  );
}
