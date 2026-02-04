/**
 * MDX Loader Hook
 * Loads and parses MDX files from /data folder
 */
import { useState, useEffect } from 'react';
import type { DocSection, ParsedDoc } from '../utils/mdxRenderer';
import { parseMDXContent } from '../utils/mdxRenderer';

interface DocData {
  title: string;
  sections: DocSection[];
  rawContent: string;
}

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

        const response = await fetch(`/data/${filename}`);
        if (!response.ok) {
          throw new Error(`Failed to load ${filename}`);
        }

        const mdxContent = await response.text();
        const sanitized = stripSourceMapComments(mdxContent);
        const parsed: ParsedDoc = parseMDXContent(sanitized);
        setData({ ...parsed, rawContent: sanitized });
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

function stripSourceMapComments(content: string) {
  return content
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//# sourceMappingURL=')) return false;
      if (trimmed.startsWith('/*# sourceMappingURL=')) return false;
      return true;
    })
    .join('\n');
}

/**
 * Parse MDX content into title and sections
 */
// parseMDXContent lives in ../utils/mdxRenderer
