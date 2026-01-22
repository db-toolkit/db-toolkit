/**
 * Data Explorer Header Component
 */
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Button } from '../common/Button';
import { DataExplorerToolbar } from './DataExplorerToolbar';

export function DataExplorerHeader({
  breadcrumbItems,
  selectedTable,
  page,
  pageSize,
  totalCount,
  totalPages,
  showFilters,
  onChangeConnection,
  onToggleFilters,
  onExportCSV,
  onExportJSON,
  onPrevPage,
  onNextPage,
  onRefresh,
  onAddRow,
}) {
  return (
    <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Data Explorer</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onChangeConnection}
          >
            Change Connection
          </Button>
        </div>
      </div>
      <Breadcrumbs items={breadcrumbItems} />
      <DataExplorerToolbar
        selectedTable={selectedTable}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        showFilters={showFilters}
        onToggleFilters={onToggleFilters}
        onExportCSV={onExportCSV}
        onExportJSON={onExportJSON}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onRefresh={onRefresh}
        onAddRow={onAddRow}
      />
    </div>
  );
}
