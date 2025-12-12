/**
 * Query builder utilities for generating SQL from visual components
 */

/**
 * Escape SQL identifiers (table and column names) to prevent injection
 * @param {string} identifier - Table or column name
 * @returns {string} Escaped identifier
 */
function escapeIdentifier(identifier) {
  // Remove any existing quotes and escape special characters
  return identifier.replace(/[^\w]/g, '');
}

/**
 * Generate SQL SELECT statement from query state with parameterized values
 * @param {Object} queryState - Query configuration
 * @returns {Object} Object with sql string and params array
 */
export function generateSQL(queryState) {
  const { tables, joins, columns, filters, groupBy, orderBy, limit, offset } = queryState;

  if (!tables.length || !columns.length) {
    return { sql: '', params: [] };
  }

  const params = [];
  let paramIndex = 1;
  let sql = 'SELECT ';

  // Columns
  sql += columns.map(col => {
    const table = escapeIdentifier(col.table);
    const name = escapeIdentifier(col.name);
    let colStr = `${table}.${name}`;

    if (col.aggregate) {
      const aggregate = escapeIdentifier(col.aggregate);
      colStr = `${aggregate}(${colStr})`;
    }
    if (col.alias) {
      const alias = escapeIdentifier(col.alias);
      colStr += ` AS ${alias}`;
    }
    return colStr;
  }).join(', ');

  // FROM
  sql += `\nFROM ${escapeIdentifier(tables[0].name)}`;

  // JOINs
  joins.forEach(join => {
    const joinType = join.type || 'INNER JOIN';
    const sourceTable = escapeIdentifier(join.sourceTable);
    const targetTable = escapeIdentifier(join.targetTable);
    const sourceColumn = escapeIdentifier(join.sourceColumn);
    const targetColumn = escapeIdentifier(join.targetColumn);

    sql += `\n${joinType} ${targetTable} ON ${sourceTable}.${sourceColumn} = ${targetTable}.${targetColumn}`;
  });

  // WHERE
  if (filters.length > 0) {
    sql += '\nWHERE ';
    sql += filters.map((filter, idx) => {
      const table = escapeIdentifier(filter.table);
      const column = escapeIdentifier(filter.column);
      let condition = `${table}.${column} ${filter.operator} `;

      if (filter.operator === 'IN') {
        // Handle IN operator with multiple values
        const values = Array.isArray(filter.value) ? filter.value : filter.value.split(',').map(v => v.trim());
        const placeholders = values.map(() => {
          params.push(values[paramIndex - 1]);
          return `$${paramIndex++}`;
        }).join(', ');
        condition += `(${placeholders})`;
      } else if (filter.operator === 'BETWEEN') {
        // Handle BETWEEN operator
        const values = Array.isArray(filter.value) ? filter.value : [filter.value[0], filter.value[1]];
        params.push(values[0]);
        const placeholder1 = `$${paramIndex++}`;
        params.push(values[1]);
        const placeholder2 = `$${paramIndex++}`;
        condition += `${placeholder1} AND ${placeholder2}`;
      } else if (filter.operator === 'IS NULL' || filter.operator === 'IS NOT NULL') {
        // No value needed for NULL checks
        condition = `${table}.${column} ${filter.operator}`;
      } else if (filter.operator === 'LIKE') {
        // Handle LIKE operator
        params.push(filter.value);
        condition += `$${paramIndex++}`;
      } else {
        // Standard operators (=, !=, >, <, >=, <=)
        params.push(filter.value);
        condition += `$${paramIndex++}`;
      }

      if (idx < filters.length - 1) {
        condition += ` ${filter.logic || 'AND'} `;
      }
      return condition;
    }).join('');
  }

  // GROUP BY
  if (groupBy && groupBy.length > 0) {
    sql += '\nGROUP BY ' + groupBy.map(col => {
      const table = escapeIdentifier(col.table);
      const name = escapeIdentifier(col.name);
      return `${table}.${name}`;
    }).join(', ');
  }

  // ORDER BY
  if (orderBy && orderBy.length > 0) {
    sql += '\nORDER BY ' + orderBy.map(col => {
      const table = escapeIdentifier(col.table);
      const name = escapeIdentifier(col.name);
      const direction = col.direction === 'DESC' ? 'DESC' : 'ASC';
      return `${table}.${name} ${direction}`;
    }).join(', ');
  }

  // LIMIT
  if (limit) {
    params.push(parseInt(limit));
    sql += `\nLIMIT $${paramIndex++}`;
  }

  // OFFSET
  if (offset) {
    params.push(parseInt(offset));
    sql += `\nOFFSET $${paramIndex++}`;
  }

  return { sql, params };
}

/**
 * Parse SQL to visual query state (basic implementation)
 */
export function parseSQL(sql) {
  // Basic parser - can be enhanced
  const queryState = {
    tables: [],
    joins: [],
    columns: [],
    filters: [],
    groupBy: [],
    orderBy: [],
    limit: null
  };

  // Extract tables from FROM and JOIN
  const fromMatch = sql.match(/FROM\s+(\w+)/i);
  if (fromMatch) {
    queryState.tables.push({ name: fromMatch[1] });
  }

  // Extract columns from SELECT
  const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM/is);
  if (selectMatch) {
    const colStr = selectMatch[1];
    colStr.split(',').forEach(col => {
      const trimmed = col.trim();
      const parts = trimmed.split('.');
      if (parts.length === 2) {
        queryState.columns.push({
          table: parts[0],
          name: parts[1].split(' ')[0],
          alias: null,
          aggregate: null
        });
      }
    });
  }

  return queryState;
}

/**
 * Validate query state
 */
export function validateQuery(queryState) {
  const errors = [];

  if (!queryState.tables.length) {
    errors.push('At least one table is required');
  }

  if (!queryState.columns.length) {
    errors.push('At least one column must be selected');
  }

  // Check for orphaned joins
  queryState.joins.forEach(join => {
    const hasSource = queryState.tables.some(t => t.name === join.sourceTable);
    const hasTarget = queryState.tables.some(t => t.name === join.targetTable);
    if (!hasSource || !hasTarget) {
      errors.push(`Invalid join: ${join.sourceTable} -> ${join.targetTable}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Get available operators for column type
 */
export function getOperatorsForType(dataType) {
  const numericOps = ['=', '!=', '>', '<', '>=', '<=', 'BETWEEN', 'IN', 'IS NULL', 'IS NOT NULL'];
  const stringOps = ['=', '!=', 'LIKE', 'IN', 'IS NULL', 'IS NOT NULL'];
  const booleanOps = ['=', '!=', 'IS NULL', 'IS NOT NULL'];

  const type = dataType?.toLowerCase() || '';

  if (type.includes('int') || type.includes('float') || type.includes('decimal') || type.includes('numeric')) {
    return numericOps;
  }
  if (type.includes('char') || type.includes('text') || type.includes('varchar')) {
    return stringOps;
  }
  if (type.includes('bool')) {
    return booleanOps;
  }

  return ['=', '!=', 'IS NULL', 'IS NOT NULL'];
}

/**
 * Get aggregate functions
 */
export function getAggregateFunctions() {
  return ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];
}

/**
 * Get join types
 */
export function getJoinTypes() {
  return [
    { value: 'INNER JOIN', label: 'Inner Join' },
    { value: 'LEFT JOIN', label: 'Left Join' },
    { value: 'RIGHT JOIN', label: 'Right Join' },
    { value: 'FULL OUTER JOIN', label: 'Full Outer Join' }
  ];
}
