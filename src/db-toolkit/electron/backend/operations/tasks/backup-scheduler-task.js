/**
 * Backup scheduler task.
 */

const { scheduler } = require('./scheduler');
const backupStorage = require('../../utils/backup-storage');
const { getAllConnections, getConnectionById } = require('../../utils/connection-storage');
const { BackupManager } = require('../backup-manager');
const { getConnection } = require('../../utils/connection-manager');
const { logger } = require('../../utils/logger.js');

async function backupSchedulerTask() {
  const backupManager = new BackupManager();
  const baseInterval = 60000; // 1 minute
  
  while (true) {
    try {
      const startTime = Date.now();
      
      const schedules = await backupStorage.getAllSchedules();
      const now = new Date();
      
      const backupsDue = schedules.some(
        schedule => schedule.enabled && schedule.next_run && 
        new Date(schedule.next_run) <= now
      );
      
      let interval;
      if (backupsDue) {
        interval = baseInterval;
      } else {
        const nextBackupTimes = schedules
          .filter(s => s.enabled && s.next_run)
          .map(s => new Date(s.next_run));
        
        if (nextBackupTimes.length > 0) {
          const nextBackup = new Date(Math.min(...nextBackupTimes));
          const timeUntilNext = nextBackup - now;
          interval = Math.max(300000, Math.min(1800000, timeUntilNext / 2));
        } else {
          interval = 1800000; // 30 minutes
        }
      }
      
      let backupsProcessed = 0;
      for (const schedule of schedules) {
        if (!schedule.enabled) continue;
        
        if (schedule.next_run) {
          const nextRun = new Date(schedule.next_run);
          if (now >= nextRun) {
            const config = getConnectionById(schedule.connection_id);
            const connection = getConnection(schedule.connection_id);
            
            if (config && connection) {
              logger.info(`Running scheduled backup for '${config.name}'`);
              await backupManager.createBackup(
                connection,
                config,
                `${schedule.name}_${Date.now()}`,
                schedule.backup_type,
                schedule.tables,
                schedule.compressed
              );
              
              const nextRunTime = calculateNextRun(schedule.schedule);
              await backupStorage.updateSchedule(schedule.id, {
                last_run: now.toISOString(),
                next_run: nextRunTime
              });
              
              backupsProcessed++;
            }
          }
        }
      }
      
      const duration = Date.now() - startTime;
      scheduler.recordTaskExecution('backup_scheduler', duration, backupsProcessed);
      
      await new Promise(resolve => setTimeout(resolve, interval));
    } catch (error) {
      logger.error('Error in backup scheduler:', error);
      await new Promise(resolve => setTimeout(resolve, 300000));
    }
  }
}

function calculateNextRun(scheduleType) {
  const now = new Date();
  if (scheduleType === 'daily') {
    return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  } else if (scheduleType === 'weekly') {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (scheduleType === 'monthly') {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  return null;
}

module.exports = { backupSchedulerTask };
