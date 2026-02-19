import { useState, useEffect, useCallback } from 'react';

export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electron.ipcRenderer.invoke('groups:getAll');
      setGroups(result);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch groups:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (name) => {
    try {
      const newGroup = await window.electron.ipcRenderer.invoke('groups:create', name);
      setGroups(prev => [...prev, newGroup]);
      return newGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateGroup = useCallback(async (groupId, updates) => {
    try {
      const updatedGroup = await window.electron.ipcRenderer.invoke('groups:update', groupId, updates);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteGroup = useCallback(async (groupId) => {
    try {
      await window.electron.ipcRenderer.invoke('groups:delete', groupId);
      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup
  };
}
