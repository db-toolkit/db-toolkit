'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { docsConfig } from '@/lib/config';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  const slug = pathname.replace('/docs/', '');
  
  // Find the current page in config
  let currentPage = null;
  let sectionTitle = '';
  
  for (const section of docsConfig.sections) {
    const item = section.items.find((i) => i.slug === slug);
    if (item) {
      currentPage = item;
      sectionTitle = section.title;
      break;
    }
  }

  if (!currentPage) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
      <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100">
        Docs
      </Link>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-slate-400 dark:text-slate-500">{sectionTitle}</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-slate-900 dark:text-slate-100 font-medium">
        {currentPage.title}
      </span>
    </nav>
  );
}
