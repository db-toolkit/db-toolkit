/**
 * Floating Action Button for adding new database connections
 */
import { Plus } from 'lucide-react';

export function AddConnectionButton({ onClick, isVisible = true }) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 group">
      <button
        onClick={onClick}
        className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        aria-label="Add new database connection"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-200" />
      </button>
      <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none">
        Add a new database connection
      </div>
    </div>
  );
}
