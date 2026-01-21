/**
 * Workspace Tab Bar Component
 */
import { Plus } from "lucide-react";
import { useWorkspace } from "./WorkspaceProvider";
import { WorkspaceTab } from "./WorkspaceTab";
import { useNavigate } from "react-router-dom";
import { createWorkspaceWithEffect, switchWorkspaceWithEffect } from "../../utils/workspaceUtils";
import { useCallback, useMemo } from "react";

export function WorkspaceTabBar() {
  const {
    workspaces,
    activeWorkspaceId,
    switchWorkspace,
    closeWorkspace,
    closeMultipleWorkspaces,
    createWorkspace,
    updateWorkspace,
  } = useWorkspace();
  const navigate = useNavigate();

  const handleNewWorkspace = useCallback(async () => {
    await createWorkspaceWithEffect(createWorkspace, navigate, workspaces);
  }, [createWorkspace, navigate, workspaces]);

  const handleTabClick = useCallback((workspaceId) => {
    switchWorkspaceWithEffect(workspaceId, switchWorkspace);
  }, [switchWorkspace]);

  const handleCloseTab = useCallback(async (workspaceId) => {
    await closeWorkspace(workspaceId);
  }, [closeWorkspace]);

  // Memoize workspace tabs to prevent unnecessary re-renders
  const workspaceTabs = useMemo(() => {
    return workspaces.map((workspace) => (
      <WorkspaceTab
        key={workspace.id}
        workspace={workspace}
        isActive={workspace.id === activeWorkspaceId}
        onClick={handleTabClick}
        onClose={handleCloseTab}
        onCloseMultiple={closeMultipleWorkspaces}
        onUpdate={updateWorkspace}
        workspaces={workspaces}
      />
    ));
  }, [workspaces, activeWorkspaceId, handleTabClick, handleCloseTab, closeMultipleWorkspaces, updateWorkspace]);

  return (
    <div className="flex items-center w-full h-full overflow-hidden">
      {/* Workspace Tabs - Scrollable Container */}
      <div 
        className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent flex-1"
        style={{ 
          WebkitOverflowScrolling: "touch",
          width: 0, // Force flexbox to respect overflow
        }}
      >
        <div className="flex items-center h-full" style={{ minWidth: 'max-content' }}>
          {workspaceTabs}
        </div>
      </div>

      {/* New Workspace Button - Fixed to right */}
      <button
        onClick={handleNewWorkspace}
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition border border-gray-300 dark:border-gray-600 rounded"
        style={{ WebkitAppRegion: "no-drag" }}
        title="Add new workspace"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
