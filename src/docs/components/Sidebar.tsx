'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { docsConfig } from '@/lib/config';
import { useState, useEffect } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Initialize open sections based on current page
  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    docsConfig.sections.forEach((section) => {
      const hasActivePage = section.items.some(
        (item) => pathname === `/docs/${item.slug}`
      );
      initialState[section.title] = hasActivePage;
    });
    setOpenSections(initialState);
  }, [pathname]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16">
      <nav className="p-4 space-y-6">
        {docsConfig.sections.map((section) => (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {section.title}
              <svg
                className={`w-4 h-4 transition-transform ${
                  openSections[section.title] ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {openSections[section.title] && (
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === `/docs/${item.slug}`;
                  return (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${item.slug}`}
                        className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-medium'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
