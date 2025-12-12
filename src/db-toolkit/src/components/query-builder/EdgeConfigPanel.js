/**
 * Edge configuration panel for configuring join properties
 */
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { getJoinTypes } from '../../utils/queryBuilder';

export function EdgeConfigPanel({ edge, tables, onUpdate, onClose }) {
    if (!edge) return null;

    const joinTypes = getJoinTypes();

    // Find source and target tables
    const sourceTable = tables.find(t => t.id === edge.source);
    const targetTable = tables.find(t => t.id === edge.target);

    if (!sourceTable || !targetTable) return null;

    const sourceColumns = sourceTable.data?.columns || [];
    const targetColumns = targetTable.data?.columns || [];

    const currentJoinType = edge.data?.joinType || 'INNER JOIN';
    const currentSourceColumn = edge.data?.sourceColumn || 'id';
    const currentTargetColumn = edge.data?.targetColumn || 'id';

    const handleUpdate = (updates) => {
        onUpdate({
            ...edge.data,
            ...updates
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Configure Join
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Join Info */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {sourceTable.data.tableName} → {targetTable.data.tableName}
                    </div>
                </div>

                {/* Join Type */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Join Type
                    </label>
                    <select
                        value={currentJoinType}
                        onChange={(e) => handleUpdate({ joinType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        {joinTypes.map(jt => (
                            <option key={jt.value} value={jt.value}>
                                {jt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Source Column */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {sourceTable.data.tableName} Column
                    </label>
                    <select
                        value={currentSourceColumn}
                        onChange={(e) => handleUpdate({ sourceColumn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        {sourceColumns.map(col => {
                            const colName = col.name || col.column_name;
                            return (
                                <option key={colName} value={colName}>
                                    {colName} ({col.data_type || col.type})
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Target Column */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {targetTable.data.tableName} Column
                    </label>
                    <select
                        value={currentTargetColumn}
                        onChange={(e) => handleUpdate({ targetColumn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        {targetColumns.map(col => {
                            const colName = col.name || col.column_name;
                            return (
                                <option key={colName} value={colName}>
                                    {colName} ({col.data_type || col.type})
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Preview */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="text-xs font-mono text-blue-800 dark:text-blue-300">
                        {currentJoinType} {targetTable.data.tableName}<br />
                        ON {sourceTable.data.tableName}.{currentSourceColumn} = {targetTable.data.tableName}.{currentTargetColumn}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onClose}>
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    );
}
