/**
 * Custom hook for managing query builder state
 */
import { useState, useMemo } from 'react';

export function useQueryBuilderState(nodes, edges, selectedColumns, filters) {
    const [groupBy, setGroupBy] = useState([]);
    const [orderBy, setOrderBy] = useState([]);
    const [limit, setLimit] = useState(null);
    const [offset, setOffset] = useState(null);

    const queryState = useMemo(() => {
        const tables = nodes.map(node => ({ name: node.data.tableName }));
        const joins = edges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            return {
                type: edge.data?.joinType || 'INNER JOIN',
                sourceTable: sourceNode?.data.tableName,
                targetTable: targetNode?.data.tableName,
                sourceColumn: edge.data?.sourceColumn || 'id',
                targetColumn: edge.data?.targetColumn || 'id'
            };
        });

        return {
            tables,
            joins,
            columns: selectedColumns,
            filters,
            groupBy,
            orderBy,
            limit,
            offset
        };
    }, [nodes, edges, selectedColumns, filters, groupBy, orderBy, limit, offset]);

    return {
        groupBy,
        setGroupBy,
        orderBy,
        setOrderBy,
        limit,
        setLimit,
        offset,
        setOffset,
        queryState
    };
}
