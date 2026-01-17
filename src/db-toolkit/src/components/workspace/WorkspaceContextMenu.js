import { memo } from 'react';
import { Edit2, Palette, Trash2, X } from 'lucide-react';

export const WorkspaceContextMenu = memo(({ 
  menuRef, 
  menuPosition, 
  workspace,
  workspaces,
  onRename, 
  onChangeColor, 
  onDelete,
  onCloseOthers,
  onCloseAll,
  onClose
}) => {
  return (
    <div
      ref={menuRef}
      className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[150px]"
      style={{ left: menuPosition.x, top: menuPosition.y }}
    >
      <button
        onClick={onRename}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Edit2 size={14} />
        Rename
      </button>
      
      <button
        onClick={onChangeColor}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Palette size={14} />
        Change Color
      </button>

      <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

      <button
        onClick={onCloseOthers}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <X size={14} />
        Close Others
      </button>

      <button
        onClick={onCloseAll}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <X size={14} />
        Close All
      </button>

      <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

      <button
        onClick={onDelete}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Trash2 size={14} />
        Close
      </button>
    </div>
  );
});

WorkspaceContextMenu.displayName = 'WorkspaceContextMenu';
