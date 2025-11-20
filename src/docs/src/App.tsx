import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import DocsPage from './pages/DocsPage';

function App() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col pt-[72px] bg-white dark:bg-gray-900">
        <Header onSearchClick={() => setIsCommandOpen(true)} />
        <DocsPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
