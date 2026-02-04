import type { ParsedDoc } from './mdxRenderer';
import { parseMDXContent } from './mdxRenderer';

export interface DocData extends ParsedDoc {
  rawContent: string;
}

const docFiles = import.meta.glob('../data/*.mdx?raw', { import: 'default' }) as Record<string, () => Promise<string>>;
const cache = new Map<string, DocData>();

function buildKey(filename: string) {
  const name = filename.startsWith('../data/') ? filename : `../data/${filename}`;
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
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const loader = docFiles[key];
  if (!loader) {
    throw new Error(`Documentation file "${filename}" not found`);
  }

  const rawContent = await loader();
  const sanitized = stripSourceMapComments(rawContent);
  const parsed: ParsedDoc = parseMDXContent(sanitized);
  const doc: DocData = { ...parsed, rawContent: sanitized };
  cache.set(key, doc);
  return doc;
}

export function getDocFilenames() {
  return Object.keys(docFiles).map((key) => key.replace('../data/', '').replace('?raw', ''));
}
