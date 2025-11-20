import { memo } from 'react';
import { Database, Github, Moon, Sun, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onSearchClick: () => void;
}

function Header({ onSearchClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header 
      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 shadow-lg fixed top-0 left-0 right-0 z-50"
      {...fadeIn}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Database size={32} />
          <span className="text-2xl font-bold">DB Toolkit Docs</span>
        </div>
        
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors min-w-[300px]"
        >
          <Search size={16} />
          <span className="text-sm flex-1 text-left">Search</span>
          <kbd className="px-2 py-0.5 text-xs bg-white/20 rounded">⌘K</kbd>
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="hover:opacity-80 transition-opacity"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
          <a 
            href="https://github.com/Adelodunpeter25/db-toolkit" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:scale-110 hover:text-gray-900 dark:hover:text-white transition-all"
            aria-label="GitHub"
          >
            <Github size={24} />
          </a>
        </div>
      </div>
    </motion.header>
  );
}

export default memo(Header);
