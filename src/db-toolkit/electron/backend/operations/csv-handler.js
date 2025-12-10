/**
 * CSV/JSON export operations.
 */

const { connectionManager } = require('../utils/connection-manager');
const { logger } = require('../utils/logger.js');

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

  static validateCSVData(csvContent, columnMapping) {
    const errors = [];
    const rows = [];

    try {
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        errors.push('CSV must have at least a header row and one data row');
        return { rows, errors };
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const mappedRow = {};

        for (const [csvCol, dbCol] of Object.entries(columnMapping)) {
          const colIdx = headers.indexOf(csvCol);
          if (colIdx === -1) {
            errors.push(`Row ${i + 1}: Missing column '${csvCol}'`);
          } else {
            const value = values[colIdx]?.trim();
            mappedRow[dbCol] = value || null;
          }
        }

        if (Object.keys(mappedRow).length > 0) {
          rows.push(mappedRow);
        }
      }
    } catch (error) {
      logger.error('CSV validation error:', error);
      errors.push(`Validation error: ${error.message}`);
    }

    return { rows, errors };
  }

  static async importFromCSV(connector, table, rows, schema = null, batchSize = 100) {
    if (!rows || rows.length === 0) {
      return { success: false, error: 'No data to import' };
    }

    let imported = 0;
    let failed = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);

      for (const row of batch) {
        try {
          const columns = Object.keys(row).map(col => `"${col}"`).join(', ');
          const values = Object.values(row).map(val => `'${val}'`).join(', ');
          const fullTable = schema && schema !== 'main' && schema !== 'public' ? `${schema}."${table}"` : `"${table}"`;
          const query = `INSERT INTO ${fullTable} (${columns}) VALUES (${values})`;

          const result = await connector.executeQuery(query);
          if (result.success) {
            imported++;
          } else {
            failed++;
            errors.push(`Row ${i + batch.indexOf(row) + 1}: ${result.error}`);
          }
        } catch (error) {
          logger.error(`CSV import row ${i + batch.indexOf(row) + 1} failed:`, error);
          failed++;
          errors.push(`Row ${i + batch.indexOf(row) + 1}: ${error.message}`);
        }
      }
    }

    return {
      success: imported > 0,
      imported,
      failed,
      errors: errors.slice(0, 10),
      total_errors: errors.length,
    };
  }
}

module.exports = { CSVHandler };
