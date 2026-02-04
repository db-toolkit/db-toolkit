/**
 * MDX Loader Hook
 * Loads and parses MDX files from /data folder
 */
import { useState, useEffect } from 'react';
import { loadDocData } from '../utils/docsLoader';
import type { DocData } from '../utils/docsLoader';

/**
 * Hook to load MDX documentation
 */
export function useMDXDoc(filename: string) {
  const [data, setData] = useState<DocData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDoc() {
      try {
        setLoading(true);
        setError(null);

        const doc = await loadDocData(filename);
        setData(doc);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load documentation');
        console.error('Error loading MDX:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDoc();
  }, [filename]);

  return { data, loading, error };
}
