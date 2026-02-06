/**
 * Query execution IPC handlers.
 */

const { ipcMain } = require('electron');
const { connectionStorage } = require('../utils/connection-storage');
const { queryExecutor } = require('../operations/query-executor');
const { queryHistory } = require('../operations/query-history');
const { logger } = require('../utils/logger.js');

function registerQueryHandlers() {
  // Execute query
  ipcMain.handle('query:execute', async (event, connectionId, request) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      logger.info(`Executing query on '${connection.name}': ${request.query.substring(0, 100)}...`);

      const result = await queryExecutor.executeQuery(
        connection,
        request.query,
        request.limit,
        request.offset || 0,
        request.timeout,
        request.skipValidation || false
      );

      if (result.success) {
        logger.info(`Query executed successfully (${result.total_rows} rows, ${result.execution_time}s)`);
      } else {
        logger.error(`Query failed: ${result.error}`);
      }

      // Save to history only if not requiring confirmation
      if (!result.requiresConfirmation) {
        await queryHistory.addQuery(
          connectionId,
          request.query,
          result.success,
          result.execution_time,
          result.total_rows,
          result.error
        );
      }

      return { data: result };
    } catch (error) {
      logger.error('Query execution error:', error);
      throw error;
    }
  });

  // Get query history
  ipcMain.handle('query:getHistory', async (event, connectionId, limit = 50) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      const queries = await queryHistory.getHistory(connectionId, limit);
      return { data: { success: true, history: queries, count: queries.length } };
    } catch (error) {
      logger.error('Failed to get query history:', error);
      throw error;
    }
  });

  // Clear query history
  ipcMain.handle('query:clearHistory', async (event, connectionId) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      const success = await queryHistory.clearHistory(connectionId);
      return {
        data: {
          success,
          message: success ? 'History cleared' : 'No history found',
        }
      };
    } catch (error) {
      logger.error('Failed to clear query history:', error);
      throw error;
    }
  });

  // Delete single query from history
  ipcMain.handle('query:deleteQuery', async (event, connectionId, index) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      const success = await queryHistory.deleteQuery(connectionId, index);
      return {
        data: {
          success,
          message: success ? 'Query deleted' : 'Query not found',
        }
      };
    } catch (error) {
      logger.error('Failed to delete query:', error);
      throw error;
    }
  });

  // Search query history
  ipcMain.handle('query:searchHistory', async (event, connectionId, searchTerm) => {
    try {
      const connection = await connectionStorage.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      const results = await queryHistory.searchHistory(connectionId, searchTerm);
      return { data: { success: true, results, count: results.length } };
    } catch (error) {
      logger.error('Failed to search query history:', error);
      throw error;
    }
  });

  // Cleanup old query history
  ipcMain.handle('query:cleanupHistory', async (event, retentionDays = 30) => {
    try {
      logger.info(`Cleaning up query history older than ${retentionDays} days`);
      const removed = await queryHistory.cleanupOldHistory(retentionDays);
      logger.info(`Removed ${removed} old queries from history`);
      return {
        data: {
          success: true,
          removed_count: removed,
          message: `Removed ${removed} old queries`,
        }
      };
    } catch (error) {
      logger.error('Failed to cleanup query history:', error);
      throw error;
    }
  });
}

module.exports = { registerQueryHandlers };
