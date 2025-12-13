/**
 * SQL functions for autocomplete
 */

export const SQL_FUNCTIONS = [
  // Aggregate functions
  { name: 'COUNT', snippet: 'COUNT(${1:column})', detail: 'Count rows', doc: 'Returns the number of rows' },
  { name: 'SUM', snippet: 'SUM(${1:column})', detail: 'Sum values', doc: 'Returns the sum of values' },
  { name: 'AVG', snippet: 'AVG(${1:column})', detail: 'Average value', doc: 'Returns the average value' },
  { name: 'MIN', snippet: 'MIN(${1:column})', detail: 'Minimum value', doc: 'Returns the minimum value' },
  { name: 'MAX', snippet: 'MAX(${1:column})', detail: 'Maximum value', doc: 'Returns the maximum value' },
  
  // String functions
  { name: 'CONCAT', snippet: 'CONCAT(${1:str1}, ${2:str2})', detail: 'Concatenate strings', doc: 'Concatenates two or more strings' },
  { name: 'UPPER', snippet: 'UPPER(${1:string})', detail: 'Convert to uppercase', doc: 'Converts string to uppercase' },
  { name: 'LOWER', snippet: 'LOWER(${1:string})', detail: 'Convert to lowercase', doc: 'Converts string to lowercase' },
  { name: 'TRIM', snippet: 'TRIM(${1:string})', detail: 'Remove whitespace', doc: 'Removes leading and trailing whitespace' },
  { name: 'LENGTH', snippet: 'LENGTH(${1:string})', detail: 'String length', doc: 'Returns the length of a string' },
  { name: 'SUBSTRING', snippet: 'SUBSTRING(${1:string}, ${2:start}, ${3:length})', detail: 'Extract substring', doc: 'Extracts a substring from a string' },
  { name: 'REPLACE', snippet: 'REPLACE(${1:string}, ${2:from}, ${3:to})', detail: 'Replace text', doc: 'Replaces occurrences of a substring' },
  
  // Date/Time functions
  { name: 'NOW', snippet: 'NOW()', detail: 'Current timestamp', doc: 'Returns the current date and time' },
  { name: 'CURRENT_DATE', snippet: 'CURRENT_DATE', detail: 'Current date', doc: 'Returns the current date' },
  { name: 'CURRENT_TIME', snippet: 'CURRENT_TIME', detail: 'Current time', doc: 'Returns the current time' },
  { name: 'DATE_TRUNC', snippet: 'DATE_TRUNC(${1:\'day\'}, ${2:timestamp})', detail: 'Truncate date', doc: 'Truncates timestamp to specified precision' },
  { name: 'EXTRACT', snippet: 'EXTRACT(${1:YEAR} FROM ${2:date})', detail: 'Extract date part', doc: 'Extracts a field from a date/time value' },
  
  // Conditional functions
  { name: 'COALESCE', snippet: 'COALESCE(${1:value1}, ${2:value2})', detail: 'Return first non-null', doc: 'Returns the first non-null value' },
  { name: 'NULLIF', snippet: 'NULLIF(${1:value1}, ${2:value2})', detail: 'Return null if equal', doc: 'Returns null if values are equal' },
  { name: 'CASE', snippet: 'CASE WHEN ${1:condition} THEN ${2:result} ELSE ${3:default} END', detail: 'Conditional expression', doc: 'Returns value based on conditions' },
  
  // Math functions
  { name: 'ROUND', snippet: 'ROUND(${1:number}, ${2:decimals})', detail: 'Round number', doc: 'Rounds a number to specified decimals' },
  { name: 'CEIL', snippet: 'CEIL(${1:number})', detail: 'Round up', doc: 'Rounds up to nearest integer' },
  { name: 'FLOOR', snippet: 'FLOOR(${1:number})', detail: 'Round down', doc: 'Rounds down to nearest integer' },
  { name: 'ABS', snippet: 'ABS(${1:number})', detail: 'Absolute value', doc: 'Returns absolute value' },
  
  // Type conversion
  { name: 'CAST', snippet: 'CAST(${1:value} AS ${2:type})', detail: 'Convert type', doc: 'Converts value to specified type' },
  { name: 'TO_CHAR', snippet: 'TO_CHAR(${1:value}, ${2:format})', detail: 'Convert to string', doc: 'Converts value to string with format' },
  { name: 'TO_DATE', snippet: 'TO_DATE(${1:string}, ${2:format})', detail: 'Convert to date', doc: 'Converts string to date' },
  { name: 'TO_NUMBER', snippet: 'TO_NUMBER(${1:string})', detail: 'Convert to number', doc: 'Converts string to number' },
];

export function getSQLFunctionCompletions(monaco) {
  return SQL_FUNCTIONS.map(func => ({
    label: func.name,
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: func.snippet,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: func.detail,
    documentation: func.doc,
    sortText: `3_${func.name}`,
  }));
}
