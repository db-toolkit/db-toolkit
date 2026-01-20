/**
 * Global connection store using Zustand
 * Persists active connections across workspace switches
 */
import { create } from 'zustand';

export const useConnectionStore = create((set) => ({
  // Map of page -> connectionId
  activeConnections: {
    query: null,
    analytics: null,
    dataExplorer: null,
  },

  setConnection: (page, connectionId) =>
    set((state) => ({
      activeConnections: {
        ...state.activeConnections,
        [page]: connectionId,
      },
    })),

  clearConnection: (page) =>
    set((state) => ({
      activeConnections: {
        ...state.activeConnections,
        [page]: null,
      },
    })),
}));
