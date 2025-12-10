/**
 * Backend constants.
 */

// Cache TTL (in seconds)
const CACHE_TTL = {
  SCHEMA_TREE: 900,      // 15 minutes
  TABLE_INFO: 600,       // 10 minutes
  QUERY_RESULT: 300,     // 5 minutes
  VALIDATION: 1800,      // 30 minutes
};

// Query defaults
const QUERY_DEFAULTS = {
  TIMEOUT: 30,
  LIMIT: 1000,
  MAX_HISTORY: 100,
};

// Connection defaults
const CONNECTION_DEFAULTS = {
  TIMEOUT: 10,
  RETRY_ATTEMPTS: 3,
};

module.exports = {
  CACHE_TTL,
  QUERY_DEFAULTS,
  CONNECTION_DEFAULTS,
};
