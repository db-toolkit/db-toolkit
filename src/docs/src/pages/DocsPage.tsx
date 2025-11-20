import { useState, lazy, Suspense } from 'react';
import CommandPalette from '../components/CommandPalette';

const GuidePage = lazy(() => import('./GuidePage'));
const ChangelogPage = lazy(() => import('./ChangelogPage'));

interface DocsPageProps {
  isCommandOpen: boolean;
  onCommandClose: () => void;
}

export default function DocsPage({ isCommandOpen, onCommandClose }: DocsPageProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'changelog'>('guide');

  return (
    <>
      <div className="fixed top-[72px] left-0 right-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-40">
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
      
      <div className="pt-[124px]">
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        }>
          {activeTab === 'guide' ? <GuidePage /> : <ChangelogPage />}
        </Suspense>
      </div>
      
      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={onCommandClose}
        onNavigate={() => setActiveTab('guide')}
      />
    </>
  );
}
