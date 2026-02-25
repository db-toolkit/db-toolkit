/**
 * Cleanup old query history and cache.
 */

const { scheduler } = require('./scheduler');
const { cleanupOldHistory } = require('../query-history');
const { cleanupExpired } = require('../../utils/cache');
const { settingsStorage } = require('../../utils/settings-storage');
const { logger } = require('../../utils/logger.js');

async function cleanupOldHistoryTask() {
  const baseInterval = 4 * 60 * 60 * 1000; // 4 hours
  
  while (true) {
    try {
      const startTime = Date.now();
      
      const interval = scheduler.getAdaptiveInterval('history_cleanup', baseInterval, 1.5);
      await new Promise(resolve => setTimeout(resolve, interval));
      
      const settings = await settingsStorage.getSettings();
      const retentionDays = settings.query_history_retention_days || 30;
      
      const removedHistory = cleanupOldHistory(retentionDays);
      const removedCache = cleanupExpired();
      
      const duration = Date.now() - startTime;
      scheduler.recordTaskExecution('history_cleanup', duration, removedHistory + removedCache);
      
      if (removedHistory > 0 || removedCache > 0) {
        logger.info(`Cleaned up ${removedHistory} history entries, ${removedCache} expired cache entries`);
      }
    } catch (error) {
      logger.error('Error in history cleanup task:', error);
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }
}

module.exports = { cleanupOldHistoryTask };
