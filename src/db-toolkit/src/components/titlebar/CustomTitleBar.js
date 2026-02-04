/**
 * Custom Titlebar Component (Wave Terminal style)
 */
import { useState, useEffect } from "react";
import { Menu, Minus, Square, X } from "lucide-react";
import { WorkspaceTabBar } from "../workspace/WorkspaceTabBar";
import { Tooltip } from "../common/Tooltip";

export function CustomTitleBar({ onToggleSidebar }) {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const isWindows = navigator.platform.toUpperCase().indexOf("WIN") >= 0;
  const isLinux = !isMac && !isWindows;
  const [workspacesEnabled, setWorkspacesEnabled] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings =
          await window.electron.ipcRenderer.invoke("settings:get");
        const enabled = settings?.workspaces?.enabled ?? true;
        setWorkspacesEnabled(enabled);
      } catch (error) {
        console.error("Failed to load workspace settings:", error);
        setWorkspacesEnabled(true);
      }
    };
    loadSettings();

    const handleSettingsUpdate = () => {
      loadSettings();
    };
    window.addEventListener("settings-updated", handleSettingsUpdate);
    return () =>
      window.removeEventListener("settings-updated", handleSettingsUpdate);
  }, []);

  return (
    <div className="flex items-center h-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 select-none">
      {/* Drag region */}
      <div
        className="flex-1 flex items-center h-full"
        style={{ WebkitAppRegion: "drag" }}
      >
        {/* Sidebar toggle (left side) */}
        <div
          className={`flex items-center px-4 ${isMac ? "ml-16" : ""}`}
          style={{ WebkitAppRegion: "no-drag" }}
        >
          <Tooltip text="Toggle sidebar" position="right">
            <button
              onClick={onToggleSidebar}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <Menu size={16} className="text-gray-700 dark:text-gray-300" />
            </button>
          </Tooltip>
        </div>

        {/* Workspace tabs or app title */}
        {workspacesEnabled === null ? (
          <div className="flex-1" />
        ) : workspacesEnabled ? (
          <WorkspaceTabBar />
        ) : (
          <div className="flex-1 flex items-center justify-center px-4">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              DB Toolkit
            </span>
          </div>
        )}
      </div>

      {(isWindows || isLinux) && (
        <div
          className="flex items-center h-full"
          style={{ WebkitAppRegion: "no-drag" }}
        >
          <button
            onClick={() => window.electron.ipcRenderer.invoke("window:minimize")}
            className="h-10 w-12 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Minimize"
          >
            <Minus size={14} className="text-gray-700 dark:text-gray-200" />
          </button>
          <button
            onClick={() => window.electron.ipcRenderer.invoke("window:maximize")}
            className="h-10 w-12 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Maximize"
          >
            <Square size={12} className="text-gray-700 dark:text-gray-200" />
          </button>
          <button
            onClick={() => window.electron.ipcRenderer.invoke("window:close")}
            className="h-10 w-12 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
            title="Close"
          >
            <X size={14} className="text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      )}
    </div>
  );
}
