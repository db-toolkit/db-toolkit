/**
 * IndexedDB service for caching AI analysis results
 */
import { INDEXEDDB_CONFIG } from '../utils/constants';

class IndexedDBService {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async init() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(INDEXEDDB_CONFIG.DB_NAME, INDEXEDDB_CONFIG.VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create schema analysis store
        if (!db.objectStoreNames.contains(INDEXEDDB_CONFIG.STORES.SCHEMA_ANALYSIS)) {
          db.createObjectStore(INDEXEDDB_CONFIG.STORES.SCHEMA_ANALYSIS, { keyPath: 'key' });
        }

        // Create table analysis store
        if (!db.objectStoreNames.contains(INDEXEDDB_CONFIG.STORES.TABLE_ANALYSIS)) {
          db.createObjectStore(INDEXEDDB_CONFIG.STORES.TABLE_ANALYSIS, { keyPath: 'key' });
        }

        // Create query tabs store
        if (!db.objectStoreNames.contains(INDEXEDDB_CONFIG.STORES.QUERY_TABS)) {
          db.createObjectStore(INDEXEDDB_CONFIG.STORES.QUERY_TABS, { keyPath: 'key' });
        }

        // Create schema cache store
        if (!db.objectStoreNames.contains(INDEXEDDB_CONFIG.STORES.SCHEMA_CACHE)) {
          db.createObjectStore(INDEXEDDB_CONFIG.STORES.SCHEMA_CACHE, { keyPath: 'key' });
        }

        // Create table info store
        if (!db.objectStoreNames.contains(INDEXEDDB_CONFIG.STORES.TABLE_INFO)) {
          db.createObjectStore(INDEXEDDB_CONFIG.STORES.TABLE_INFO, { keyPath: 'key' });
        }
      };
    });

    return this.initPromise;
  }

  async get(storeName, key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(null);
          return;
        }

        // Check if cache expired
        if (Date.now() > result.expiresAt) {
          this.delete(storeName, key);
          resolve(null);
          return;
        }

        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async set(storeName, key, data) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const record = {
        key,
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + INDEXEDDB_CONFIG.CACHE_DURATION
      };
      const request = store.put(record);

      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async cleanupExpired() {
    await this.init();
    const stores = [
      INDEXEDDB_CONFIG.STORES.SCHEMA_ANALYSIS,
      INDEXEDDB_CONFIG.STORES.TABLE_ANALYSIS,
      INDEXEDDB_CONFIG.STORES.QUERY_TABS,
      INDEXEDDB_CONFIG.STORES.SCHEMA_CACHE,
      INDEXEDDB_CONFIG.STORES.TABLE_INFO
    ];

    for (const storeName of stores) {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (Date.now() > cursor.value.expiresAt) {
            cursor.delete();
          }
          cursor.continue();
        }
      };
    }
  }
}

export const indexedDBService = new IndexedDBService();

// Helper methods for common operations
export const cacheService = {
  // Query tabs
  async getQueryTabs(connectionId) {
    const result = await indexedDBService.get(INDEXEDDB_CONFIG.STORES.QUERY_TABS, connectionId);
    return result?.data || null;
  },
  async setQueryTabs(connectionId, tabs) {
    return indexedDBService.set(INDEXEDDB_CONFIG.STORES.QUERY_TABS, connectionId, tabs);
  },

  // Schema cache
  async getSchema(connectionId) {
    const result = await indexedDBService.get(INDEXEDDB_CONFIG.STORES.SCHEMA_CACHE, connectionId);
    return result?.data || null;
  },
  async setSchema(connectionId, schema) {
    return indexedDBService.set(INDEXEDDB_CONFIG.STORES.SCHEMA_CACHE, connectionId, schema);
  },

  // Table info
  async getTableInfo(connectionId, schema, table) {
    const key = `${connectionId}_${schema}_${table}`;
    const result = await indexedDBService.get(INDEXEDDB_CONFIG.STORES.TABLE_INFO, key);
    return result?.data || null;
  },
  async setTableInfo(connectionId, schema, table, info) {
    const key = `${connectionId}_${schema}_${table}`;
    return indexedDBService.set(INDEXEDDB_CONFIG.STORES.TABLE_INFO, key, info);
  },

  // Clear connection data
  async clearConnection(connectionId) {
    await indexedDBService.delete(INDEXEDDB_CONFIG.STORES.QUERY_TABS, connectionId);
    await indexedDBService.delete(INDEXEDDB_CONFIG.STORES.SCHEMA_CACHE, connectionId);
    // Note: Table info uses composite keys, would need cursor to delete all
  }
};

// Cleanup expired cache on app start
if (typeof window !== 'undefined') {
  indexedDBService.cleanupExpired().catch(console.error);
}
