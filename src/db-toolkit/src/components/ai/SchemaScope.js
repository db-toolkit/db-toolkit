import { memo } from 'react';

export const SchemaScope = memo(({ schemaScope, setSchemaScope }) => {
  return (
    <div className="flex-shrink-0 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
      <span className="font-medium text-gray-700 dark:text-gray-200">Schema scope:</span>
      {['table', 'schema', 'all'].map(scope => (
        <button
          key={scope}
          onClick={() => setSchemaScope(scope)}
          className={`px-2 py-1 rounded border text-xs transition ${
            schemaScope === scope
              ? 'border-green-500 text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {scope === 'table' ? 'Current table' : scope === 'schema' ? 'Schema' : 'All tables'}
        </button>
      ))}
    </div>
  );
});

SchemaScope.displayName = 'SchemaScope';
