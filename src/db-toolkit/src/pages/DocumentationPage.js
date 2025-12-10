/**
 * SQL Documentation and Reference page.
 */
import { useState, useMemo } from 'react';
import { Search, Copy, Check, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDebounce } from '../utils/debounce';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { pageTransition } from '../utils/animations';
import documentation from '../data/documentation.json';

function DocumentationPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('sql');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const tabs = [
    { id: 'sql', label: 'SQL Reference', categoryIds: ['basics', 'joins', 'aggregate', 'advanced', 'functions'] },
    { id: 'features', label: 'Features', categoryIds: ['features'] },
    { id: 'troubleshooting', label: 'Troubleshooting', categoryIds: ['troubleshooting'] },
  ];

  const filteredDocs = useMemo(() => {
    const activeTabData = tabs.find(t => t.id === activeTab);
    const tabCategories = documentation.categories.filter(cat => 
      activeTabData.categoryIds.includes(cat.id)
    );

    if (!debouncedSearch) return tabCategories;

    const query = debouncedSearch.toLowerCase();
    return tabCategories
      .map(category => ({
        ...category,
        topics: category.topics.filter(topic =>
          topic.title.toLowerCase().includes(query) ||
          topic.content.toLowerCase().includes(query) ||
          topic.keywords.some(kw => kw.includes(query))
        )
      }))
      .filter(category => category.topics.length > 0);
  }, [debouncedSearch, activeTab, tabs]);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    showToast('Code copied to clipboard', 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderContent = (content) => {
    const parts = content.split('```');
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        const [lang, ...codeLines] = part.split('\n');
        const code = codeLines.join('\n').trim();
        const codeId = `code-${idx}`;
        return (
          <div key={idx} className="relative my-4 group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleCopy(code, codeId)}
              >
                {copiedCode === codeId ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{code}</code>
            </pre>
          </div>
        );
      }
      return (
        <div key={idx} className="prose dark:prose-invert max-w-none">
          {part.split('\n').map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} className="font-semibold mt-4 mb-2">{line.slice(2, -2)}</p>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="ml-4">{line.slice(2)}</li>;
            }
            if (line.trim()) {
              return <p key={i} className="mb-2">{line}</p>;
            }
            return null;
          })}
        </div>
      );
    });
  };

  return (
    <motion.div className="h-screen flex flex-col" {...pageTransition}>
      {/* Top Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 pt-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Documentation</h1>
        </div>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedTopic(null);
              }}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-green-600 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

          <nav className="p-2">
            {filteredDocs.map(category => (
              <div key={category.id} className="mb-4">
                <h3 className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {category.title}
                </h3>
                {category.topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedTopic?.id === topic.id
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedTopic ? (
            <div className="p-8 max-w-4xl">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {selectedTopic.title}
              </h1>
              <div className="text-gray-700 dark:text-gray-300">
                {renderContent(selectedTopic.content)}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen size={64} className="mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Documentation
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a topic from the sidebar to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default DocumentationPage;
