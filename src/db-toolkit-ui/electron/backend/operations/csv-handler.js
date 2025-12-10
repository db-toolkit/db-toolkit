/**
 * CSV/JSON export operations.
 */

const { connectionManager } = require('../utils/connection-manager');

class CSVHandler {
  static async exportToCSV(connector, table, schema = null, query = null, delimiter = ',', includeHeaders = true) {
    let result;
    
    if (query) {
      result = await connector.executeQuery(query);
    } else {
      const fullTable = schema ? `${schema}."${table}"` : `"${table}"`;
      if (connector.constructor.name === 'MongoDBConnector') {
        result = await connector.executeQuery('{}');
      } else {
        result = await connector.executeQuery(`SELECT * FROM ${fullTable}`);
      }
    }

    const rows = result.data || [];
    const columns = result.columns || [];

    if (!rows.length || !columns.length) {
      return '';
    }

    let csvContent = '';
    
    if (includeHeaders) {
      csvContent += columns.join(delimiter) + '\n';
    }

    for (const row of rows) {
      const line = row.map(cell => {
        const str = String(cell ?? '');
        return str.includes(delimiter) || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(delimiter);
      csvContent += line + '\n';
    }

    return csvContent;
  }

  static async exportToJSON(connector, table, schema = null, query = null) {
    let result;
    
    if (query) {
      result = await connector.executeQuery(query);
    } else {
      const fullTable = schema ? `${schema}."${table}"` : `"${table}"`;
      if (connector.constructor.name === 'MongoDBConnector') {
        result = await connector.executeQuery('{}');
      } else {
        result = await connector.executeQuery(`SELECT * FROM ${fullTable}`);
      }
    }

    const rows = result.data || [];
    const columns = result.columns || [];

    if (!rows.length || !columns.length) {
      return '[]';
    }

    const jsonData = rows.map(row => {
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      return obj;
    });

    return JSON.stringify(jsonData, null, 2);
  }
}

module.exports = { CSVHandler };
