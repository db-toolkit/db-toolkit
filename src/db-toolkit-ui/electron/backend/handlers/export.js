/**
 * Export IPC handlers.
 */

const { ipcMain, dialog } = require('electron');
const fs = require('fs').promises;
const { connectionManager } = require('../utils/connection-manager');
const { CSVHandler } = require('../operations/csv-handler');

function registerExportHandlers() {
  // Export to CSV
  ipcMain.handle('export:csv', async (event, connectionId, request) => {
    try {
      const connector = await connectionManager.getConnector(connectionId);
      if (!connector) {
        throw new Error('Connection not found');
      }

      const csvContent = await CSVHandler.exportToCSV(
        connector,
        request.table,
        request.schema_name,
        request.query,
        request.delimiter || ',',
        request.include_headers !== false
      );

      const rowCount = csvContent ? csvContent.split('\n').length - 2 : 0;

      return { csv_content: csvContent, row_count: rowCount };
    } catch (error) {
      console.error('CSV export error:', error);
      throw error;
    }
  });

  // Export to JSON
  ipcMain.handle('export:json', async (event, connectionId, request) => {
    try {
      const connector = await connectionManager.getConnector(connectionId);
      if (!connector) {
        throw new Error('Connection not found');
      }

      const jsonContent = await CSVHandler.exportToJSON(
        connector,
        request.table,
        request.schema_name,
        request.query
      );

      const data = JSON.parse(jsonContent);
      const rowCount = data.length;

      return { json_content: jsonContent, row_count: rowCount };
    } catch (error) {
      console.error('JSON export error:', error);
      throw error;
    }
  });

  // Save CSV file
  ipcMain.handle('export:saveCSV', async (event, csvContent, defaultName) => {
    try {
      const { filePath, canceled } = await dialog.showSaveDialog({
        defaultPath: defaultName || 'export.csv',
        filters: [{ name: 'CSV Files', extensions: ['csv'] }],
      });

      if (canceled || !filePath) {
        return { success: false, canceled: true };
      }

      await fs.writeFile(filePath, csvContent, 'utf-8');
      return { success: true, path: filePath };
    } catch (error) {
      console.error('Save CSV error:', error);
      throw error;
    }
  });

  // Save JSON file
  ipcMain.handle('export:saveJSON', async (event, jsonContent, defaultName) => {
    try {
      const { filePath, canceled } = await dialog.showSaveDialog({
        defaultPath: defaultName || 'export.json',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
      });

      if (canceled || !filePath) {
        return { success: false, canceled: true };
      }

      await fs.writeFile(filePath, jsonContent, 'utf-8');
      return { success: true, path: filePath };
    } catch (error) {
      console.error('Save JSON error:', error);
      throw error;
    }
  });

  // Validate CSV
  ipcMain.handle('import:validateCSV', async (event, csvContent, columnMapping) => {
    try {
      const { rows, errors } = CSVHandler.validateCSVData(csvContent, columnMapping);
      return {
        valid: errors.length === 0,
        row_count: rows.length,
        errors,
      };
    } catch (error) {
      console.error('CSV validation error:', error);
      throw error;
    }
  });

  // Import CSV
  ipcMain.handle('import:csv', async (event, connectionId, request) => {
    try {
      const connector = await connectionManager.getConnector(connectionId);
      if (!connector) {
        throw new Error('Connection not found');
      }

      const { rows, errors } = CSVHandler.validateCSVData(
        request.csv_content,
        request.column_mapping
      );

      if (errors.length > 0) {
        return {
          success: false,
          imported: 0,
          failed: rows.length,
          errors,
          total_errors: errors.length,
        };
      }

      const result = await CSVHandler.importFromCSV(
        connector,
        request.table,
        rows,
        request.schema_name,
        request.batch_size || 100
      );

      return result;
    } catch (error) {
      console.error('CSV import error:', error);
      throw error;
    }
  });
}

module.exports = { registerExportHandlers };
