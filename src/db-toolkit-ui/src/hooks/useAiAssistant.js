/**
 * Hook for AI assistant functionality
 */
import { useState } from 'react';
import api from '../services/api';

export function useAiAssistant(connectionId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuery = async (naturalLanguage, schemaContext = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/ai/query/generate', {
        connection_id: connectionId,
        natural_language: naturalLanguage,
        schema_context: schemaContext
      });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to generate query';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeQuery = async (query, executionPlan = null, schemaContext = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/ai/query/optimize', {
        connection_id: connectionId,
        query,
        execution_plan: executionPlan,
        schema_context: schemaContext
      });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to optimize query';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const explainQuery = async (query, schemaContext = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/ai/query/explain', {
        connection_id: connectionId,
        query,
        schema_context: schemaContext
      });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to explain query';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const fixQueryError = async (query, errorMessage, schemaContext = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/ai/query/fix', {
        connection_id: connectionId,
        query,
        error_message: errorMessage,
        schema_context: schemaContext
      });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to fix query';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    generateQuery,
    optimizeQuery,
    explainQuery,
    fixQueryError,
    isLoading,
    error,
    clearError
  };
}