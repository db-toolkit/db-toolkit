/**
 * IPC handlers for analytics operations.
 */

const { ipcMain, shell, app } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { connectionManager } = require('../utils/connection-manager');
const { connectionStorage } = require('../utils/connection-storage');
const { AnalyticsManager } = require('../operations/analytics-manager');

function registerAnalyticsHandlers() {
  ipcMain.handle('analytics:get', async (event, connectionId) => {
    try {
      const connection = await connectionManager.getConnector(connectionId);
      if (!connection) {
        return { success: false, error: 'Connection not found' };
      }

      const config = await connectionStorage.getConnection(connectionId);
      const manager = new AnalyticsManager(connection);
      return await manager.getAnalytics(config, connectionId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('analytics:historical', async (event, connectionId, hours = 3) => {
    try {
      const connection = await connectionManager.getConnector(connectionId);
      if (!connection) {
        return { success: false, error: 'Connection not found' };
      }

      const manager = new AnalyticsManager(connection);
      return { success: true, data: manager.getHistoricalData(connectionId, hours) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('analytics:slow-queries', async (event, connectionId, hours = 24) => {
    try {
      const connection = await connectionManager.getConnector(connectionId);
      if (!connection) {
        return { success: false, error: 'Connection not found' };
      }

      const manager = new AnalyticsManager(connection);
      return { success: true, data: manager.getSlowQueryLog(connectionId, hours) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('analytics:table-stats', async (event, connectionId) => {
    try {
      const connection = await connectionManager.getConnector(connectionId);
      if (!connection) {
        return { success: false, error: 'Connection not found' };
      }

      const config = await connectionStorage.getConnection(connectionId);
      const manager = new AnalyticsManager(connection);
      return { success: true, data: await manager.getTableStatistics(config) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('analytics:export-pdf', async (event, connectionId) => {
    try {
      const connection = await connectionManager.getConnector(connectionId);
      if (!connection) {
        return { success: false, error: 'Connection not found' };
      }

      const config = await connectionStorage.getConnection(connectionId);
      const manager = new AnalyticsManager(connection);
      const pdfBuffer = await manager.exportToPDF(connectionId, config.name, config);
      
      const downloadsPath = app.getPath('downloads');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `analytics-${config.name}-${timestamp}.pdf`;
      const filepath = path.join(downloadsPath, filename);
      
      await fs.writeFile(filepath, pdfBuffer);
      shell.showItemInFolder(filepath);
      
      return { success: true, path: filepath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('analytics:query-plan', async (event, connectionId, query) => {
    try {
      const connection = await connectionManager.getConnector(connectionId);
      if (!connection) {
        return { success: false, error: 'Connection not found' };
      }

      const config = await connectionStorage.getConnection(connectionId);
      const manager = new AnalyticsManager(connection);
      return await manager.getQueryPlan(query, config);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('analytics:kill-query', async (event, connectionId, pid) => {
    try {
      const connection = await connectionManager.getConnector(connectionId);
      if (!connection) {
        return { success: false, error: 'Connection not found' };
      }

      const config = await connectionStorage.getConnection(connectionId);
      const manager = new AnalyticsManager(connection);
      return await manager.killQuery(pid, config);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}

module.exports = { registerAnalyticsHandlers };
