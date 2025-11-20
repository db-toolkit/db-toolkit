import type { DocData } from '../data';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface DocContentProps {
  data: DocData;
  prevSection?: { id: string; label: string };
  nextSection?: { id: string; label: string };
  onNavigate?: (id: string) => void;
}

export default function DocContent({ data, prevSection, nextSection, onNavigate }: DocContentProps) {
  const handleNavigate = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.main 
      className="flex-1 p-12 max-w-4xl"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h1 
        className="text-5xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
        variants={fadeInUp}
      >
        {data.title}
      </motion.h1>
      {data.sections.map((section, index) => (
        <motion.section 
          key={index} 
          className="mb-12"
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">{section.heading}</h2>
          <div className="space-y-4">
            {section.content.split('\n').map((line, i) => (
              line.trim() && <p key={i} className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{line}</p>
            ))}
          </div>
        </motion.section>
      ))}
      
      {(prevSection || nextSection) && onNavigate && (
        <motion.div 
          className="mt-16 pt-8 border-t-2 border-gray-200 dark:border-gray-700 flex justify-between items-center gap-4"
          variants={fadeInUp}
        >
          {prevSection ? (
            <button
              onClick={() => handleNavigate(prevSection.id)}
              className="flex items-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <ArrowLeft size={24} />
              <div className="text-left">
                <div className="text-sm opacity-70">Previous</div>
                <div className="text-lg font-semibold">{prevSection.label}</div>
              </div>
            </button>
          ) : <div />}
          
          {nextSection && (
            <button
              onClick={() => handleNavigate(nextSection.id)}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="text-right">
                <div className="text-sm opacity-80">Next</div>
                <div className="text-lg font-semibold">{nextSection.label}</div>
              </div>
              <ArrowRight size={24} />
            </button>
          )}
        </motion.div>
      )}
    </motion.main>
  );
}
