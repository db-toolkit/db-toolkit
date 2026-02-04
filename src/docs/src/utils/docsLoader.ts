import type { ParsedDoc } from './mdxRenderer';
import { parseMDXContent } from './mdxRenderer';

export interface DocData extends ParsedDoc {
  rawContent: string;
}

const docsRaw = import.meta.glob('../../data/*.mdx?raw', {
  import: 'default',
  eager: true,
}) as Record<string, string>;

function buildKey(filename: string) {
  const name = filename.startsWith('../../data/') ? filename : `../../data/${filename}`;
  return name.endsWith('?raw') ? name : `${name}?raw`;
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

export async function loadDocData(filename: string): Promise<DocData> {
  const key = buildKey(filename);
  const rawContent = docsRaw[key];
  if (!rawContent) {
    throw new Error(`Documentation file "${filename}" not found`);
  }
  const sanitized = stripSourceMapComments(rawContent);
  const parsed: ParsedDoc = parseMDXContent(sanitized);
  return { ...parsed, rawContent: sanitized };
}

export function getDocFilenames() {
  return Object.keys(docsRaw).map((key) => key.replace('../../data/', '').replace('?raw', ''));
}
