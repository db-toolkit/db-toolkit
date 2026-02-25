/**
 * Auto-fill timestamp fields with appropriate values
 */

/**
 * Check if a column is a timestamp type
 */
function isTimestampColumn(dataType) {
  if (!dataType) return false;
  const type = dataType.toLowerCase();
  return type.includes('timestamp') || 
         type.includes('datetime') || 
         type.includes('date');
}

/**
 * Check if a column is a bigint used for timestamps (Unix epoch)
 */
function isBigIntTimestamp(column) {
  if (!column.data_type) return false;
  const type = column.data_type.toLowerCase();
  const name = column.column_name?.toLowerCase() || '';
  
  // Check if it's bigint and has timestamp-like name
  return type === 'bigint' && (
    name.includes('time') ||
    name.includes('date') ||
    name.includes('created') ||
    name.includes('updated') ||
    name.includes('modified')
  );
}

/**
 * Check if a column is NOT NULL
 */
function isNotNull(column) {
  return column.is_nullable === 'NO' || 
         column.is_nullable === false || 
         column.nullable === false;
}

/**
 * Auto-fill empty timestamp fields with current time
 * @param {Object} formData - The form data object
 * @param {Array} columns - Array of column metadata
 * @returns {Object} - Processed form data with auto-filled timestamps
 */
export function autoFillTimestamps(formData, columns) {
  const processedData = { ...formData };
  
  columns.forEach(column => {
    const columnName = column.column_name;
    const isEmpty = !processedData[columnName] || processedData[columnName] === '';
    
    // Skip if field has a value
    if (!isEmpty) return;
    
    // Skip if field is nullable (NULL is acceptable)
    if (!isNotNull(column)) return;
    
    // Handle bigint timestamps (Unix epoch in milliseconds)
    if (isBigIntTimestamp(column)) {
      processedData[columnName] = Date.now().toString();
      return;
    }
    
    // Handle regular timestamp/datetime fields
    if (isTimestampColumn(column.data_type)) {
      processedData[columnName] = new Date().toISOString();
      return;
    }
  });
  
  return processedData;
}

/**
 * Get hint text for timestamp fields
 * @param {Object} column - Column metadata
 * @returns {string|null} - Hint text or null
 */
export function getTimestampHint(column) {
  const isBigInt = isBigIntTimestamp(column);
  const isTimestamp = isTimestampColumn(column.data_type);
  
  if (!isBigInt && !isTimestamp) return null;
  
  const notNull = isNotNull(column);
  
  if (notNull) {
    return 'Leave empty for current time';
  } else {
    return 'Optional - leave empty for NULL';
  }
}
