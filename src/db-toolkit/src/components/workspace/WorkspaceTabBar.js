/**
 * Workspace Tab Bar Component
 */
import { Plus } from "lucide-react";
import { useWorkspace } from "./WorkspaceProvider";
import { WorkspaceTab } from "./WorkspaceTab";
import { useNavigate } from "react-router-dom";
import { createWorkspaceWithEffect, switchWorkspaceWithEffect } from "../../utils/workspaceUtils";

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

  const handleNewWorkspace = async () => {
    await createWorkspaceWithEffect(createWorkspace, navigate, workspaces);
  };

  const handleTabClick = (workspaceId) => {
    switchWorkspaceWithEffect(workspaceId, switchWorkspace);
  };

  const handleCloseTab = async (workspaceId) => {
    await closeWorkspace(workspaceId);
  };

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
          {workspaces.map((workspace) => (
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
          ))}
        </div>
      </div>

      {/* New Workspace Button - Fixed to right */}
      <button
        onClick={handleNewWorkspace}
        className="flex-shrink-0 flex items-center justify-center px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-full"
        style={{ WebkitAppRegion: "no-drag" }}
        title="Open new workspace"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
