/**
 * Custom hook for managing column and filter operations
 */
import { useCallback } from 'react';

export function useColumnFilterOperations(setSelectedColumns, setFilters) {
    // Update column
    const handleUpdateColumn = useCallback((idx, updates) => {
        setSelectedColumns(prev => prev.map((col, i) =>
            i === idx ? { ...col, ...updates } : col
        ));
    }, [setSelectedColumns]);

    // Remove column
    const handleRemoveColumn = useCallback((idx) => {
        setSelectedColumns(prev => prev.filter((_, i) => i !== idx));
    }, [setSelectedColumns]);

    // Reorder column
    const handleReorderColumn = useCallback((fromIdx, toIdx) => {
        setSelectedColumns(prev => {
            const newCols = [...prev];
            const [removed] = newCols.splice(fromIdx, 1);
            newCols.splice(toIdx, 0, removed);
            return newCols;
        });
    }, [setSelectedColumns]);

    // Add filter
    const handleAddFilter = useCallback((filter) => {
        setFilters(prev => [...prev, { ...filter, id: Date.now() }]);
    }, [setFilters]);

    // Update filter
    const handleUpdateFilter = useCallback((id, updates) => {
        setFilters(prev => prev.map(f =>
            f.id === id ? { ...f, ...updates } : f
        ));
    }, [setFilters]);

    // Remove filter
    const handleRemoveFilter = useCallback((id) => {
        setFilters(prev => prev.filter(f => f.id !== id));
    }, [setFilters]);

    return {
        handleUpdateColumn,
        handleRemoveColumn,
        handleReorderColumn,
        handleAddFilter,
        handleUpdateFilter,
        handleRemoveFilter
    };
}
