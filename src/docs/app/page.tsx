import Link from 'next/link';
import { docsConfig } from '@/lib/config';

export default function DocsIndexPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Everything you need to know about DB Toolkit
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {docsConfig.sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/docs/${item.slug}`}
                    className="block p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                        {item.title}
                      </span>
                      <svg
                        className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
