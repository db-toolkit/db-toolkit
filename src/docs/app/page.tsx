import Link from 'next/link';
import { getAllDocs } from '@/lib/docs';

export default function DocsIndexPage() {
  const posts = getAllDocs();

  return (
    <main className="min-h-screen bg-white text-slate-900 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold">Documentation</h1>
          <p className="text-slate-600 mt-2">
            Browse the latest guides and references for DB Toolkit.
          </p>
        </header>

        {posts.length === 0 && (
          <p className="text-center text-slate-500">
            No docs yet. Pull them in from `src/docs/data`.
          </p>
        )}

        <div className="grid gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/docs/${post.slug}`}
              className="block p-4 border border-slate-200 rounded-xl hover:border-slate-400 transition"
            >
              <div className="text-lg font-semibold">{post.title}</div>
              {post.description && <p className="text-slate-500">{post.description}</p>}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
