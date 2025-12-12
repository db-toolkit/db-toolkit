/**
 * Workspace Manager - Core workspace management logic
 */

const { v4: uuidv4 } = require('uuid');

class WorkspaceManager {
    constructor() {
        this.workspaces = new Map();
    }

    /**
     * Create a new workspace
     */
    createWorkspace(connectionId, connectionName, connectionType) {
        const workspace = {
            id: uuidv4(),
            connectionId,
            connectionName,
            connectionType,
            color: this._generateColor(),
            createdAt: new Date().toISOString(),
            lastAccessedAt: new Date().toISOString(),
            state: {
                activeRoute: `/query/${connectionId}`,
                queryTabs: [],
                queryHistory: [],
                scrollPositions: {},
                expandedNodes: []
            }
        };

        this.workspaces.set(workspace.id, workspace);
        return workspace;
    }

    /**
     * Get workspace by ID
     */
    getWorkspace(workspaceId) {
        return this.workspaces.get(workspaceId);
    }

    /**
     * Get all workspaces
     */
    getAllWorkspaces() {
        return Array.from(this.workspaces.values());
    }

    /**
     * Update workspace
     */
    updateWorkspace(workspaceId, updates) {
        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace ${workspaceId} not found`);
        }

        const updated = {
            ...workspace,
            ...updates,
            lastAccessedAt: new Date().toISOString()
        };

        this.workspaces.set(workspaceId, updated);
        return updated;
    }

    /**
     * Update workspace state
     */
    updateWorkspaceState(workspaceId, stateUpdates) {
        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace ${workspaceId} not found`);
        }

        const updated = {
            ...workspace,
            state: {
                ...workspace.state,
                ...stateUpdates
            },
            lastAccessedAt: new Date().toISOString()
        };

        this.workspaces.set(workspaceId, updated);
        return updated;
    }

    /**
     * Delete workspace
     */
    deleteWorkspace(workspaceId) {
        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace ${workspaceId} not found`);
        }

        this.workspaces.delete(workspaceId);
        return workspace;
    }

    /**
     * Load workspaces from storage
     */
    loadWorkspaces(workspacesData) {
        this.workspaces.clear();
        workspacesData.forEach(workspace => {
            this.workspaces.set(workspace.id, workspace);
        });
    }

    /**
     * Generate a random color for workspace
     */
    _generateColor() {
        const colors = [
            '#3b82f6', // blue
            '#10b981', // green
            '#f59e0b', // amber
            '#ef4444', // red
            '#8b5cf6', // purple
            '#ec4899', // pink
            '#06b6d4', // cyan
            '#f97316', // orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Singleton instance
let workspaceManager = null;

function getWorkspaceManager() {
    if (!workspaceManager) {
        workspaceManager = new WorkspaceManager();
    }
    return workspaceManager;
}

module.exports = { WorkspaceManager, getWorkspaceManager };
