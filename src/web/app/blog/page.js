import { motion } from 'framer-motion';
import BlogCard from '@/components/BlogCard';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/utils/blog';

export default function Blog() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-24">
      <div className="container mx-auto px-6 py-12">
        <motion.h1 {...fadeInUp(0)} className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Blog
        </motion.h1>
        <motion.p {...fadeInUp(0.2)} className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
          Tips, tutorials, and updates about DB Toolkit
        </motion.p>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20">
            <p className="text-xl">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div {...staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post, index) => (
              <motion.div key={post.slug} {...fadeInUp(0.3 + index * 0.1)}>
                <BlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <Footer />
    </main>
  );
}
