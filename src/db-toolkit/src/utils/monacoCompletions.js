/**
 * Monaco Editor SQL completion provider utilities
 */

/**
 * Parse schema data into completion items
 */
export function parseSchemaToCompletions(schema, monaco) {
  const suggestions = [];

  if (!schema?.schemas) return suggestions;

  // Iterate over schemas (e.g., public, information_schema)
  Object.entries(schema.schemas).forEach(([schemaName, schemaData]) => {
    if (!schemaData.tables) return;

    // Iterate over tables in the schema
    Object.entries(schemaData.tables).forEach(([tableName, tableData]) => {
      // Add table suggestion
      suggestions.push({
        label: tableName,
        kind: monaco.languages.CompletionItemKind.Class,
        insertText: tableName,
        detail: `Table in ${schemaName}`,
        documentation: `${tableData.column_count || 0} columns`,
        sortText: `1_${tableName}`, // Tables first
      });

      // Add column suggestions
      tableData.columns?.forEach(column => {
        suggestions.push({
          label: `${tableName}.${column.column_name}`,
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: `${tableName}.${column.column_name}`,
          detail: `${column.data_type}`,
          documentation: `Column in ${tableName}`,
          sortText: `2_${tableName}_${column.column_name}`, // Columns second
        });

        // Add column name only (for use after table is specified)
        suggestions.push({
          label: column.column_name,
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: column.column_name,
          detail: `${column.data_type} - ${tableName}`,
          documentation: column.is_nullable === 'YES' ? 'Nullable' : 'Not null',
          sortText: `3_${column.column_name}`, // Column names third
        });
      });
    });
  });

  return suggestions;
}

/**
 * Get SQL keywords for completion
 */
export function getSQLKeywords(monaco) {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO',
    'UPDATE', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
    'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT', 'AS', 'ON', 'USING'
  ];

  return keywords.map(keyword => ({
    label: keyword,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: keyword,
    detail: 'SQL Keyword',
    sortText: `0_${keyword}`, // Keywords first
  }));
}

/**
 * Detect SQL context from text before cursor
 */
export function detectSQLContext(textBeforeCursor) {
  const text = textBeforeCursor.trim().toUpperCase();

  if (/FROM\s+$/i.test(textBeforeCursor)) {
    return 'table';
  }

  if (/JOIN\s+$/i.test(textBeforeCursor)) {
    return 'table';
  }

  if (/SELECT\s+$/i.test(textBeforeCursor)) {
    return 'column';
  }

  if (/WHERE\s+\w*$/i.test(textBeforeCursor)) {
    return 'column';
  }

  if (/SET\s+$/i.test(textBeforeCursor)) {
    return 'column';
  }

  return 'all';
}

/**
 * Filter suggestions based on context
 */
export function filterByContext(suggestions, context, monaco) {
  if (context === 'all') return suggestions;

  if (context === 'table') {
    return suggestions.filter(s =>
      s.kind === monaco.languages.CompletionItemKind.Class
    );
  }

  if (context === 'column') {
    return suggestions.filter(s =>
      s.kind === monaco.languages.CompletionItemKind.Field
    );
  }

  return suggestions;
}

/**
 * Create Monaco completion provider
 */
export function createSQLCompletionProvider(getSchema, monaco) {
  let cachedSuggestions = [];
  let cachedKeywords = getSQLKeywords(monaco);

  return {
    triggerCharacters: ['.', ' '],

    provideCompletionItems: async (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      // Get text before cursor for context detection
      const textBeforeCursor = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });

      // Fetch schema if not cached
      if (cachedSuggestions.length === 0) {
        try {
          const schema = await getSchema();
          cachedSuggestions = parseSchemaToCompletions(schema, monaco);
        } catch (error) {
          console.error('Failed to fetch schema for autocomplete:', error);
        }
      }

      // Detect context
      const context = detectSQLContext(textBeforeCursor);

      // Filter suggestions by context
      const filteredSuggestions = filterByContext(cachedSuggestions, context, monaco);

      // Combine keywords and schema suggestions
      const allSuggestions = [...cachedKeywords, ...filteredSuggestions].map(s => ({
        ...s,
        range
      }));

      return { suggestions: allSuggestions };
    }
  };
}

/**
 * Clear cached suggestions (call when schema changes)
 */
export function clearCompletionCache(provider) {
  if (provider && provider.cachedSuggestions) {
    provider.cachedSuggestions = [];
  }
}
