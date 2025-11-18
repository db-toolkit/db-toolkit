/**
 * Hook for query explain plan analysis
 */
import { useState, useCallback } from 'react';
import { queryAPI } from '../services/api';

export function useExplain(connectionId) {
  const [explainResult, setExplainResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const explainQuery = useCallback(async (query, timeout = 30) => {
    if (!connectionId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await queryAPI.explain(connectionId, {
        query,
        timeout,
      });
      setExplainResult(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [connectionId]);

  const clearExplain = useCallback(() => {
    setExplainResult(null);
    setError(null);
  }, []);

  return {
    explainResult,
    loading,
    error,
    explainQuery,
    clearExplain,
  };
}
