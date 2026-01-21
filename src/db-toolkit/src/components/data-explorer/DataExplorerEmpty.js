/**
 * Empty states for Data Explorer
 */

import { Database } from 'lucide-react';
import { Button } from '../common/Button';

export function DataExplorerNoConnections({ onNavigate }) {
  return (
    <div className="p-8 flex items-center justify-center h-full animate-page-transition">
      <div className="text-center max-w-md">
        <Database className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Connections</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create a database connection first to explore your data
        </p>
        <Button onClick={onNavigate}>
          Create Connection
        </Button>
      </div>
    </div>
  );
}

export default DataExplorerNoConnections;
