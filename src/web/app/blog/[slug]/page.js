import dynamic from 'next/dynamic';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const BlogContent = dynamic(() => Promise.resolve(({ content }) => (
  <div
    className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
    dangerouslySetInnerHTML={{ __html: content }}
  />
)), { ssr: true });

export function generateStaticParams() {
  return [
    { slug: 'getting-started' },
    { slug: 'database-migrations' },
    { slug: 'backup-strategies' }
  ];
}

export default function BlogPost({ params }) {
  const post = {
    title: 'Getting Started with DB Toolkit',
    date: 'January 19, 2025',
    readTime: '5 min read',
    content: `
      <h2>Introduction</h2>
      <p>DB Toolkit is a modern database management application that makes working with databases simple and efficient.</p>
      
      <h2>Installation</h2>
      <p>Download the latest version for your platform from our releases page.</p>
      
      <h2>First Steps</h2>
      <p>After installation, create your first database connection and start exploring your data.</p>
    `
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24">
      <article className="container mx-auto px-6 max-w-4xl py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 text-cyan-600 dark:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <span className="flex items-center gap-2">
              <Calendar size={18} />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={18} />
              {post.readTime}
            </span>
          </div>
          
          <BlogContent content={post.content} />
        </div>
      </article>
    </main>
  );
}
