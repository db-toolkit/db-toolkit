'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { docsConfig } from '@/lib/config';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Filter results
  const results = query
    ? docsConfig.sections.flatMap((section) =>
        section.items
          .filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          )
          .map((item) => ({ ...item, section: section.title }))
      )
    : [];

  const handleSelect = (slug: string) => {
    router.push(`/docs/${slug}`);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].slug);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 w-full max-w-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search documentation...</span>
        <kbd className="ml-auto hidden sm:inline-block px-2 py-0.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl z-50 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search documentation..."
              className="flex-1 bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              autoFocus
            />
            <kbd className="text-xs text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto p-2">
            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                No results found for "{query}"
              </div>
            )}
            {results.map((result, index) => (
              <button
                key={result.slug}
                onClick={() => handleSelect(result.slug)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  index === selectedIndex
                    ? 'bg-cyan-50 dark:bg-cyan-950'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {result.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {result.section}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
