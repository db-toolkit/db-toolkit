/**
 * Background tasks manager.
 */

const { cleanupOldHistoryTask } = require('./cleanup-task');
const { backupSchedulerTask } = require('./backup-scheduler-task');
const { scheduler } = require('./scheduler');

function startBackgroundTasks() {
  cleanupOldHistoryTask().catch(err => console.error('Cleanup task error:', err));
  backupSchedulerTask().catch(err => console.error('Backup scheduler error:', err));
  console.log('Background tasks started');
}

function recordQueryActivity() {
  scheduler.recordActivity();
}

function getSchedulerStats() {
  return scheduler.getStats();
}

module.exports = { startBackgroundTasks, recordQueryActivity, getSchedulerStats };
