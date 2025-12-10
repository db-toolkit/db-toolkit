/**
 * MongoDB-specific analytics operations.
 */

async function getMongoDBAnalytics(connection) {
  try {
    const currentOps = await connection.db.admin().command({ currentOp: 1, $all: true });
    
    const currentQueries = [];
    const queryStats = { find: 0, insert: 0, update: 0, delete: 0, other: 0 };
    
    for (const op of currentOps.inprog || []) {
      const opType = op.op || 'none';
      if (opType === 'none' || opType === 'getmore') continue;
      
      let queryType = 'other';
      if (opType === 'query' || opType === 'find') queryType = 'find';
      else if (opType === 'insert') queryType = 'insert';
      else if (opType === 'update') queryType = 'update';
      else if (opType === 'remove' || opType === 'delete') queryType = 'delete';
      
      queryStats[queryType]++;
      
      currentQueries.push({
        pid: op.opid || '',
        usename: op.client || '',
        state: opType,
        query: JSON.stringify(op.command || {}),
        duration: op.secs_running || 0,
        query_type: queryType.toUpperCase()
      });
    }
    
    const longRunning = currentQueries.filter(q => q.duration > 30).slice(0, 20);
    
    const serverStatus = await connection.db.admin().command({ serverStatus: 1 });
    const dbStats = await connection.db.stats();
    
    const dbSize = (dbStats.dataSize || 0) + (dbStats.indexSize || 0);
    const activeConnections = serverStatus.connections?.current || 0;
    const idleConnections = Math.max(0, (serverStatus.connections?.available || 0) - activeConnections);
    
    const blockedQueries = [];
    for (const op of currentOps.inprog || []) {
      if (op.waitingForLock) {
        blockedQueries.push({
          blocked_pid: op.opid || '',
          blocked_user: op.client || '',
          blocked_query: JSON.stringify(op.command || {}),
          blocking_pid: 'N/A',
          blocking_user: 'N/A',
          blocking_query: 'Lock wait'
        });
      }
    }
    
    return {
      success: true,
      current_queries: currentQueries.slice(0, 50),
      idle_connections: idleConnections,
      long_running_queries: longRunning,
      blocked_queries: blockedQueries.slice(0, 20),
      database_size: dbSize,
      active_connections: activeConnections,
      query_stats: { FIND: queryStats.find, INSERT: queryStats.insert, UPDATE: queryStats.update, DELETE: queryStats.delete, OTHER: queryStats.other },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { getMongoDBAnalytics };
