/**
 * Query Tab Bar Component
 */
import { Plus, X, Edit3 } from "lucide-react";
import { useState } from "react";
import { ContextMenu, useContextMenu } from "../common/ContextMenu";

export function QueryTabBar({
  tabs,
  activeTabId,
  onTabSelect,
  onAddTab,
  onCloseTab,
  onRenameTab,
  onCloseOtherTabs,
  onCloseAllTabs,
  toast,
}) {
  const [editingTabId, setEditingTabId] = useState(null);
  const [editingTabName, setEditingTabName] = useState("");
  const tabContextMenu = useContextMenu();

  const startRenaming = (id, currentName) => {
    setEditingTabId(id);
    setEditingTabName(currentName);
  };

  const finishRenaming = (id) => {
    if (onRenameTab(id, editingTabName)) {
      toast.success("Tab renamed");
    }
    setEditingTabId(null);
    setEditingTabName("");
  };

  const cancelRenaming = () => {
    setEditingTabId(null);
    setEditingTabName("");
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-1 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onTabSelect(tab.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              tabContextMenu.open(e, { tabId: tab.id });
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t cursor-pointer transition ${
              activeTabId === tab.id
                ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {editingTabId === tab.id ? (
              <input
                type="text"
                value={editingTabName}
                onChange={(e) => setEditingTabName(e.target.value)}
                onBlur={() => finishRenaming(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") finishRenaming(tab.id);
                  if (e.key === "Escape") cancelRenaming();
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="text-sm font-medium bg-white dark:bg-gray-900 border border-green-500 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 min-w-[80px]"
              />
            ) : (
              <span className="text-sm font-medium whitespace-nowrap">
                {tab.name}
              </span>
            )}
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="hover:text-red-600 dark:hover:text-red-400"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onAddTab}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
          title="New tab"
        >
          <Plus size={16} />
        </button>
      </div>

      <ContextMenu
        isOpen={tabContextMenu.isOpen}
        position={tabContextMenu.position}
        onClose={tabContextMenu.close}
        items={
          tabContextMenu.data
            ? [
                {
                  label: "Rename Tab",
                  icon: <Edit3 size={16} />,
                  onClick: () => {
                    const tabId = tabContextMenu.data.tabId;
                    const currentName = tabs.find((t) => t.id === tabId)?.name;
                    startRenaming(tabId, currentName);
                  },
                },
                { separator: true },
                {
                  label: "Close Tab",
                  icon: <X size={16} />,
                  onClick: () => onCloseTab(tabContextMenu.data.tabId),
                  disabled: tabs.length === 1,
                },
                {
                  label: "Close Other Tabs",
                  icon: <X size={16} />,
                  onClick: () => onCloseOtherTabs(tabContextMenu.data.tabId),
                  disabled: tabs.length === 1,
                },
                {
                  label: "Close All Tabs",
                  icon: <X size={16} />,
                  danger: true,
                  onClick: () => {
                    if (
                      window.confirm(
                        "Close all tabs? Unsaved changes will be lost.",
                      )
                    ) {
                      onCloseAllTabs();
                      toast.success("All tabs closed");
                    }
                  },
                },
              ]
            : []
        }
      />
    </>
  );
}
