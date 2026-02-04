import { getDocBySlug, getAllDocs } from '@/lib/docs';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Sidebar } from '@/components/Sidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { TableOfContents } from '@/components/TableOfContents';
import { CodeBlock } from '@/components/CodeBlock';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  return {
    title: `${doc.title} - DB Toolkit Docs`,
    description: doc.description || `Learn about ${doc.title} in DB Toolkit`,
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

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
                <div className="flex items-center gap-2 mb-3">
                  <h1 className="text-4xl font-bold">{doc.title}</h1>
                  <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">
                    {doc.readingTime}
                  </span>
                </div>
                {doc.description && (
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {doc.description}
                  </p>
                )}
              </header>
              
              <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-slate-900 dark:prose-pre:bg-slate-900 prose-h1:hidden">
                <MDXRemote 
                  source={doc.content}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [rehypeSlug],
                    },
                  }}
                  components={{
                    pre: ({ children }: any) => <CodeBlock>{children}</CodeBlock>,
                  }}
                />
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
