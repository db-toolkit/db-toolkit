import fs from "fs";
import path from "path";
import matter from "gray-matter";

const dataDir = path.join(process.cwd(), "data");

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
  return fs.readFileSync(fullPath, "utf8");
}

function calculateReadingTime(text: string): string {
  const wordsPerMinute = 100;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function getAllDocs(): DocPost[] {
  if (!fs.existsSync(dataDir)) return [];
  return fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = readDocFile(slug);
      const { data, content } = matter(raw);
      return {
        slug,
        content,
        title: data.title || slug,
        description: data.description,
        date: data.date,
        readingTime: calculateReadingTime(content),
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
    readingTime: calculateReadingTime(content),
  };
}
