/**
 * Workspace Storage - Persistence layer for workspace data
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class WorkspaceStorage {
    constructor() {
        this.storageDir = path.join(os.homedir(), '.db-toolkit', 'workspaces');
        this.workspacesFile = path.join(this.storageDir, 'workspaces.json');
        this._ensureStorageDir();
    }

    /**
     * Ensure storage directory exists
     */
    async _ensureStorageDir() {
        try {
            await fs.mkdir(this.storageDir, { recursive: true });
        } catch (error) {
            console.error('Failed to create workspace storage directory:', error);
        }
    }

    /**
     * Save workspaces to disk
     */
    async saveWorkspaces(workspaces) {
        try {
            await this._ensureStorageDir();
            const data = JSON.stringify(workspaces, null, 2);
            await fs.writeFile(this.workspacesFile, data, 'utf8');
            return { success: true };
        } catch (error) {
            console.error('Failed to save workspaces:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Load workspaces from disk
     */
    async loadWorkspaces() {
        try {
            const data = await fs.readFile(this.workspacesFile, 'utf8');
            const workspaces = JSON.parse(data);
            return { success: true, workspaces };
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist yet, return empty array
                return { success: true, workspaces: [] };
            }
            console.error('Failed to load workspaces:', error);
            return { success: false, error: error.message, workspaces: [] };
        }
    }

    /**
     * Save workspace state to separate file
     */
    async saveWorkspaceState(workspaceId, state) {
        try {
            await this._ensureStorageDir();
            const stateFile = path.join(this.storageDir, `${workspaceId}-state.json`);
            const data = JSON.stringify(state, null, 2);
            await fs.writeFile(stateFile, data, 'utf8');
            return { success: true };
        } catch (error) {
            console.error(`Failed to save workspace ${workspaceId} state:`, error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Load workspace state from separate file
     */
    async loadWorkspaceState(workspaceId) {
        try {
            const stateFile = path.join(this.storageDir, `${workspaceId}-state.json`);
            const data = await fs.readFile(stateFile, 'utf8');
            const state = JSON.parse(data);
            return { success: true, state };
        } catch (error) {
            if (error.code === 'ENOENT') {
                return { success: true, state: null };
            }
            console.error(`Failed to load workspace ${workspaceId} state:`, error);
            return { success: false, error: error.message, state: null };
        }
    }

    /**
     * Delete workspace state file
     */
    async deleteWorkspaceState(workspaceId) {
        try {
            const stateFile = path.join(this.storageDir, `${workspaceId}-state.json`);
            await fs.unlink(stateFile);
            return { success: true };
        } catch (error) {
            if (error.code === 'ENOENT') {
                return { success: true };
            }
            console.error(`Failed to delete workspace ${workspaceId} state:`, error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Clear all workspace data
     */
    async clearAll() {
        try {
            const files = await fs.readdir(this.storageDir);
            await Promise.all(
                files.map(file => fs.unlink(path.join(this.storageDir, file)))
            );
            return { success: true };
        } catch (error) {
            console.error('Failed to clear workspace data:', error);
            return { success: false, error: error.message };
        }
    }
}

// Singleton instance
let workspaceStorage = null;

function getWorkspaceStorage() {
    if (!workspaceStorage) {
        workspaceStorage = new WorkspaceStorage();
    }
    return workspaceStorage;
}

module.exports = { WorkspaceStorage, getWorkspaceStorage };
