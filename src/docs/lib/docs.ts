import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import readingTime from 'reading-time';
import remarkGfm from 'remark-gfm';

const dataDir = path.join(process.cwd(), 'src/docs/data');

export interface DocPost {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  content: string;
  readingTime?: string;
}

function readDocFile(slug: string) {
  const fullPath = path.join(dataDir, `${slug}.mdx`);
  return fs.readFileSync(fullPath, 'utf8');
}

export function getAllDocs(): DocPost[] {
  if (!fs.existsSync(dataDir)) return [];
  return fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = readDocFile(slug);
      const { data, content } = matter(raw);
      return {
        slug,
        content,
        title: data.title || slug,
        description: data.description,
        date: data.date,
        readingTime: readingTime(content).text,
      };
    })
    .sort((a, b) => (a.title < b.title ? -1 : 1));
}

export function getDocBySlug(slug: string): DocPost {
  const raw = readDocFile(slug);
  const { data, content } = matter(raw);
  return {
    slug,
    content,
    title: data.title || slug,
    description: data.description,
    date: data.date,
    readingTime: readingTime(content).text,
  };
}

export async function renderDocContent(content: string) {
  return await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });
}
