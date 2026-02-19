import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Check, Users } from 'lucide-react';
import { Button } from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import { useConfirmDialog } from '../../hooks/common/useConfirmDialog';

export function GroupManagementSidebar({ isOpen, onClose }) {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState('');
  const { dialog, showConfirm, closeDialog } = useConfirmDialog();

  useEffect(() => {
    if (isOpen) {
      loadGroups();
    }
  }, [isOpen]);

  const loadGroups = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('groups:getAll');
      setGroups(result);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      await window.electron.ipcRenderer.invoke('groups:create', newGroupName.trim());
      setNewGroupName('');
      await loadGroups();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group.id);
    setEditName(group.name);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    
    try {
      await window.electron.ipcRenderer.invoke('groups:update', editingGroup, { name: editName.trim() });
      setEditingGroup(null);
      setEditName('');
      await loadGroups();
    } catch (error) {
      console.error('Failed to update group:', error);
    }
  };

  const handleDeleteGroup = async (group) => {
    const confirmed = await showConfirm({
      title: 'Delete Group',
      message: `Delete group "${group.name}"? Connections in this group will become ungrouped.`,
      confirmText: 'Delete'
    });
    
    if (confirmed) {
      try {
        await window.electron.ipcRenderer.invoke('groups:delete', group.id);
        await loadGroups();
      } catch (error) {
        console.error('Failed to delete group:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <div className="w-80 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Connection Groups
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Add new group */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Create New Group
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddGroup()}
                />
                <Button
                  size="sm"
                  onClick={handleAddGroup}
                  disabled={!newGroupName.trim()}
                  className="px-3"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Existing groups */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Existing Groups
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {groups.length}
                </span>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    {editingGroup === group.id ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                          autoFocus
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingGroup(null)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
                          {group.name}
                        </span>
                        <button
                          onClick={() => handleEditGroup(group)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group)}
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {groups.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No groups created yet
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Create your first group to organize connections
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        variant={dialog.variant}
      />
    </>
  );
}
