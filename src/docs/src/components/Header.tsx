import { Database, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';

export default function Header() {
  return (
    <motion.header 
      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 shadow-lg fixed top-0 left-0 right-0 z-50"
      {...fadeIn}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Database size={32} />
          <span className="text-2xl font-bold">DB Toolkit Docs</span>
        </div>
        <a href="https://github.com/Adelodunpeter25/db-toolkit" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
          <Github size={24} />
        </a>
      </div>
    </motion.header>
  );
}
