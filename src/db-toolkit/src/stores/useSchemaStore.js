import { create } from 'zustand';
import { schemaAPI } from '../services/api';

export const useSchemaStore = create((set, get) => ({
    schemas: {}, // Record<ConnectionId, SchemaTree>
    loading: {}, // Record<ConnectionId, boolean>
    errors: {},  // Record<ConnectionId, string | null>

    // Actions
    fetchSchema: async (connectionId, useCache = true) => {
        if (!connectionId) return;

        // Set loading state
        set((state) => ({
            loading: { ...state.loading, [connectionId]: true },
            errors: { ...state.errors, [connectionId]: null },
        }));

        try {
            const response = await schemaAPI.getTree(connectionId, useCache);

            set((state) => ({
                schemas: { ...state.schemas, [connectionId]: response.data },
                loading: { ...state.loading, [connectionId]: false },
            }));

            return response.data;
        } catch (err) {
            set((state) => ({
                loading: { ...state.loading, [connectionId]: false },
                errors: { ...state.errors, [connectionId]: err.message },
            }));
            throw err;
        }
    },

    getSchema: (connectionId) => {
        return get().schemas[connectionId] || null;
    },

    isLoading: (connectionId) => {
        return !!get().loading[connectionId];
    },

    getError: (connectionId) => {
        return get().errors[connectionId] || null;
    }
}));
