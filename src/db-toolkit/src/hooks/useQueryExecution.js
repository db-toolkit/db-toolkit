/**
 * Hook for executing queries with settings and error handling
 */
import { useCallback } from 'react';

export function useQueryExecution(query, executeQuery, updateActiveTab, clearFixSuggestion, settings) {
  const handleExecute = useCallback(async () => {
    if (!query.trim()) return;
    const startTime = Date.now();
    clearFixSuggestion();
    updateActiveTab({ error: null });

    try {
      const limit = settings?.default_query_limit || 1000;
      const timeout = settings?.default_query_timeout || 30;
      const queryResult = await executeQuery(query, limit, 0, timeout);
      const time = Date.now() - startTime;
      updateActiveTab({
        result: queryResult,
        executionTime: time,
        error: null,
        saved: true,
      });
    } catch (err) {
      console.error("Query failed:", err);
      const errorMsg = err.response?.data?.detail || err.message;
      const time = Date.now() - startTime;
      updateActiveTab({ error: errorMsg, executionTime: time });
    }
  }, [query, clearFixSuggestion, updateActiveTab, settings, executeQuery]);

  return { handleExecute };
}
