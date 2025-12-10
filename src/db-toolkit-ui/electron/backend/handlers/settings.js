/**
 * Settings management IPC handlers.
 */

const { ipcMain } = require('electron');
const { settingsStorage } = require('../utils/settings-storage');

function registerSettingsHandlers() {
  // Get settings
  ipcMain.handle('settings:get', async () => {
    try {
      return await settingsStorage.getSettings();
    } catch (error) {
      console.error('Failed to get settings:', error);
      throw error;
    }
  });

  // Update settings
  ipcMain.handle('settings:update', async (event, updates) => {
    try {
      const filtered = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== null && v !== undefined)
      );
      return await settingsStorage.updateSettings(filtered);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  });

  // Reset settings
  ipcMain.handle('settings:reset', async () => {
    try {
      return await settingsStorage.resetSettings();
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  });
}

module.exports = { registerSettingsHandlers };
