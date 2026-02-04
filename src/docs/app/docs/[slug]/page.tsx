import { getDocBySlug, getAllDocs } from '@/lib/docs';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Sidebar } from '@/components/Sidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { TableOfContents } from '@/components/TableOfContents';

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export default async function DocPage({ params }: { params: { slug: string } }) {
  const doc = getDocBySlug(params.slug);

  return (
    <div className="flex">
      <Sidebar />
      
      <main className="flex-1 min-w-0">
        <div className="container mx-auto px-8 py-8 max-w-7xl">
          <div className="flex gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <Breadcrumbs />
              
              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-3">{doc.title}</h1>
                {doc.description && (
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {doc.description}
                  </p>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {doc.readingTime}
                </p>
              </header>
              
              <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-code:text-cyan-600 dark:prose-code:text-cyan-400 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-slate-900 dark:prose-pre:bg-slate-900">
                <MDXRemote source={doc.content} />
              </article>
            </div>
            
            {/* Table of contents */}
            <aside className="w-64 shrink-0">
              <TableOfContents />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
