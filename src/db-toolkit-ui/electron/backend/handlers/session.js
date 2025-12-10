/**
 * Session management IPC handlers.
 */

const { ipcMain } = require('electron');
const { connectionManager } = require('../utils/connection-manager');
const { sessionManager } = require('../utils/session-manager');

function registerSessionHandlers() {
  // Get session state
  ipcMain.handle('session:getState', async () => {
    try {
      const activeIds = await connectionManager.getAllActiveConnections();
      const connections = [];

      for (const connId of activeIds) {
        const conn = await connectionManager.getConnection(connId);
        if (conn) {
          connections.push({
            connection_id: conn.id,
            is_connected: await connectionManager.isConnected(connId),
            db_type: conn.db_type,
            name: conn.name,
            host: conn.host,
            database: conn.database,
          });
        }
      }

      return {
        active_connections: connections,
        total_connections: connections.length,
      };
    } catch (error) {
      console.error('Get session state error:', error);
      throw error;
    }
  });

  // Get connection status
  ipcMain.handle('session:connectionStatus', async (event, connectionId) => {
    try {
      return await connectionManager.getConnectionStatus(connectionId);
    } catch (error) {
      console.error('Get connection status error:', error);
      throw error;
    }
  });

  // Save session
  ipcMain.handle('session:save', async (event, lastActive = null) => {
    try {
      const activeIds = await connectionManager.getAllActiveConnections();
      const success = await sessionManager.saveSession(activeIds, lastActive);

      return { success, saved_connections: activeIds.length };
    } catch (error) {
      console.error('Save session error:', error);
      throw error;
    }
  });

  // Restore session
  ipcMain.handle('session:restore', async () => {
    try {
      const connections = await sessionManager.getRestorableConnections();
      let restored = 0;

      for (const conn of connections) {
        const success = await connectionManager.connect(conn);
        if (success) {
          restored++;
        }
      }

      return { success: restored > 0, restored_connections: restored };
    } catch (error) {
      console.error('Restore session error:', error);
      throw error;
    }
  });

  // Clear session
  ipcMain.handle('session:clear', async () => {
    try {
      const success = await sessionManager.clearSession();
      return { success };
    } catch (error) {
      console.error('Clear session error:', error);
      throw error;
    }
  });

  // Get session settings
  ipcMain.handle('session:getSettings', async () => {
    try {
      const sessionData = await sessionManager.loadSession();

      return {
        active_connection_ids: sessionData.active_connection_ids || [],
        last_active_connection: sessionData.last_active_connection,
        settings: sessionData.settings || {},
      };
    } catch (error) {
      console.error('Get session settings error:', error);
      throw error;
    }
  });
}

module.exports = { registerSessionHandlers };
