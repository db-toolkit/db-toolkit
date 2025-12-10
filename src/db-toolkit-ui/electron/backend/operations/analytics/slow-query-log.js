/**
 * Slow query log management.
 */

const slowQueryLog = new Map();

function logSlowQuery(connectionId, query, duration, user = 'unknown') {
  const key = `conn_${connectionId}`;
  
  if (!slowQueryLog.has(key)) {
    slowQueryLog.set(key, []);
  }
  
  slowQueryLog.get(key).push({
    timestamp: new Date().toISOString(),
    query,
    duration,
    user
  });
  
  const cutoff = Date.now() - (24 * 60 * 60 * 1000);
  slowQueryLog.set(key, slowQueryLog.get(key).filter(q => 
    new Date(q.timestamp).getTime() > cutoff
  ));
}

function getSlowQueries(connectionId, hours = 24) {
  const key = `conn_${connectionId}`;
  const cutoff = Date.now() - (hours * 60 * 60 * 1000);
  
  return (slowQueryLog.get(key) || []).filter(q => 
    new Date(q.timestamp).getTime() > cutoff
  );
}

function clearSlowQueries(connectionId) {
  const key = `conn_${connectionId}`;
  slowQueryLog.set(key, []);
}

module.exports = { logSlowQuery, getSlowQueries, clearSlowQueries };
