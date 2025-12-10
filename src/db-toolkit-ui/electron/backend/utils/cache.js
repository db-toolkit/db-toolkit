/**
 * Generic cache utility.
 */

class Cache {
  constructor(name = 'default') {
    this.name = name;
    this.cache = new Map();
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key, data, ttl = 600) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl * 1000,
    });
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  getKeys() {
    return Array.from(this.cache.keys());
  }

  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  size() {
    return this.cache.size;
  }
}

// Global cache instances
const schemaCache = new Cache('schema');
const queryCache = new Cache('query');

module.exports = { Cache, schemaCache, queryCache };
