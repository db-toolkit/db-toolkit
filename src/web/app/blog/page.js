import BlogList from '@/components/BlogList';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/utils/blog';

export default function Blog() {
  const allPosts = getAllPosts();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Tips and updates about DB Toolkit and database
        </p>
      </section>

      <BlogList posts={allPosts} />
      
      <Footer />
    </main>
  );
}

