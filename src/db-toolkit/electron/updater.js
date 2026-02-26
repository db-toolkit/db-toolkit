const { autoUpdater } = require('electron-updater');
const { dialog, app } = require('electron');
const { logger } = require('./backend/utils/logger');
const util = require('util');

function formatLogArgs(args) {
  return util.format.apply(null, args);
}

const updaterLogger = {
  info: (...args) => logger.info(formatLogArgs(args)),
  warn: (...args) => logger.warn(formatLogArgs(args)),
  error: (...args) => logger.error(formatLogArgs(args)),
  debug: (...args) => logger.info(formatLogArgs(args)),
};

// Configure logging
autoUpdater.logger = updaterLogger;

// Disable auto-download - we'll control when to download
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.forceDevUpdateConfig = !app.isPackaged;
autoUpdater.allowDowngrade = false;

// Ensure beta builds can discover newer beta/pre-release tags on GitHub.
const currentVersion = app.getVersion();
const isPrereleaseBuild = currentVersion.includes('-');
autoUpdater.allowPrerelease = isPrereleaseBuild;

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
  updaterLogger.info('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  updaterLogger.info('Update available:', info.version);
  notifyRenderer('update:available', {
    version: info.version,
    releaseNotes: info.releaseNotes,
    releaseDate: info.releaseDate,
  });
});

autoUpdater.on('update-not-available', (info) => {
  updaterLogger.info('Update not available');
});

autoUpdater.on('error', (err) => {
  updaterLogger.error('Update error:', err);
  notifyRenderer('update:error', { message: err.message });
});

autoUpdater.on('download-progress', (progressObj) => {
  updaterLogger.info(`Download progress: ${progressObj.percent}%`);
  notifyRenderer('update:download-progress', {
    percent: progressObj.percent,
    transferred: progressObj.transferred,
    total: progressObj.total,
  });
});

autoUpdater.on('update-downloaded', (info) => {
  updaterLogger.info('Update downloaded');
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
    updaterLogger.info(
      `Auto update check (version=${currentVersion}, prerelease_build=${isPrereleaseBuild}, allowPrerelease=${autoUpdater.allowPrerelease})`,
    );
    await autoUpdater.checkForUpdates();
  } catch (error) {
    updaterLogger.error('Auto update check failed:', error);
  }
}

// Check for updates manually (from menu)
async function checkForUpdatesManual() {
  try {
    updaterLogger.info(
      `Manual update check (version=${currentVersion}, prerelease_build=${isPrereleaseBuild}, allowPrerelease=${autoUpdater.allowPrerelease})`,
    );
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
    updaterLogger.error('Manual update check failed:', error);
    const detailParts = [
      `Error: ${error?.message || 'Unknown error'}`,
    ];
    if (error?.statusCode) {
      detailParts.push(`Status: ${error.statusCode}`);
    }
    if (error?.code) {
      detailParts.push(`Code: ${error.code}`);
    }
    if (error?.path) {
      detailParts.push(`Path: ${error.path}`);
    }
    if (error?.url) {
      detailParts.push(`URL: ${error.url}`);
    }
    dialog.showMessageBox({
      type: 'error',
      title: 'Update Check Failed',
      message: 'Unable to check for updates',
      detail: detailParts.join('\n'),
      buttons: ['OK'],
    });
  }
}

module.exports = {
  setMainWindow,
  checkForUpdatesAuto,
  checkForUpdatesManual,
};
