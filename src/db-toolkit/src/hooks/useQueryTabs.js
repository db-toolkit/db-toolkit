/**
 * Hook for managing query editor tabs
 */
import { useState, useEffect, useCallback } from "react";
import { cacheService } from "../services/indexedDB";

export function useQueryTabs(connectionId, initialQuery = "") {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      name: "Query 1",
      query: initialQuery,
      result: null,
      executionTime: 0,
      error: null,
      chatHistory: [],
      saved: !initialQuery,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const query = activeTab?.query || "";
  const result = activeTab?.result || null;
  const executionTime = activeTab?.executionTime || 0;
  const error = activeTab?.error || null;

  // Load saved tabs from IndexedDB (with localStorage fallback)
  useEffect(() => {
    const loadTabs = async () => {
      try {
        // Try IndexedDB first
        const cached = await cacheService.getQueryTabs(connectionId);
        if (cached) {
          setTabs(cached.tabs);
          setActiveTabId(cached.activeTabId);
          return;
        }

        // Fallback to localStorage
        const saved = localStorage.getItem(`query-tabs-${connectionId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setTabs(parsed.tabs);
          setActiveTabId(parsed.activeTabId);
          // Migrate to IndexedDB
          await cacheService.setQueryTabs(connectionId, parsed);
          localStorage.removeItem(`query-tabs-${connectionId}`);
        }
      } catch (err) {
        console.error("Failed to load saved tabs:", err);
      }
    };
    loadTabs();
  }, [connectionId]);

  // Auto-save tabs to IndexedDB
  useEffect(() => {
    const timer = setTimeout(() => {
      cacheService
        .setQueryTabs(connectionId, { tabs, activeTabId })
        .catch((err) => {
          console.error("Failed to save tabs:", err);
          // Fallback to localStorage
          localStorage.setItem(
            `query-tabs-${connectionId}`,
            JSON.stringify({ tabs, activeTabId }),
          );
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, [tabs, activeTabId, connectionId]);

  const setQuery = useCallback(
    (newQuery) => {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, query: newQuery, error: null, saved: false }
            : t,
        ),
      );
    },
    [activeTabId],
  );

  const updateActiveTab = useCallback(
    (updates) => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, ...updates } : t)),
      );
    },
    [activeTabId],
  );

  const addTab = useCallback(() => {
    const newId = Math.max(...tabs.map((t) => t.id)) + 1;
    setTabs((prev) => [
      ...prev,
      {
        id: newId,
        name: `Query ${newId}`,
        query: "",
        result: null,
        executionTime: 0,
        error: null,
        chatHistory: [],
      },
    ]);
    setActiveTabId(newId);
  }, [tabs]);

  const closeTab = useCallback(
    (id) => {
      if (tabs.length === 1) return;
      const index = tabs.findIndex((t) => t.id === id);
      const newTabs = tabs.filter((t) => t.id !== id);
      setTabs(newTabs);
      if (activeTabId === id) {
        setActiveTabId(newTabs[Math.max(0, index - 1)].id);
      }
    },
    [tabs, activeTabId],
  );

  const renameTab = useCallback((id, newName) => {
    if (newName && newName.trim()) {
      setTabs((prev) =>
        prev.map((t) => (t.id === id ? { ...t, name: newName.trim() } : t)),
      );
      return true;
    }
    return false;
  }, []);

  const closeOtherTabs = useCallback((id) => {
    setTabs((prev) => prev.filter((t) => t.id === id));
    setActiveTabId(id);
  }, []);

  const closeAllTabs = useCallback(() => {
    setTabs([
      {
        id: 1,
        name: "Query 1",
        query: "",
        result: null,
        executionTime: 0,
        error: null,
        chatHistory: [],
        saved: true,
      },
    ]);
    setActiveTabId(1);
  }, []);

  return {
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    activeTab,
    query,
    result,
    executionTime,
    error,
    setQuery,
    updateActiveTab,
    addTab,
    closeTab,
    renameTab,
    closeOtherTabs,
    closeAllTabs,
  };
}
