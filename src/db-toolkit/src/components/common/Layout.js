import { useState, useEffect, useMemo, useCallback } from "react";
import Split from "react-split";
import { useTheme } from "../../contexts/ThemeContext";
import { Settings } from "lucide-react";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";
import CommandPalette from "./CommandPalette";
import { NotificationCenter } from "./NotificationCenter";
import { SettingsModal } from "../settings/SettingsModal";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { ReportIssueModal } from "./ReportIssueModal";
import { Tooltip } from "./Tooltip";
import { CustomTitleBar } from "../titlebar/CustomTitleBar";

function Layout({ children }) {
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const [showSidebar, setShowSidebar] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [connections, setConnections] = useState([]);
  const [queries, setQueries] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("sidebar-width");
    return saved ? parseInt(saved) : 20;
  });

  const toggleSidebar = useCallback(() => setShowSidebar((prev) => !prev), []);
  const openCommandPalette = useCallback(() => setShowCommandPalette(true), []);
  const openKeyboardShortcuts = useCallback(() => setShowKeyboardShortcuts(true), []);
  const openReportIssue = useCallback(() => setShowReportIssue(true), []);
  const openSettings = useCallback(() => setShowSettings(true), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openCommandPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openCommandPalette]);

  // Handle menu actions
  useEffect(() => {
    window.addEventListener("menu:toggle-sidebar", toggleSidebar);
    window.addEventListener("menu:command-palette", openCommandPalette);
    window.addEventListener("menu:keyboard-shortcuts", openKeyboardShortcuts);
    window.addEventListener("menu:report-issue", openReportIssue);
    window.addEventListener("menu:find", openCommandPalette);
    window.addEventListener("menu:preferences", openSettings);

    return () => {
      window.removeEventListener("menu:toggle-sidebar", toggleSidebar);
      window.removeEventListener("menu:command-palette", openCommandPalette);
      window.removeEventListener("menu:keyboard-shortcuts", openKeyboardShortcuts);
      window.removeEventListener("menu:report-issue", openReportIssue);
      window.removeEventListener("menu:find", openCommandPalette);
      window.removeEventListener("menu:preferences", openSettings);
    };
  }, [toggleSidebar, openCommandPalette, openKeyboardShortcuts, openReportIssue, openSettings]);

  // Memoize recent connections calculation
  const recentConnections = useMemo(() => {
    return connections
      .map((conn) => ({
        id: conn.id,
        name: conn.name,
        lastUsed: localStorage.getItem(`connection_time_${conn.id}`),
      }))
      .filter((conn) => conn.lastUsed)
      .sort((a, b) => parseInt(b.lastUsed) - parseInt(a.lastUsed))
      .slice(0, 5);
  }, [connections]);

  useEffect(() => {
    const savedConnections = JSON.parse(
      localStorage.getItem("db-connections") || "[]",
    );
    const savedQueries = JSON.parse(localStorage.getItem("query-tabs") || "[]");
    setConnections(savedConnections);
    setQueries(savedQueries);
  }, []);

  useEffect(() => {
    // Update recent connections in menu
    if (window.electron?.updateRecentConnections && recentConnections.length > 0) {
      window.electron.updateRecentConnections(recentConnections);
    }
  }, [recentConnections]);

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <CustomTitleBar onToggleSidebar={toggleSidebar} />
      <div className="flex h-full" style={{ height: "calc(100vh - 40px)" }}>
        {showSidebar && (
          <Split
            sizes={[sidebarWidth, 100 - sidebarWidth]}
            minSize={[200, 600]}
            maxSize={[400, Infinity]}
            gutterSize={4}
            onDragEnd={(sizes) => {
              setSidebarWidth(sizes[0]);
              localStorage.setItem("sidebar-width", sizes[0]);
            }}
            className="flex h-full w-full"
          >
            <div>
              <Sidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-end items-center gap-2">
                <NotificationCenter />
                <Tooltip text="Application settings">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <Settings size={20} />
                    <span className="hidden sm:inline text-sm font-medium">
                      Settings
                    </span>
                  </button>
                </Tooltip>
              </header>
              <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
                {children}
              </main>
              <StatusBar />
            </div>
          </Split>
        )}
        {!showSidebar && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-end items-center gap-2">
              <NotificationCenter />
              <Tooltip text="Application settings">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <Settings size={20} />
                  <span className="hidden sm:inline text-sm font-medium">
                    Settings
                  </span>
                </button>
              </Tooltip>
            </header>
            <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
            <StatusBar />
          </div>
        )}
      </div>
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
      <ReportIssueModal
        isOpen={showReportIssue}
        onClose={() => setShowReportIssue(false)}
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        connections={connections}
        queries={queries}
      />
    </div>
  );
}

export default Layout;
