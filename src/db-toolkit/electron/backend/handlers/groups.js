/**
 * Group management IPC handlers.
 */

const { ipcMain } = require("electron");
const { groupStorage } = require("../utils/group-storage");
const { logger } = require("../utils/logger.js");

function registerGroupHandlers() {
  // Get all groups
  ipcMain.handle("groups:getAll", async () => {
    try {
      return await groupStorage.getAllGroups();
    } catch (error) {
      logger.error("Failed to get groups:", error);
      throw error;
    }
  });

  // Create group
  ipcMain.handle("groups:create", async (event, name) => {
    try {
      logger.info(`Creating group '${name}'`);
      return await groupStorage.addGroup(name);
    } catch (error) {
      logger.error("Failed to create group:", error);
      throw error;
    }
  });

  // Update group
  ipcMain.handle("groups:update", async (event, groupId, updates) => {
    try {
      logger.info(`Updating group ${groupId}`);
      const result = await groupStorage.updateGroup(groupId, updates);
      if (!result) {
        throw new Error("Group not found");
      }
      return result;
    } catch (error) {
      logger.error("Failed to update group:", error);
      throw error;
    }
  });

  // Delete group
  ipcMain.handle("groups:delete", async (event, groupId) => {
    try {
      logger.info(`Deleting group ${groupId}`);
      const result = await groupStorage.removeGroup(groupId);
      if (!result) {
        throw new Error("Group not found");
      }
      return { success: true };
    } catch (error) {
      logger.error("Failed to delete group:", error);
      throw error;
    }
  });
}

module.exports = { registerGroupHandlers };
