/**
 * Right sidebar component for query configuration
 */
import { ColumnSelector } from './ColumnSelector';
import { FilterBuilder } from './FilterBuilder';
import { GroupByBuilder } from './GroupByBuilder';
import { OrderByBuilder } from './OrderByBuilder';
import { LimitBuilder } from './LimitBuilder';

export function QueryConfigSidebar({
    selectedColumns,
    filters,
    groupBy,
    orderBy,
    limit,
    offset,
    nodes,
    onUpdateColumn,
    onRemoveColumn,
    onReorderColumn,
    onAddFilter,
    onUpdateFilter,
    onRemoveFilter,
    onUpdateGroupBy,
    onUpdateOrderBy,
    onUpdateLimit
}) {
    return (
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto p-4 space-y-6">
            <ColumnSelector
                columns={selectedColumns}
                onUpdateColumn={onUpdateColumn}
                onRemoveColumn={onRemoveColumn}
                onReorder={onReorderColumn}
            />

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <FilterBuilder
                    filters={filters}
                    tables={nodes.map(n => ({ name: n.data.tableName, columns: n.data.columns }))}
                    onAddFilter={onAddFilter}
                    onUpdateFilter={onUpdateFilter}
                    onRemoveFilter={onRemoveFilter}
                />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <GroupByBuilder
                    columns={selectedColumns}
                    groupBy={groupBy}
                    onUpdate={onUpdateGroupBy}
                />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <OrderByBuilder
                    columns={selectedColumns}
                    orderBy={orderBy}
                    onUpdate={onUpdateOrderBy}
                />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <LimitBuilder
                    limit={limit}
                    offset={offset}
                    onUpdate={onUpdateLimit}
                />
            </div>
        </div>
    );
}
