/**
 * IPC handlers for workspace operations
 */

const { ipcMain } = require('electron');
const { getWorkspaceManager } = require('../operations/workspace/workspace-manager');
const { getWorkspaceStorage } = require('../operations/workspace/workspace-storage');

function registerWorkspaceHandlers() {
    const { logger } = require('../utils/logger');

    /**
     * Create a new workspace
     */
    ipcMain.handle('workspace:create', async (event, connectionId, connectionName, connectionType) => {
        try {
            logger.info(`Creating workspace for connection: ${connectionName}`);
            const manager = getWorkspaceManager();
            const workspace = manager.createWorkspace(connectionId, connectionName, connectionType);

            // Save to disk
            const storage = getWorkspaceStorage();
            await storage.saveWorkspaces(manager.getAllWorkspaces());

            return { success: true, workspace };
        } catch (error) {
            logger.error('Failed to create workspace:', error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Get all workspaces
     */
    ipcMain.handle('workspace:getAll', async () => {
        try {
            const manager = getWorkspaceManager();
            const workspaces = manager.getAllWorkspaces();
            return { success: true, workspaces };
        } catch (error) {
            logger.error('Failed to get workspaces:', error);
            return { success: false, error: error.message, workspaces: [] };
        }
    });

    /**
     * Get workspace by ID
     */
    ipcMain.handle('workspace:get', async (event, workspaceId) => {
        try {
            const manager = getWorkspaceManager();
            const workspace = manager.getWorkspace(workspaceId);

            if (!workspace) {
                return { success: false, error: 'Workspace not found' };
            }

            return { success: true, workspace };
        } catch (error) {
            logger.error(`Failed to get workspace ${workspaceId}:`, error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Update workspace
     */
    ipcMain.handle('workspace:update', async (event, workspaceId, updates) => {
        try {
            const manager = getWorkspaceManager();
            const workspace = manager.updateWorkspace(workspaceId, updates);

            // Save to disk
            const storage = getWorkspaceStorage();
            await storage.saveWorkspaces(manager.getAllWorkspaces());

            return { success: true, workspace };
        } catch (error) {
            logger.error(`Failed to update workspace ${workspaceId}:`, error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Update workspace state
     */
    ipcMain.handle('workspace:updateState', async (event, workspaceId, stateUpdates) => {
        try {
            const manager = getWorkspaceManager();
            const workspace = manager.updateWorkspaceState(workspaceId, stateUpdates);

            // Save state to separate file
            const storage = getWorkspaceStorage();
            await storage.saveWorkspaceState(workspaceId, workspace.state);

            return { success: true, workspace };
        } catch (error) {
            logger.error(`Failed to update workspace ${workspaceId} state:`, error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Delete workspace
     */
    ipcMain.handle('workspace:delete', async (event, workspaceId) => {
        try {
            const manager = getWorkspaceManager();
            const workspace = manager.deleteWorkspace(workspaceId);

            // Save to disk and delete state file
            const storage = getWorkspaceStorage();
            await storage.saveWorkspaces(manager.getAllWorkspaces());
            await storage.deleteWorkspaceState(workspaceId);

            return { success: true, workspace };
        } catch (error) {
            logger.error(`Failed to delete workspace ${workspaceId}:`, error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Load workspaces from storage
     */
    ipcMain.handle('workspace:load', async () => {
        try {
            const storage = getWorkspaceStorage();
            const result = await storage.loadWorkspaces();

            if (result.success && result.workspaces.length > 0) {
                const manager = getWorkspaceManager();
                manager.loadWorkspaces(result.workspaces);
                
                // Load individual workspace states
                for (const workspace of result.workspaces) {
                    const stateResult = await storage.loadWorkspaceState(workspace.id);
                    if (stateResult.success && stateResult.state) {
                        manager.updateWorkspaceState(workspace.id, stateResult.state);
                    }
                }
                
                // Return workspaces with their states
                const workspacesWithStates = manager.getAllWorkspaces();
                return { success: true, workspaces: workspacesWithStates };
            }

            return result;
        } catch (error) {
            logger.error('Failed to load workspaces:', error);
            return { success: false, error: error.message, workspaces: [] };
        }
    });

    logger.info('Workspace IPC handlers registered');
}

module.exports = { registerWorkspaceHandlers };
