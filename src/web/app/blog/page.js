import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/utils/blog';

export default function Blog() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-24">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Blog
        </h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
          Tips, tutorials, and updates about DB Toolkit
        </p>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20">
            <p className="text-xl">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
