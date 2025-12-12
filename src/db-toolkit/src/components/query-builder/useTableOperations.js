/**
 * Custom hook for managing table operations in query builder
 */
import { useCallback } from 'react';

export function useTableOperations(nodes, setNodes, setEdges, setSelectedColumns) {
    // Toggle column selection
    const handleColumnToggle = useCallback((tableName, column) => {
        const columnName = column.name || column.column_name;
        if (!columnName) return;

        const colId = `${tableName}.${columnName}`;
        setSelectedColumns(prev => {
            const exists = prev.find(c => `${c.table}.${c.name}` === colId);
            if (exists) {
                return prev.filter(c => `${c.table}.${c.name}` !== colId);
            } else {
                return [...prev, {
                    table: tableName,
                    name: columnName,
                    type: column.data_type || column.type,
                    aggregate: null,
                    alias: null
                }];
            }
        });
    }, [setSelectedColumns]);

    // Remove table from canvas
    const handleRemoveTable = useCallback((tableName) => {
        setNodes(nds => nds.filter(n => n.data.tableName !== tableName));
        setEdges(eds => eds.filter(e => {
            const sourceNode = nodes.find(n => n.id === e.source);
            const targetNode = nodes.find(n => n.id === e.target);
            return sourceNode?.data.tableName !== tableName && targetNode?.data.tableName !== tableName;
        }));
        setSelectedColumns(cols => cols.filter(c => c.table !== tableName));
    }, [setNodes, setEdges, nodes, setSelectedColumns]);

    // Add table to canvas with smart positioning
    const handleAddTable = useCallback((table, handleColumnToggle, handleRemoveTable) => {
        const gridSize = 350;
        const rowHeight = 250;
        const startX = 100;
        const startY = 100;
        const maxColumns = 3;

        const existingPositions = nodes.map(n => n.position);
        let x = startX;
        let y = startY;

        let positionFound = false;
        for (let row = 0; row < 10 && !positionFound; row++) {
            for (let col = 0; col < maxColumns && !positionFound; col++) {
                x = startX + (col * gridSize);
                y = startY + (row * rowHeight);

                const isOccupied = existingPositions.some(p =>
                    Math.abs(p.x - x) < 200 && Math.abs(p.y - y) < 150
                );

                if (!isOccupied) {
                    positionFound = true;
                }
            }
        }

        const newNode = {
            id: table.name,
            type: 'queryTable',
            position: { x, y },
            data: {
                tableName: table.name,
                columns: table.columns,
                onColumnToggle: handleColumnToggle,
                onRemove: handleRemoveTable
            }
        };
        setNodes(nds => [...nds, newNode]);
    }, [nodes, setNodes]);

    return {
        handleColumnToggle,
        handleRemoveTable,
        handleAddTable
    };
}
