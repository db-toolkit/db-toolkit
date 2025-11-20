'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export default function NavigationLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      prevPathname.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  if (!loading) return null;
  return <LoadingSpinner />;
}
