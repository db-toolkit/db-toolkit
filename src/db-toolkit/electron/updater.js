const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');
const log = require('electron-log');

// Configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Disable auto-download - we'll control when to download
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow = null;

function setMainWindow(window) {
  mainWindow = window;
}

function notifyRenderer(channel, data) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send(channel, data);
  }
}

// Event handlers
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info.version);
  notifyRenderer('update:available', {
    version: info.version,
    releaseNotes: info.releaseNotes,
    releaseDate: info.releaseDate,
  });
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available');
});

autoUpdater.on('error', (err) => {
  log.error('Update error:', err);
  notifyRenderer('update:error', { message: err.message });
});

autoUpdater.on('download-progress', (progressObj) => {
  log.info(`Download progress: ${progressObj.percent}%`);
  notifyRenderer('update:download-progress', {
    percent: progressObj.percent,
    transferred: progressObj.transferred,
    total: progressObj.total,
  });
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded');
  notifyRenderer('update:downloaded', {
    version: info.version,
  });
  
  // Show dialog to install now or later
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded successfully!',
    detail: `Version ${info.version} is ready to install. The app will restart to complete the installation.`,
    buttons: ['Restart Now', 'Later'],
    defaultId: 0,
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall(false, true);
    }
  });
});

// Check for updates silently (on startup)
async function checkForUpdatesAuto() {
  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    log.error('Auto update check failed:', error);
  }
}

// Check for updates manually (from menu)
async function checkForUpdatesManual() {
  try {
    const result = await autoUpdater.checkForUpdates();
    
    if (!result || !result.updateInfo) {
      dialog.showMessageBox({
        type: 'info',
        title: 'No Updates',
        message: 'You\'re up to date!',
        detail: 'You are running the latest version.',
        buttons: ['OK'],
      });
      return;
    }

    // If update available, ask to download
    const response = await dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: `Version ${result.updateInfo.version} is available!`,
      detail: 'Would you like to download it now?',
      buttons: ['Download', 'Later'],
      defaultId: 0,
    });

    if (response.response === 0) {
      await autoUpdater.downloadUpdate();
    }
  } catch (error) {
    log.error('Manual update check failed:', error);
    dialog.showMessageBox({
      type: 'error',
      title: 'Update Check Failed',
      message: 'Unable to check for updates',
      detail: 'Please check your internet connection and try again.',
      buttons: ['OK'],
    });
  }
}

module.exports = {
  setMainWindow,
  checkForUpdatesAuto,
  checkForUpdatesManual,
};
