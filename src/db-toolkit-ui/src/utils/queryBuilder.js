/**
 * Query builder utilities for generating SQL from visual components
 */

/**
 * Generate SQL SELECT statement from query state
 */
export function generateSQL(queryState) {
  const { tables, joins, columns, filters, groupBy, orderBy, limit } = queryState;

  if (!tables.length || !columns.length) {
    return '';
  }

  let sql = 'SELECT ';

  // Columns
  sql += columns.map(col => {
    let colStr = `${col.table}.${col.name}`;
    if (col.aggregate) {
      colStr = `${col.aggregate}(${colStr})`;
    }
    if (col.alias) {
      colStr += ` AS ${col.alias}`;
    }
    return colStr;
  }).join(', ');

  // FROM
  sql += `\nFROM ${tables[0].name}`;

  // JOINs
  joins.forEach(join => {
    sql += `\n${join.type} ${join.targetTable} ON ${join.sourceTable}.${join.sourceColumn} = ${join.targetTable}.${join.targetColumn}`;
  });

  // WHERE
  if (filters.length > 0) {
    sql += '\nWHERE ';
    sql += filters.map((filter, idx) => {
      let condition = `${filter.table}.${filter.column} ${filter.operator} `;
      if (filter.operator === 'IN') {
        condition += `(${filter.value})`;
      } else if (filter.operator === 'BETWEEN') {
        condition += `${filter.value[0]} AND ${filter.value[1]}`;
      } else if (filter.operator === 'IS NULL' || filter.operator === 'IS NOT NULL') {
        condition = `${filter.table}.${filter.column} ${filter.operator}`;
      } else {
        condition += typeof filter.value === 'string' ? `'${filter.value}'` : filter.value;
      }
      
      if (idx < filters.length - 1) {
        condition += ` ${filter.logic || 'AND'} `;
      }
      return condition;
    }).join('');
  }

  // GROUP BY
  if (groupBy.length > 0) {
    sql += '\nGROUP BY ' + groupBy.map(col => `${col.table}.${col.name}`).join(', ');
  }

  // ORDER BY
  if (orderBy.length > 0) {
    sql += '\nORDER BY ' + orderBy.map(col => `${col.table}.${col.name} ${col.direction}`).join(', ');
  }

  // LIMIT
  if (limit) {
    sql += `\nLIMIT ${limit}`;
  }

  return sql;
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
