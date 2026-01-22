/**
 * Data Explorer Content Component
 */
import { LoadingState } from '../common/LoadingState';
import { Button } from '../common/Button';
import { ColumnFilter } from './ColumnFilter';
import { DataGrid } from './DataGrid';

export function DataExplorerContent({
  showFilters,
  selectedTable,
  columns,
  filters,
  loading,
  data,
  sortColumn,
  sortOrder,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  onSort,
  onCellClick,
  onCellUpdate,
  onFilterByValue,
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {showFilters && selectedTable && (
        <ColumnFilter
          columns={columns}
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
        />
      )}
      {showFilters && selectedTable && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <Button variant="primary" size="sm" onClick={onApplyFilters}>
            Apply Filters
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <LoadingState message="Loading data..." />
        ) : selectedTable ? (
          data.length > 0 ? (
            <DataGrid
              data={data}
              columns={columns}
              onSort={onSort}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onCellClick={onCellClick}
              onCellUpdate={onCellUpdate}
              onFilterByValue={onFilterByValue}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No data found</p>
                <p className="text-sm">This table is empty or has no accessible data</p>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Select a table to view data
          </div>
        )}
      </div>
    </div>
  );
}
