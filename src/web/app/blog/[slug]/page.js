import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getPostBySlug, getAllPostSlugs } from '@/utils/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';

export function generateStaticParams() {
  return getAllPostSlugs();
}

export default function BlogPost({ params }) {
  const post = getPostBySlug(params.slug);

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
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={18} />
              {post.readingTime}
            </span>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article>
    </main>
  );
}
