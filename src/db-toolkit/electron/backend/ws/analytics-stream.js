/**
 * Real-time analytics streaming using IPC events.
 */

const { BrowserWindow } = require('electron');
const { AnalyticsManager } = require('../operations/analytics-manager');
const { connectionManager } = require('../utils/connection-manager');
const { connectionStorage } = require('../utils/connection-storage');
const { logger } = require('../utils/logger');

const activeStreams = new Map();

async function startAnalyticsStream(connectionId) {
  if (activeStreams.has(connectionId)) return;

  const connection = await connectionManager.getConnector(connectionId);
  const config = await connectionStorage.getConnection(connectionId);
  
  if (!connection || !config) {
    logger.warn(`Cannot start analytics stream for connection ${connectionId}`);
    return;
  }

  logger.info(`Starting analytics stream for connection ${connectionId}`);
  const manager = new AnalyticsManager(connection);
  
  const interval = setInterval(async () => {
    try {
      const result = await manager.getAnalytics(config, connectionId);
      const mainWindow = BrowserWindow.getAllWindows()[0];
      if (mainWindow) {
        mainWindow.webContents.send('analytics:update', {
          connection_id: connectionId,
          data: result
        });
      }
    } catch (error) {
      logger.error(`Analytics stream error for connection ${connectionId}: ${error.message}`);
      stopAnalyticsStream(connectionId);
    }
  }, 3000);

  activeStreams.set(connectionId, interval);
}

function stopAnalyticsStream(connectionId) {
  const interval = activeStreams.get(connectionId);
  if (interval) {
    logger.info(`Stopping analytics stream for connection ${connectionId}`);
    clearInterval(interval);
    activeStreams.delete(connectionId);
  }
}

function stopAllStreams() {
  logger.info('Stopping all analytics streams');
  for (const [connectionId] of activeStreams) {
    stopAnalyticsStream(connectionId);
  }
}

module.exports = { startAnalyticsStream, stopAnalyticsStream, stopAllStreams };
