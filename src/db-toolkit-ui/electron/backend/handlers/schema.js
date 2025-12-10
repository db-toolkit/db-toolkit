/**
 * Schema exploration IPC handlers.
 */

const { ipcMain } = require('electron');
const { connectionStorage } = require('../utils/connection-storage');
const { schemaExplorer } = require('../operations/schema-explorer');

function registerSchemaHandlers() {
  // Get schema tree
  ipcMain.handle('schema:getTree', async (event, connectionId, useCache = true) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      return await schemaExplorer.getSchemaTree(connection, useCache);
    } catch (error) {
      console.error('Failed to get schema tree:', error);
      throw error;
    }
  });

  // Get table info
  ipcMain.handle('schema:getTableInfo', async (event, connectionId, schemaName, tableName) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      return await schemaExplorer.getTableInfo(connection, schemaName, tableName);
    } catch (error) {
      console.error('Failed to get table info:', error);
      throw error;
    }
  });

  // Refresh schema
  ipcMain.handle('schema:refresh', async (event, connectionId) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      await schemaExplorer.refreshSchema(connectionId);
      return { success: true, message: 'Schema cache refreshed' };
    } catch (error) {
      console.error('Failed to refresh schema:', error);
      throw error;
    }
  });

  // Get cached schemas
  ipcMain.handle('schema:getCached', async () => {
    try {
      const keys = schemaExplorer.getCachedSchemas();
      return { cached_schemas: keys };
    } catch (error) {
      console.error('Failed to get cached schemas:', error);
      throw error;
    }
  });
}

module.exports = { registerSchemaHandlers };
