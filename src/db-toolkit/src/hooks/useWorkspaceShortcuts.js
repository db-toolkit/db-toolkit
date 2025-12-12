/**
 * Workspace keyboard shortcuts hook
 */
import { useEffect } from 'react';
import { useWorkspace } from '../components/workspace/WorkspaceProvider';

export function useWorkspaceShortcuts() {
    const { workspaces, activeWorkspaceId, switchWorkspace, closeWorkspace, createWorkspace } = useWorkspace();

    useEffect(() => {
        const handleKeyDown = (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifier = isMac ? e.metaKey : e.ctrlKey;

            if (!modifier) return;

            // Cmd/Ctrl + 1-9: Switch to workspace by position
            if (e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const index = parseInt(e.key) - 1;
                if (workspaces[index]) {
                    switchWorkspace(workspaces[index].id);
                }
                return;
            }

            // Cmd/Ctrl + W: Close active workspace
            if (e.key === 'w' || e.key === 'W') {
                e.preventDefault();
                if (activeWorkspaceId && workspaces.length > 1) {
                    closeWorkspace(activeWorkspaceId);
                }
                return;
            }

            // Cmd/Ctrl + T: Create new workspace
            if (e.key === 't' || e.key === 'T') {
                e.preventDefault();
                createWorkspace(null, `Workspace ${workspaces.length + 1}`, null);
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [workspaces, activeWorkspaceId, switchWorkspace, closeWorkspace, createWorkspace]);
}
