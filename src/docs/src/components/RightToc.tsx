import { memo } from 'react';
import { slugify } from '../utils/slugify';

interface TocItem {
  heading: string;
}

interface RightTocProps {
  items: TocItem[];
}

function RightToc({ items }: RightTocProps) {
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
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-300 transition-colors"
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
