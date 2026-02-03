import { memo } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocData {
  title: string;
  sections: { heading: string; content: string }[];
  rawContent: string;
}

interface DocContentProps {
  data: DocData;
  prevSection?: { id: string; label: string };
  nextSection?: { id: string; label: string };
  onNavigate?: (id: string) => void;
}

function DocContent({ data, prevSection, nextSection, onNavigate }: DocContentProps) {
  const handleNavigate = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <motion.main 
      className="p-4 md:p-8 lg:p-12 max-w-4xl w-full"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h1 
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
        variants={fadeInUp}
      >
        {data.title}
      </motion.h1>
      
      <motion.div 
        className="prose prose-lg dark:prose-invert max-w-none"
        variants={fadeInUp}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.rawContent}
        </ReactMarkdown>
      </motion.div>
      
      {(prevSection || nextSection) && onNavigate && (
        <motion.div 
          className="mt-8 md:mt-16 pt-6 md:pt-8 border-t-2 border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 md:gap-4"
          variants={fadeInUp}
        >
          {prevSection ? (
            <button
              onClick={() => handleNavigate(prevSection.id)}
              className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <ArrowLeft size={20} className="md:w-6 md:h-6" />
              <div className="text-left">
                <div className="text-xs md:text-sm opacity-70">Previous</div>
                <div className="text-sm md:text-lg font-semibold">{prevSection.label}</div>
              </div>
            </button>
          ) : <div className="hidden sm:block" />}
          
          {nextSection && (
            <button
              onClick={() => handleNavigate(nextSection.id)}
              className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="text-right">
                <div className="text-xs md:text-sm opacity-80">Next</div>
                <div className="text-sm md:text-lg font-semibold">{nextSection.label}</div>
              </div>
              <ArrowRight size={20} className="md:w-6 md:h-6" />
            </button>
          )}
        </motion.div>
      )}
    </motion.main>
  );
}

export default memo(DocContent);
