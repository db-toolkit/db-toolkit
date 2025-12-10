/**
 * Session lifecycle management.
 */

const { logger } = require('./backend/utils/logger');

async function restoreSession() {
  try {
    const { sessionManager } = require('./backend/utils/session-manager');
    const { connectionManager } = require('./backend/utils/connection-manager');
    
    const connections = await sessionManager.getRestorableConnections();
    logger.info(`Restoring ${connections.length} connections from previous session`);
    
    for (const conn of connections) {
      await connectionManager.connect(conn);
    }
  } catch (err) {
    logger.error(`Failed to restore session: ${err.message}`);
  }
}

async function saveSession() {
  try {
    const { sessionManager } = require('./backend/utils/session-manager');
    const { connectionManager } = require('./backend/utils/connection-manager');
    
    const activeIds = await connectionManager.getAllActiveConnections();
    await sessionManager.saveSession(activeIds);
    logger.info(`Saved ${activeIds.length} active connections`);
  } catch (err) {
    logger.error(`Failed to save session: ${err.message}`);
  }
}

async function cleanupSession() {
  try {
    const { sessionManager } = require('./backend/utils/session-manager');
    const { connectionManager } = require('./backend/utils/connection-manager');
    
    const activeIds = await connectionManager.getAllActiveConnections();
    await sessionManager.saveSession(activeIds);
    await connectionManager.disconnectAll();
    logger.info('Session saved and connections closed');
  } catch (err) {
    logger.error(`Failed to save session on quit: ${err.message}`);
  }
}

module.exports = { restoreSession, saveSession, cleanupSession };