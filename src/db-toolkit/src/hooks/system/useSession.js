import { useState, useCallback } from 'react';
import { sessionAPI } from '../services/api';

export function useSession() {
  const [sessionState, setSessionState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessionState = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await sessionAPI.getState();
      setSessionState(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = useCallback(async (lastActive = null) => {
    try {
      const response = await sessionAPI.save(lastActive);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await sessionAPI.restore();
      await fetchSessionState();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSessionState]);

  const clearSession = useCallback(async () => {
    try {
      const response = await sessionAPI.clear();
      setSessionState(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    sessionState,
    loading,
    error,
    fetchSessionState,
    saveSession,
    restoreSession,
    clearSession,
  };
}
