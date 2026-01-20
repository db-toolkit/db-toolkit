/**
 * Custom hook for Data Explorer logic
 */
import { useState, useEffect, useCallback } from 'react';
import { useConnections, useSchema } from '../index';
import { useToast } from '../../contexts/ToastContext';
import { dropTable } from '../../utils/dropTable';
import api from '../../services/api';

export function useDataExplorer() {
  const { connections, connectToDatabase } = useConnections();
  const toast = useToast();
  const [connectionId, setConnectionId] = useState(null);
  const [connectionName, setConnectionName] = useState('');
  const [connecting, setConnecting] = useState(null);
  const { schema, loading: schemaLoading, error: schemaError, fetchSchemaTree } = useSchema(connectionId);
  const [selectedTable, setSelectedTable] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(100);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('ASC');
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [cellModal, setCellModal] = useState({ isOpen: false, data: null, column: null });

  const handleConnect = useCallback(async (id) => {
    setConnecting(id);
    try {
      await connectToDatabase(id, true);
      const conn = connections.find(c => c.id === id);
      setConnectionId(id);
      setConnectionName(conn?.name || '');
      toast.success('Connected successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to connect');
    } finally {
      setConnecting(null);
    }
  }, [connectToDatabase, connections, toast]);

  useEffect(() => {
    if (connectionId) {
      fetchSchemaTree().catch(err => {
        console.error('Schema fetch failed:', err);
        toast.error(`Failed to load schema: ${err.message}`);
      });
    }
  }, [connectionId, fetchSchemaTree, toast]);

  const loadTableData = useCallback(async (schema, table, offset = 0, sort = null, order = 'ASC', filterData = {}) => {
    setLoading(true);
    try {
      const response = await api.post(`/connections/${connectionId}/data/browse`, {
        schema_name: schema,
        table_name: table,
        limit: pageSize,
        offset,
        sort_column: sort,
        sort_order: order,
        filters: filterData,
      });

      if (response.data.success || response.data.data?.success) {
        const actualData = response.data.data || response.data;
        setData(actualData.rows || []);
        setColumns(actualData.columns || []);
      }

      const countResponse = await api.get(`/connections/${connectionId}/data/count`, {
        params: { schema_name: schema, table_name: table }
      });
      setTotalCount(countResponse.data.count);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [connectionId, pageSize, toast]);

  const handleSelectTable = useCallback((schema, table) => {
    setSelectedTable({ schema, table });
    setPage(0);
    setSortColumn(null);
    setSortOrder('ASC');
    setFilters({});
    loadTableData(schema, table, 0);
  }, [loadTableData]);

  const handleSort = useCallback((column, order) => {
    setSortColumn(column);
    setSortOrder(order);
    if (selectedTable) {
      loadTableData(selectedTable.schema, selectedTable.table, page * pageSize, column, order, filters);
    }
  }, [selectedTable, page, pageSize, filters, loadTableData]);

  const handleFilterChange = useCallback((column, value) => {
    const newFilters = { ...filters, [column]: value };
    setFilters(newFilters);
  }, [filters]);

  const applyFilters = useCallback(() => {
    setPage(0);
    if (selectedTable) {
      loadTableData(selectedTable.schema, selectedTable.table, 0, sortColumn, sortOrder, filters);
    }
  }, [selectedTable, sortColumn, sortOrder, filters, loadTableData]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(0);
    if (selectedTable) {
      loadTableData(selectedTable.schema, selectedTable.table, 0, sortColumn, sortOrder, {});
    }
  }, [selectedTable, sortColumn, sortOrder, loadTableData]);

  const handleCellClick = useCallback(async (row, column, colIndex) => {
    try {
      const rowId = { [columns[0]]: row[0] };
      const response = await api.post(`/connections/${connectionId}/data/cell`, {
        schema_name: selectedTable.schema,
        table_name: selectedTable.table,
        column_name: column,
        row_identifier: rowId,
      });
      
      if (response.data.success) {
        setCellModal({ isOpen: true, data: response.data.data, column });
      }
    } catch (err) {
      toast.error('Failed to load cell data');
    }
  }, [columns, connectionId, selectedTable, toast]);

  const handleCellUpdate = useCallback(async (row, column, newValue) => {
    try {
      const rowId = { [columns[0]]: row[0] };
      const payload = {
        table: selectedTable.table,
        schema_name: selectedTable.schema,
        primary_key: rowId,
        changes: { [column]: newValue },
      };
      const response = await api.put(`/connections/${connectionId}/data/row`, payload);
      
      toast.success('Cell updated successfully');
      loadTableData(selectedTable.schema, selectedTable.table, page * pageSize, sortColumn, sortOrder, filters);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update cell');
      throw err;
    }
  }, [columns, selectedTable, connectionId, toast, loadTableData, page, pageSize, sortColumn, sortOrder, filters]);

  const exportToCSV = useCallback(() => {
    if (!data || data.length === 0) return;
    
    const csv = [
      columns.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTable.table}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  }, [data, columns, selectedTable, toast]);

  const exportToJSON = useCallback(() => {
    if (!data || data.length === 0) return;
    
    const jsonData = data.map(row => {
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      return obj;
    });
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTable.table}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to JSON');
  }, [data, columns, selectedTable, toast]);

  const handleNextPage = useCallback(() => {
    const newPage = page + 1;
    setPage(newPage);
    if (selectedTable) {
      loadTableData(selectedTable.schema, selectedTable.table, newPage * pageSize, sortColumn, sortOrder, filters);
    }
  }, [page, selectedTable, pageSize, sortColumn, sortOrder, filters, loadTableData]);

  const handlePrevPage = useCallback(() => {
    const newPage = Math.max(0, page - 1);
    setPage(newPage);
    if (selectedTable) {
      loadTableData(selectedTable.schema, selectedTable.table, newPage * pageSize, sortColumn, sortOrder, filters);
    }
  }, [page, selectedTable, pageSize, sortColumn, sortOrder, filters, loadTableData]);

  const handleRefresh = useCallback(() => {
    if (selectedTable) {
      loadTableData(selectedTable.schema, selectedTable.table, page * pageSize, sortColumn, sortOrder, filters);
    }
  }, [selectedTable, page, pageSize, sortColumn, sortOrder, filters, loadTableData]);

  const handleDropTable = useCallback(async (schema, table) => {
    await dropTable(`${schema}.${table}`, connectionId, () => {
      fetchSchemaTree();
      if (selectedTable?.schema === schema && selectedTable?.table === table) {
        setSelectedTable(null);
        setData([]);
        setColumns([]);
      }
    }, toast);
  }, [connectionId, fetchSchemaTree, selectedTable, toast]);

  return {
    connections,
    connectionId,
    connectionName,
    connecting,
    schema,
    schemaLoading,
    schemaError,
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
  };
}
