import { useState, useEffect } from 'react';
import CommandPalette from '../components/CommandPalette';
import GuidePage from './GuidePage';
import ChangelogPage from './ChangelogPage';

interface DocsPageProps {
  onCommandOpen?: (isOpen: boolean) => void;
}

export default function DocsPage({ onCommandOpen }: DocsPageProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'changelog'>('guide');
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
        onCommandOpen?.(true);
      }
      if (e.key === 'Escape') {
        setIsCommandOpen(false);
        onCommandOpen?.(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCommandOpen]);

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex gap-8 px-8">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Guide
          </button>
          <button
            onClick={() => setActiveTab('changelog')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'changelog'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Changelog
          </button>
        </div>
      </div>
      
      {activeTab === 'guide' ? <GuidePage /> : <ChangelogPage />}
      
      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)}
        onNavigate={() => setActiveTab('guide')}
      />
    </>
  );
}
