/**
 * Toolbar for Data Explorer (filters, pagination, export)
 */
import { memo } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Download, Filter, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { Tooltip } from '../common/Tooltip';

export const DataExplorerToolbar = memo(function DataExplorerToolbar({
  selectedTable,
  page,
  pageSize,
  totalCount,
  totalPages,
  showFilters,
  onToggleFilters,
  onExportCSV,
  onExportJSON,
  onPrevPage,
  onNextPage,
  onRefresh,
  onAddRow,
}) {
  if (!selectedTable) return null;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, totalCount)} of {totalCount} rows</span>
        <span className="mx-2">|</span>
        <span>Page {page + 1} of {totalPages}</span>
      </div>
      <div className="flex gap-2">
        <Tooltip text="Add new row">
          <Button
            variant="success"
            size="sm"
            onClick={onAddRow}
            icon={<Plus size={16} />}
          >
            Add Row
          </Button>
        </Tooltip>
        <Tooltip text={showFilters ? 'Hide filters' : 'Show filters'}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleFilters}
            icon={<Filter size={16} />}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </Tooltip>
        <Tooltip text="Export to CSV">
          <Button
            variant="secondary"
            size="sm"
            onClick={onExportCSV}
            icon={<Download size={16} />}
          >
            CSV
          </Button>
        </Tooltip>
        <Tooltip text="Export to JSON">
          <Button
            variant="secondary"
            size="sm"
            onClick={onExportJSON}
            icon={<Download size={16} />}
          >
            JSON
          </Button>
        </Tooltip>
        <Tooltip text="Previous page">
          <Button
            variant="secondary"
            size="sm"
            onClick={onPrevPage}
            disabled={page === 0}
          >
            <ChevronLeft size={16} />
          </Button>
        </Tooltip>
        <Tooltip text="Next page">
          <Button
            variant="secondary"
            size="sm"
            onClick={onNextPage}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight size={16} />
          </Button>
        </Tooltip>
        <div className="ml-2">
          <Tooltip text="Refresh data">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={16} />}
              onClick={onRefresh}
            >
              Refresh
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
});
