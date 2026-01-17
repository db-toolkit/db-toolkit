import { useMemo } from 'react';

export function useSchemaContext(schemaContext, schemaScope, currentQuery) {
  const extractTableFromQuery = (query) => {
    if (!query) return null;
    const match = query.match(/FROM\s+(?:([\w"]+)\.)?([\w"]+)/i);
    if (match) {
      const table = match[2]?.replace(/"/g, '');
      return table || null;
    }
    return null;
  };

  const buildSchemaContext = useMemo(() => {
    const normalizeColumns = (cols = []) =>
      (cols || []).map(col => ({
        name: col.name || col.column_name,
        type: col.type || col.data_type,
      }));

    const tableMap = {};
    const targetTable = extractTableFromQuery(currentQuery);

    if (!schemaContext) return { tables: tableMap };

    const addTable = (tableName, tableDef = {}) => {
      if (!tableName || tableMap[tableName]) return;
      tableMap[tableName] = {
        columns: normalizeColumns(tableDef.columns || []),
        sample_data: tableDef.sample_data || [],
      };
    };

    if (schemaContext.schemas) {
      const schemas = Object.values(schemaContext.schemas);
      const selectedSchema = () => {
        if (schemaScope === 'schema' && targetTable) {
          return schemas.find(s => s.tables && s.tables[targetTable]) || schemas[0];
        }
        return schemas[0];
      };

      schemas.forEach(s => {
        Object.entries(s.tables || {}).forEach(([tableName, tableDef]) => {
          if (schemaScope === 'table' && targetTable) {
            if (tableName === targetTable) addTable(tableName, tableDef);
          } else if (schemaScope === 'schema') {
            if (selectedSchema() === s) addTable(tableName, tableDef);
          } else {
            addTable(tableName, tableDef);
          }
        });
      });
    } else if (schemaContext.tables) {
      Object.entries(schemaContext.tables || {}).forEach(([tableName, tableDef]) => {
        if (schemaScope === 'table' && targetTable) {
          if (tableName === targetTable) addTable(tableName, tableDef);
        } else {
          addTable(tableName, tableDef);
        }
      });
    } else {
      Object.entries(schemaContext || {}).forEach(([tableName, tableDef]) => {
        addTable(tableName, tableDef);
      });
    }

    return { tables: tableMap };
  }, [schemaContext, schemaScope, currentQuery]);

  return buildSchemaContext;
}
