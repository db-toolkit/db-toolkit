import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { Button } from '../common/Button';

export function GroupManagementSidebar({ isOpen, onClose }) {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Load groups from localStorage
      const savedGroups = JSON.parse(localStorage.getItem('connection-groups') || '[]');
      setGroups(savedGroups);
    }
  }, [isOpen]);

  const saveGroups = (updatedGroups) => {
    setGroups(updatedGroups);
    localStorage.setItem('connection-groups', JSON.stringify(updatedGroups));
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim()
    };
    
    saveGroups([...groups, newGroup]);
    setNewGroupName('');
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group.id);
    setEditName(group.name);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;
    
    const updatedGroups = groups.map(group =>
      group.id === editingGroup
        ? { ...group, name: editName.trim() }
        : group
    );
    
    saveGroups(updatedGroups);
    setEditingGroup(null);
    setEditName('');
  };

  const handleDeleteGroup = (groupId) => {
    const updatedGroups = groups.filter(group => group.id !== groupId);
    saveGroups(updatedGroups);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/20" onClick={onClose} />
      <div className="w-80 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Manage Groups
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Add new group */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add New Group
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddGroup()}
              />
              <Button
                size="sm"
                onClick={handleAddGroup}
                disabled={!newGroupName.trim()}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          {/* Existing groups */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Existing Groups ({groups.length})
            </label>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  {editingGroup === group.id ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-600 hover:text-green-700 p-1"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingGroup(null)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-900 dark:text-white">
                        {group.name}
                      </span>
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              ))}
              {groups.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No groups created yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
