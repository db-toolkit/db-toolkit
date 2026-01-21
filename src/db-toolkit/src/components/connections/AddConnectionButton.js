/**
 * Floating Action Button for adding new database connections
 */
import { Plus } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export function AddConnectionButton({ onClick }) {
  return (
    <Tooltip content="Add a new database connection" position="left">
      <button
        onClick={onClick}
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
        aria-label="Add new database connection"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-200" />
      </button>
    </Tooltip>
  );
}
