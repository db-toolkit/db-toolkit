import { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';

const DocsPage = lazy(() => import('./pages/DocsPage'));

function App() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeProvider>
      <div className="flex flex-col bg-white dark:bg-gray-900">
        <Header onSearchClick={() => setIsCommandOpen(true)} />
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        }>
          <DocsPage isCommandOpen={isCommandOpen} onCommandClose={() => setIsCommandOpen(false)} />
        </Suspense>
      </div>
    </ThemeProvider>
  );
}

export default App;
