import { useCallback } from 'react';
import { schemaAPI } from '../services/api';
import { useSchemaStore } from '../stores/useSchemaStore';
import { useRequestDeduplication } from './usePerformance';

export function useSchema(connectionId) {
  const schema = useSchemaStore((state) => state.schemas[connectionId] || null);
  const loading = useSchemaStore((state) => !!state.loading[connectionId]);
  const error = useSchemaStore((state) => state.errors[connectionId] || null);
  const fetchSchemaAction = useSchemaStore((state) => state.fetchSchema);

  const { dedupedRequest } = useRequestDeduplication();

  const fetchSchemaTree = useCallback(async (useCache = true, retries = 2) => {
    if (!connectionId) return;

    const requestKey = `schema_${connectionId}_${useCache}`;

    try {
      // We wrap the store action in dedupedRequest to prevent parallel fetches
      // although the store itself could handle this, deduping at hook level is safer for now
      const data = await dedupedRequest(requestKey, () =>
        fetchSchemaAction(connectionId, useCache)
      );
      return data;
    } catch (err) {
      // Retry on connection errors
      if (retries > 0 && err.message && err.message.includes('connection')) {
        console.log(`Retrying schema fetch (${retries} retries left)...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchSchemaTree(false, retries - 1);
      }
      throw err;
    }
  }, [connectionId, dedupedRequest, fetchSchemaAction]);

  const fetchTableInfo = useCallback(async (schemaName, tableName) => {
    if (!connectionId) return;

    // Table info is still transient/local as it's not needed globally yet
    // We could move this to the store if we want to cache table details globally
    const requestKey = `table_${connectionId}_${schemaName}_${tableName}`;

    try {
      const response = await dedupedRequest(requestKey, () =>
        schemaAPI.getTableInfo(connectionId, schemaName, tableName)
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }, [connectionId, dedupedRequest]);

  const refreshSchema = useCallback(async () => {
    if (!connectionId) return;

    try {
      await schemaAPI.refresh(connectionId);
      await fetchSchemaTree(false);
    } catch (err) {
      throw err;
    }
  }, [connectionId, fetchSchemaTree]);

  return {
    schema,
    loading,
    error,
    fetchSchemaTree,
    fetchTableInfo,
    refreshSchema,
  };
}
