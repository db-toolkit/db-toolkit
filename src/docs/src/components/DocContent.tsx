import { memo } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { CodeBlock } from './CodeBlock';

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
        className="prose prose-lg prose-slate dark:prose-invert max-w-none
                   prose-headings:scroll-mt-24 prose-headings:font-semibold
                   prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl
                   prose-a:text-emerald-600 dark:prose-a:text-emerald-300
                   prose-a:no-underline hover:prose-a:underline
                   prose-code:text-emerald-700 dark:prose-code:text-emerald-300
                   prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950
                   prose-pre:border prose-pre:border-slate-800
                   prose-table:overflow-hidden prose-table:rounded-xl
                   prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-800"
        variants={fadeInUp}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ children }) => <h1 className="font-semibold">{children}</h1>,
            h2: ({ children }) => <h2 className="font-semibold">{children}</h2>,
            h3: ({ children }) => <h3 className="font-semibold">{children}</h3>,
            p: ({ children }) => <p className="leading-relaxed">{children}</p>,
            a: ({ children, href }) => (
              <a href={href} className="font-medium">
                {children}
              </a>
            ),
            code: ({ inline, className, children }) => {
              if (inline) {
                return (
                  <code className="rounded bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.5">
                    {children}
                  </code>
                );
              }
              return <CodeBlock className={className}>{children}</CodeBlock>;
            },
            pre: ({ children }) => <pre className="not-prose">{children}</pre>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/30 px-4 py-3 rounded-r-lg">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto">
                <table className="w-full">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="bg-slate-100 dark:bg-slate-900 px-3 py-2 text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-t border-slate-200 dark:border-slate-800 px-3 py-2">
                {children}
              </td>
            ),
            ul: ({ children }) => <ul className="list-disc pl-6">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6">{children}</ol>,
            li: ({ children }) => <li className="my-1">{children}</li>,
            hr: () => <hr className="border-slate-200 dark:border-slate-800" />,
          }}
        >
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
