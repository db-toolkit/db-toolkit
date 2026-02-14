/**
 * Database analytics and monitoring operations.
 */

const { getPostgreSQLAnalytics } = require('./analytics/postgresql-analytics');
const { getMySQLAnalytics } = require('./analytics/mysql-analytics');
const { getSQLiteAnalytics } = require('./analytics/sqlite-analytics');
const { getMongoDBAnalytics } = require('./analytics/mongodb-analytics');
const { logSlowQuery, getSlowQueries } = require('./analytics/slow-query-log');
const { getTableStatsPostgreSQL, getTableStatsMySQL, getTableStatsSQLite, getTableStatsMongoDB } = require('./analytics/table-stats');
const { generateAnalyticsPDF } = require('./analytics/pdf-export');

const historicalMetrics = new Map();

class AnalyticsManager {
  constructor(connection) {
    this.connection = connection;
  }

  async getAnalytics(config, connectionId) {
    const dbType = config.db_type || config.type;
    let result;

    if (dbType === 'postgresql') {
      result = await getPostgreSQLAnalytics(this.connection);
    } else if (dbType === 'mysql' || dbType === 'mariadb') {
      result = await getMySQLAnalytics(this.connection);
    } else if (dbType === 'mongodb') {
      result = await getMongoDBAnalytics(this.connection);
    } else if (dbType === 'sqlite') {
      result = await getSQLiteAnalytics(this.connection, config.database);
    } else {
      return { error: 'Unsupported database type' };
    }

    if (result.success) {
      this._storeHistoricalData(connectionId, result);
      
      for (const query of result.long_running_queries || []) {
        logSlowQuery(connectionId, query.query, query.duration, query.usename);
      }
    }

    return result;
  }

  _storeHistoricalData(connectionId, data) {
    const key = `conn_${connectionId}`;
    
    if (!historicalMetrics.has(key)) {
      historicalMetrics.set(key, []);
    }

    historicalMetrics.get(key).push({
      timestamp: new Date().toISOString(),
      connections: data.active_connections,
      idle_connections: data.idle_connections,
      database_size: data.database_size
    });

    const cutoff = Date.now() - (3 * 60 * 60 * 1000);
    historicalMetrics.set(key, historicalMetrics.get(key).filter(m =>
      new Date(m.timestamp).getTime() > cutoff
    ));
  }

  getHistoricalData(connectionId, hours = 3) {
    const key = `conn_${connectionId}`;
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    
    return (historicalMetrics.get(key) || []).filter(m =>
      new Date(m.timestamp).getTime() > cutoff
    );
  }

  getSlowQueryLog(connectionId, hours = 24) {
    return getSlowQueries(connectionId, hours);
  }

  async getTableStatistics(config) {
    const dbType = config.db_type || config.type;

    if (dbType === 'postgresql') {
      return await getTableStatsPostgreSQL(this.connection);
    } else if (dbType === 'mysql' || dbType === 'mariadb') {
      return await getTableStatsMySQL(this.connection);
    } else if (dbType === 'mongodb') {
      return await getTableStatsMongoDB(this.connection);
    } else if (dbType === 'sqlite') {
      return await getTableStatsSQLite(this.connection);
    }
    return [];
  }

  async exportToPDF(connectionId, connectionName, config) {
    let metrics = await this.getAnalytics(config, connectionId);
    
    if (!metrics.success) {
      metrics = {
        success: true,
        active_connections: 1,
        idle_connections: 0,
        database_size: 0,
        query_stats: { SELECT: 0, INSERT: 0, UPDATE: 0, DELETE: 0, OTHER: 0 },
        current_queries: [],
        long_running_queries: [],
        blocked_queries: []
      };
    }

    const historical = this.getHistoricalData(connectionId, 3);
    const slowQueries = this.getSlowQueryLog(connectionId, 24);
    const tableStats = await this.getTableStatistics(config);

    return await generateAnalyticsPDF(connectionName, metrics, historical, slowQueries, tableStats);
  }

  async getQueryPlan(query, config) {
    const dbType = config.db_type || config.type;

    try {
      if (dbType === 'postgresql') {
        const result = await this.connection.query(`EXPLAIN (FORMAT JSON, ANALYZE) ${query}`);
        return { success: true, plan: result.rows[0]['QUERY PLAN'] };
      } else if (dbType === 'mysql') {
        const [rows] = await this.connection.query(`EXPLAIN FORMAT=JSON ${query}`);
        return { success: true, plan: rows[0].EXPLAIN };
      }
      return { success: false, error: 'Query plan not supported for this database' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async killQuery(pid, config) {
    const dbType = config.db_type || config.type;

    try {
      if (dbType === 'postgresql') {
        await this.connection.query(`SELECT pg_terminate_backend(${pid})`);
      } else if (dbType === 'mysql') {
        await this.connection.query(`KILL ${pid}`);
      } else if (dbType === 'mongodb') {
        await this.connection.db.admin().command({ killOp: 1, op: pid });
      } else {
        return { success: false, error: 'Unsupported database type' };
      }
      return { success: true, message: `Query ${pid} terminated` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = { AnalyticsManager };
