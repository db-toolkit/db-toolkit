/**
 * Table-level statistics.
 */

async function getTableStatsPostgreSQL(connection) {
  try {
    const query = `
      SELECT 
        schemaname,
        relname as tablename,
        pg_size_pretty(pg_total_relation_size(quote_ident(schemaname)||'.'||quote_ident(relname))) as size,
        pg_total_relation_size(quote_ident(schemaname)||'.'||quote_ident(relname)) as size_bytes,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        seq_scan + idx_scan as total_scans,
        n_live_tup as row_count
      FROM pg_stat_user_tables
      ORDER BY pg_total_relation_size(quote_ident(schemaname)||'.'||quote_ident(relname)) DESC
      LIMIT 20
    `;
    const result = await connection.query(query);
    return result.rows;
  } catch (error) {
    return [];
  }
}

async function getTableStatsMySQL(connection) {
  try {
    const query = `
      SELECT 
        table_schema,
        table_name,
        ROUND((data_length + index_length) / 1024 / 1024, 2) as size_mb,
        (data_length + index_length) as size_bytes,
        table_rows as row_count,
        ROUND(data_length / 1024 / 1024, 2) as data_size_mb,
        ROUND(index_length / 1024 / 1024, 2) as index_size_mb
      FROM information_schema.TABLES
      WHERE table_schema = DATABASE()
      ORDER BY (data_length + index_length) DESC
      LIMIT 20
    `;
    const [rows] = await connection.query(query);
    return rows;
  } catch (error) {
    return [];
  }
}

async function getTableStatsMongoDB(connection) {
  try {
    const collections = await connection.db.listCollections().toArray();
    const stats = [];
    
    for (const coll of collections.slice(0, 20)) {
      try {
        const collStats = await connection.db.command({ collStats: coll.name });
        stats.push({
          collection: coll.name,
          size_bytes: collStats.size || 0,
          row_count: collStats.count || 0,
          index_count: collStats.nindexes || 0,
          avg_obj_size: collStats.avgObjSize || 0
        });
      } catch (err) {}
    }
    
    return stats.sort((a, b) => b.size_bytes - a.size_bytes);
  } catch (error) {
    return [];
  }
}

async function getTableStatsSQLite(connection) {
  try {
    const query = `
      SELECT 
        name as table_name,
        (SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND tbl_name=m.name) as index_count
      FROM sqlite_master m
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
      LIMIT 20
    `;
    const tables = connection.prepare(query).all();
    
    const stats = [];
    for (const table of tables) {
      try {
        const countResult = connection.prepare(`SELECT COUNT(*) as count FROM "${table.table_name}"`).get();
        stats.push({
          table_name: table.table_name,
          row_count: countResult?.count || 0,
          index_count: table.index_count
        });
      } catch (err) {}
    }
    
    return stats;
  } catch (error) {
    return [];
  }
}

module.exports = {
  getTableStatsPostgreSQL,
  getTableStatsMySQL,
  getTableStatsMongoDB,
  getTableStatsSQLite
};
