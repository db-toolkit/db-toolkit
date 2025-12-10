/**
 * LocalStorage service with TTL support
 */

class LocalStorageService {
  /**
   * Set item in localStorage with TTL
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl) {
    const item = {
      value,
      timestamp: Date.now(),
      ttl,
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('LocalStorage set error:', error);
    }
  }

  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @returns {any|null} - Stored value or null if expired/not found
   */
  get(key) {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      // Check if expired
      if (now - item.timestamp > item.ttl) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage remove error:', error);
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('LocalStorage clear error:', error);
    }
  }

  /**
   * Check if item exists and is not expired
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Get item with connection-specific key
   * @param {string} connectionId - Connection ID
   * @param {string} key - Storage key
   * @returns {any|null}
   */
  getForConnection(connectionId, key) {
    return this.get(`${key}_${connectionId}`);
  }

  /**
   * Set item with connection-specific key
   * @param {string} connectionId - Connection ID
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} ttl - Time to live in milliseconds
   */
  setForConnection(connectionId, key, value, ttl) {
    this.set(`${key}_${connectionId}`, value, ttl);
  }

  /**
   * Remove item with connection-specific key
   * @param {string} connectionId - Connection ID
   * @param {string} key - Storage key
   */
  removeForConnection(connectionId, key) {
    this.remove(`${key}_${connectionId}`);
  }

  /**
   * Clear all cached data for a specific connection
   * @param {string} connectionId - Connection ID
   */
  clearConnection(connectionId) {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes(`_${connectionId}`)) {
        this.remove(key);
      }
    });
  }
}

export const localStorageService = new LocalStorageService();
