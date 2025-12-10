/**
 * Data explorer IPC handlers.
 */

const { ipcMain } = require('electron');
const { connectionStorage } = require('../utils/connection-storage');
const { dataExplorer } = require('../operations/data-explorer');
const { logger } = require('../utils/logger.js');

function registerDataExplorerHandlers() {
  // Browse table data
  ipcMain.handle('dataExplorer:browse', async (event, connectionId, request) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      return await dataExplorer.browseData(
        connection,
        request.schema_name,
        request.table_name,
        request.limit || 100,
        request.offset || 0,
        request.sort_column,
        request.sort_order || 'ASC',
        request.filters
      );
    } catch (error) {
      logger.error('Browse data error:', error);
      throw error;
    }
  });

  // Get row count
  ipcMain.handle('dataExplorer:count', async (event, connectionId, schemaName, tableName) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      const count = await dataExplorer.getRowCount(connection, schemaName, tableName);
      return { success: true, count };
    } catch (error) {
      logger.error('Get row count error:', error);
      throw error;
    }
  });

  // Get table relationships
  ipcMain.handle('dataExplorer:relationships', async (event, connectionId, schemaName, tableName) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      return await dataExplorer.getTableRelationships(connection, schemaName, tableName);
    } catch (error) {
      logger.error('Get relationships error:', error);
      throw error;
    }
  });

  // Get cell data
  ipcMain.handle('dataExplorer:cell', async (event, connectionId, request) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      return await dataExplorer.getCellData(
        connection,
        request.schema_name,
        request.table_name,
        request.column_name,
        request.row_identifier
      );
    } catch (error) {
      logger.error('Get cell data error:', error);
      throw error;
    }
  });
}

module.exports = { registerDataExplorerHandlers };
