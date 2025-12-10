/**
 * Backup status notifier using IPC events.
 */

const { BrowserWindow } = require('electron');
const { logger } = require('../utils/logger');

class BackupNotifier {
  async notifyBackupUpdate(backupId, status, data = {}) {
    logger.info(`Backup notification: ${backupId} - ${status}`);
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      mainWindow.webContents.send('backup:update', {
        type: 'backup_update',
        backup_id: backupId,
        status,
        data
      });
    } else {
      logger.warn('No main window available for backup notification');
    }
  }
}

const backupNotifier = new BackupNotifier();

module.exports = { backupNotifier };
