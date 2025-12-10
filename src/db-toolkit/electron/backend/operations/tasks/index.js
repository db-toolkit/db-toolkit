/**
 * Background tasks manager.
 */

const { cleanupOldHistoryTask } = require('./cleanup-task');
const { backupSchedulerTask } = require('./backup-scheduler-task');
const { scheduler } = require('./scheduler');
const { logger } = require('../../utils/logger.js');

function startBackgroundTasks() {
  cleanupOldHistoryTask().catch(err => logger.error('Cleanup task error:', err));
  backupSchedulerTask().catch(err => logger.error('Backup scheduler error:', err));
  logger.info('Background tasks started');
}

function recordQueryActivity() {
  scheduler.recordActivity();
}

function getSchedulerStats() {
  return scheduler.getStats();
}

module.exports = { startBackgroundTasks, recordQueryActivity, getSchedulerStats };
