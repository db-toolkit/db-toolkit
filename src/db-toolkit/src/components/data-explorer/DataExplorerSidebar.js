/**
 * Data Explorer Sidebar Component
 */
import { LoadingState } from '../common/LoadingState';
import { TableSelector } from './TableSelector';

export function DataExplorerSidebar({
  schemaLoading,
  schema,
  selectedTable,
  onSelectTable,
  onRefreshTable,
  onDropTable,
}) {
  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      {schemaLoading ? (
        <div className="p-4">
          <LoadingState message="Loading schema..." />
        </div>
      ) : (
        <TableSelector
          schema={schema}
          selectedTable={selectedTable}
          onSelectTable={onSelectTable}
          onRefreshTable={onRefreshTable}
          onDropTable={onDropTable}
        />
      )}
    </div>
  );
}
