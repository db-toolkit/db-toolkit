import { useState, useCallback } from 'react';
import { dataAPI } from '../../services/api';

export function useData(connectionId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRow = useCallback(async (table, schema, primaryKey, changes) => {
    if (!connectionId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await dataAPI.updateRow(connectionId, {
        table,
        schema,
        primary_key: primaryKey,
        changes,
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [connectionId]);

  const insertRow = useCallback(async (table, schema, data) => {
    if (!connectionId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await dataAPI.insertRow(connectionId, {
        table,
        schema,
        data,
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [connectionId]);

  const deleteRow = useCallback(async (table, schema, primaryKey) => {
    if (!connectionId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await dataAPI.deleteRow(connectionId, {
        table,
        schema,
        primary_key: primaryKey,
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [connectionId]);

  return {
    loading,
    error,
    updateRow,
    insertRow,
    deleteRow,
  };
}
