import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useBackups(connectionId = null) {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBackups = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const params = connectionId ? { connection_id: connectionId } : {};
      const response = await api.get('/backups', { params });
      setBackups(response.data.backups);
    } catch (err) {
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [connectionId]);

  const createBackup = useCallback(async (data) => {
    try {
      const response = await api.post('/backups', data);
      await fetchBackups();
      return response.data.backup;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchBackups]);

  const restoreBackup = useCallback(async (backupId, targetConnectionId = null, tables = null) => {
    try {
      await api.post(`/backups/${backupId}/restore`, {
        backup_id: backupId,
        target_connection_id: targetConnectionId,
        tables,
      });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const downloadBackup = useCallback(async (backupId, filename) => {
    try {
      const response = await api.get(`/backups/${backupId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteBackup = useCallback(async (backupId) => {
    try {
      await api.delete(`/backups/${backupId}`);
      await fetchBackups();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchBackups]);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  return {
    backups,
    loading,
    error,
    fetchBackups,
    createBackup,
    restoreBackup,
    downloadBackup,
    deleteBackup,
  };
}
