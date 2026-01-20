/**
 * Data Explorer page for browsing table data
 */
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingState } from '../components/common/LoadingState';
import { DataGrid } from '../components/data-explorer/DataGrid';
import { TableSelector } from '../components/data-explorer/TableSelector';
import { CellViewModal } from '../components/data-explorer/CellViewModal';
import { ColumnFilter } from '../components/data-explorer/ColumnFilter';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { DataExplorerNoConnections as DataExplorerEmpty } from '../components/data-explorer/DataExplorerEmpty';
import { ConnectionSelector } from '../components/data-explorer/ConnectionSelector';
import { DataExplorerToolbar } from '../components/data-explorer/DataExplorerToolbar';
import { pageTransition } from '../utils/animations';
import { useDataExplorer } from '../hooks/data-explorer/useDataExplorer';

function DataExplorerPage() {
  const navigate = useNavigate();
  const {
    connections,
    connectionId,
    connectionName,
    connecting,
    schema,
    schemaLoading,
    selectedTable,
    data,
    columns,
    loading,
    page,
    pageSize,
    sortColumn,
    sortOrder,
    totalCount,
    filters,
    showFilters,
    cellModal,
    setConnectionId,
    setShowFilters,
    setCellModal,
    handleConnect,
    handleSelectTable,
    handleSort,
    handleFilterChange,
    applyFilters,
    clearFilters,
    handleCellClick,
    handleCellUpdate,
    exportToCSV,
    exportToJSON,
    handleNextPage,
    handlePrevPage,
    handleRefresh,
    handleDropTable,
  } = useDataExplorer();

  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  const breadcrumbItems = useMemo(() => {
    const items = [];
    if (connectionId) {
      items.push({ label: 'Connections', href: '/' });
      items.push({ label: connectionName, href: null });
      if (selectedTable) {
        items.push({ label: selectedTable.schema });
        items.push({ label: selectedTable.table });
      }
    }
    return items;
  }, [connectionId, connectionName, selectedTable]);

  const handleFilterByValue = useCallback((column, value, exclude = false) => {
    const filterValue = exclude ? `!${value}` : value;
    handleFilterChange(column, filterValue);
    setShowFilters(true);
  }, [handleFilterChange, setShowFilters]);

  if (!connectionId) {
    if (connections.length === 0) {
      return <DataExplorerEmpty onNavigate={() => navigate('/connections')} />;
    }

    return (
      <ConnectionSelector
        connections={connections}
        connecting={connecting}
        onConnect={handleConnect}
      />
    );
  }

  return (
    <motion.div className="h-screen flex flex-col" {...pageTransition}>
      <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Data Explorer</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConnectionId(null)}
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
          onToggleFilters={() => setShowFilters(!showFilters)}
          onExportCSV={exportToCSV}
          onExportJSON={exportToJSON}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onRefresh={handleRefresh}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          {schemaLoading ? (
            <div className="p-4">
              <LoadingState message="Loading schema..." />
            </div>
          ) : (
            <TableSelector
              schema={schema}
              selectedTable={selectedTable}
              onSelectTable={handleSelectTable}
              onRefreshTable={handleRefresh}
              onDropTable={handleDropTable}
            />
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {showFilters && selectedTable && (
            <ColumnFilter
              columns={columns}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          )}
          {showFilters && selectedTable && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <Button variant="primary" size="sm" onClick={applyFilters}>
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
                  onSort={handleSort}
                  sortColumn={sortColumn}
                  sortOrder={sortOrder}
                  onCellClick={handleCellClick}
                  onCellUpdate={handleCellUpdate}
                  onFilterByValue={handleFilterByValue}
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
      </div>

      <CellViewModal
        isOpen={cellModal.isOpen}
        onClose={() => setCellModal({ isOpen: false, data: null, column: null })}
        data={cellModal.data}
        column={cellModal.column}
      />
    </motion.div>
  );
}

export default DataExplorerPage;
