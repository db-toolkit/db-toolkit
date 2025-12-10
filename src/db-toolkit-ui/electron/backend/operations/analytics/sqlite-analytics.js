/**
 * SQLite-specific analytics operations.
 */

const fs = require('fs').promises;

async function getSQLiteAnalytics(connection, dbPath = null) {
  try {
    let dbSize = 0;
    if (dbPath) {
      try {
        const stats = await fs.stat(dbPath);
        dbSize = stats.size;
      } catch (err) {}
    }

    let sqliteStats = {};
    try {
      const tableCountResult = connection.prepare(
        "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'"
      ).get();
      const tableCount = tableCountResult?.count || 0;

      const indexCountResult = connection.prepare(
        "SELECT COUNT(*) as count FROM sqlite_master WHERE type='index'"
      ).get();
      const indexCount = indexCountResult?.count || 0;

      const pageCount = connection.pragma('page_count', { simple: true }) || 0;
      const pageSize = connection.pragma('page_size', { simple: true }) || 0;
      const calculatedSize = pageCount * pageSize;

      const largestTables = connection.prepare(`
        SELECT name, 
               (SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND tbl_name=m.name) as index_count
        FROM sqlite_master m
        WHERE type='table'
        ORDER BY name
        LIMIT 10
      `).all();

      sqliteStats = {
        table_count: tableCount,
        index_count: indexCount,
        page_count: pageCount,
        page_size: pageSize,
        calculated_size: calculatedSize,
        largest_tables: largestTables
      };
    } catch (err) {}

    return {
      success: true,
      current_queries: [],
      idle_connections: 0,
      long_running_queries: [],
      blocked_queries: [],
      database_size: dbSize,
      active_connections: 1,
      query_stats: { SELECT: 0, INSERT: 0, UPDATE: 0, DELETE: 0, OTHER: 0 },
      sqlite_stats: sqliteStats,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { getSQLiteAnalytics };
