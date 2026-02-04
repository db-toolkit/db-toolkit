const { app, BrowserWindow } = require('electron');
const { createWindow } = require('./window-manager');
const { registerAdditionalHandlers } = require('./ipc-handlers');
const { restoreSession, saveSession, cleanupSession } = require('./session-lifecycle');
const { checkForUpdates } = require('./updater');

function registerIpcHandlers() {
  // Register all backend IPC handlers
  const { registerAllHandlers } = require('./backend/handlers');
  registerAllHandlers();
  
  // Register additional handlers
  registerAdditionalHandlers();
}

app.whenReady().then(async () => {
  registerIpcHandlers();
  const { createMenu } = require('./menu');
  const { startBackgroundTasks } = require('./backend/operations/tasks');
  
  const mainWindow = createWindow();
  createMenu(mainWindow, !app.isPackaged);
  
  // Defer background tasks to not compete with window rendering
  setTimeout(() => {
    startBackgroundTasks();
  }, 3000);

  // Auto-check for updates shortly after app launch (packaged only)
  if (app.isPackaged) {
    setTimeout(() => {
      checkForUpdates();
    }, 6000);
  }
  
  // Restore previous session
  await restoreSession();
});

app.on('window-all-closed', async () => {
  await saveSession();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  const { stopBackgroundTasks } = require('./backend/operations/tasks');
  stopBackgroundTasks();
  await cleanupSession();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
