/**
 * MDX Loader Hook
 * Loads and parses MDX files from /data folder
 */
import { useState, useEffect } from 'react';

interface DocSection {
  heading: string;
  content: string;
}

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
        const parsed = parseMDXContent(mdxContent);
        setData({ ...parsed, rawContent: mdxContent });
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

/**
 * Parse MDX content into title and sections
 */
function parseMDXContent(mdxContent: string): Omit<DocData, 'rawContent'> {
  const lines = mdxContent.split('\n');
  const sections: DocSection[] = [];
  let currentSection: DocSection | null = null;
  let title = '';

  for (const line of lines) {
    if (line.startsWith('# ') && !title) {
      title = line.replace('# ', '').trim();
      continue;
    }

    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: line.replace('## ', '').trim(),
        content: '',
      };
      continue;
    }

    if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { title, sections };
}
