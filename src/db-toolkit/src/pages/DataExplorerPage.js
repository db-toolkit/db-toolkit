/**
 * Data Explorer page for browsing table data
 */
import { useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataExplorerNoConnections as DataExplorerEmpty } from '../components/data-explorer/DataExplorerEmpty';
import { ConnectionSelector } from '../components/data-explorer/ConnectionSelector';
import { DataExplorerHeader } from '../components/data-explorer/DataExplorerHeader';
import { DataExplorerSidebar } from '../components/data-explorer/DataExplorerSidebar';
import { DataExplorerContent } from '../components/data-explorer/DataExplorerContent';
import { DataExplorerModals } from '../components/data-explorer/DataExplorerModals';
import { useDataExplorer } from '../hooks/data-explorer/useDataExplorer';

function DataExplorerPage() {
  const navigate = useNavigate();
  const [showAddRowModal, setShowAddRowModal] = useState(false);
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
    columnMetadata,
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
    handleAddRow,
    handleDeleteRow,
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
      items.push({ label: 'Connections', href: '/connections' });
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
    <div className="h-screen flex flex-col animate-page-transition">
      <DataExplorerHeader
        breadcrumbItems={breadcrumbItems}
        selectedTable={selectedTable}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        showFilters={showFilters}
        onChangeConnection={() => setConnectionId(null)}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onExportCSV={exportToCSV}
        onExportJSON={exportToJSON}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onRefresh={handleRefresh}
        onAddRow={() => setShowAddRowModal(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <DataExplorerSidebar
          schemaLoading={schemaLoading}
          schema={schema}
          selectedTable={selectedTable}
          onSelectTable={handleSelectTable}
          onRefreshTable={handleRefresh}
          onDropTable={handleDropTable}
        />

        <DataExplorerContent
          showFilters={showFilters}
          selectedTable={selectedTable}
          columns={columns}
          filters={filters}
          loading={loading}
          data={data}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          onApplyFilters={applyFilters}
          onSort={handleSort}
          onCellClick={handleCellClick}
          onCellUpdate={handleCellUpdate}
          onFilterByValue={handleFilterByValue}
          onDeleteRow={handleDeleteRow}
        />
      </div>

      <DataExplorerModals
        cellModal={cellModal}
        showAddRowModal={showAddRowModal}
        columnMetadata={columnMetadata}
        selectedTable={selectedTable}
        onCloseCellModal={() => setCellModal({ isOpen: false, data: null, column: null })}
        onCloseAddRowModal={() => setShowAddRowModal(false)}
        onAddRow={handleAddRow}
      />
    </div>
  );
}

export default DataExplorerPage;
