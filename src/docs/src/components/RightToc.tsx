import { memo, useEffect, useState } from 'react';
import { slugify } from '../utils/slugify';

interface TocItem {
  heading: string;
}

interface RightTocProps {
  items: TocItem[];
}

function RightToc({ items }: RightTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('h2[id], h3[id]')) as HTMLElement[];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 1.0] }
    );

    headings.forEach((el) => observer.observe(el));
    setActiveId(headings[0].id);

    return () => observer.disconnect();
  }, [items]);
  if (!items || items.length === 0) return null;

  return (
    <aside className="hidden xl:block w-64 flex-shrink-0 px-4">
      <div className="sticky top-24">
        <div className="text-xs uppercase tracking-wider text-slate-400 mb-3">
          On this page
        </div>
        <ul className="space-y-2 text-sm">
          {items.map((item) => {
            const id = slugify(item.heading);
            const isActive = id === activeId;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`block transition-colors ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-300'
                  }`}
                >
                  {item.heading}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export default memo(RightToc);
