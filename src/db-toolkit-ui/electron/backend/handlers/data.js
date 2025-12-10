/**
 * Data editing IPC handlers.
 */

const { ipcMain } = require('electron');
const { connectionStorage } = require('../utils/connection-storage');
const { dataEditor } = require('../operations/data-editor');

function registerDataHandlers() {
  // Update row
  ipcMain.handle('data:updateRow', async (event, connectionId, request) => {
    try {
      console.log(`Update row request - table: ${request.table}, schema: ${request.schema_name}, pk:`, request.primary_key);

      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      const result = await dataEditor.updateRow(
        connection,
        request.table,
        request.schema_name,
        request.primary_key,
        request.changes
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('Update row error:', error);
      throw error;
    }
  });

  // Insert row
  ipcMain.handle('data:insertRow', async (event, connectionId, request) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      const result = await dataEditor.insertRow(
        connection,
        request.table,
        request.schema_name,
        request.data
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('Insert row error:', error);
      throw error;
    }
  });

  // Delete row
  ipcMain.handle('data:deleteRow', async (event, connectionId, request) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      const result = await dataEditor.deleteRow(
        connection,
        request.table,
        request.schema_name,
        request.primary_key
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('Delete row error:', error);
      throw error;
    }
  });
}

module.exports = { registerDataHandlers };
