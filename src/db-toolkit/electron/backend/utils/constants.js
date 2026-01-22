/**
 * Backend constants.
 */

// API endpoints
const API_ENDPOINTS = {
  TELEMETRY_UPLOAD: 'https://db-toolkit-api.vercel.app/api/telemetry/upload',
  DOWNLOAD_TRACK: 'https://db-toolkit-api.vercel.app/api/downloads/track',
};

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
  API_ENDPOINTS,
  CACHE_TTL,
  QUERY_DEFAULTS,
  CONNECTION_DEFAULTS,
};
