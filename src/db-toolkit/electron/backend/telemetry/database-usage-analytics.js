/**
 * Database Usage Analytics
 * Tracks database type usage and patterns
 */

class DatabaseUsageAnalytics {
  constructor(telemetryManager) {
    this.telemetry = telemetryManager;
    this.usage = new Map();
    this.operations = new Map();
  }

  /**
   * Track database connection
   */
  trackConnection(dbType, metadata = {}) {
    this.telemetry.trackDatabaseUsage(dbType, 'connect');
    
    const current = this.usage.get(dbType) || {
      connections: 0,
      queries: 0,
      operations: new Map(),
      lastUsed: null
    };

    current.connections++;
    current.lastUsed = Date.now();
    this.usage.set(dbType, current);
  }

  /**
   * Track database operation
   */
  trackOperation(dbType, operation, metadata = {}) {
    this.telemetry.trackDatabaseUsage(dbType, operation);
    
    const current = this.operations.get(dbType) || new Map();
    const opCount = current.get(operation) || 0;
    current.set(operation, opCount + 1);
    this.operations.set(dbType, current);
  }

  /**
   * Track query execution
   */
  trackQuery(dbType, metadata = {}) {
    this.trackOperation(dbType, 'query', metadata);
    
    const current = this.usage.get(dbType) || {
      connections: 0,
      queries: 0,
      operations: new Map(),
      lastUsed: null
    };

    current.queries++;
    current.lastUsed = Date.now();
    this.usage.set(dbType, current);
  }

  /**
   * Get most used database types
   */
  getTopDatabaseTypes(limit = 5) {
    return Array.from(this.usage.entries())
      .map(([dbType, data]) => ({
        dbType,
        connections: data.connections,
        queries: data.queries,
        operations: Array.from(data.operations.entries())
          .reduce((sum, [_, count]) => sum + count, 0),
        lastUsed: data.lastUsed,
        score: data.connections * 3 + data.queries * 2 // Weight connections higher
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get database type distribution
   */
  getDistribution() {
    const total = Array.from(this.usage.values())
      .reduce((sum, data) => sum + data.connections, 0);

    if (total === 0) {
      return {};
    }

    const distribution = {};
    this.usage.forEach((data, dbType) => {
      distribution[dbType] = {
        count: data.connections,
        percentage: Math.round((data.connections / total) * 100),
        queries: data.queries,
        topOperations: this.getTopOperations(dbType, 3)
      };
    });

    return distribution;
  }

  /**
   * Get top operations for a database type
   */
  getTopOperations(dbType, limit = 5) {
    const operations = this.operations.get(dbType) || new Map();
    return Array.from(operations.entries())
      .map(([op, count]) => ({ operation: op, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get database usage over time
   */
  getUsageTrend(days = 30) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const trend = new Map();

    this.usage.forEach((data, dbType) => {
      if (data.lastUsed && data.lastUsed > cutoff) {
        const day = new Date(data.lastUsed).toLocaleDateString();
        trend.set(day, (trend.get(day) || 0) + 1);
      }
    });

    return Array.from(trend.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Get comprehensive usage statistics
   */
  getUsageStats() {
    const stats = {
      totalConnections: 0,
      totalQueries: 0,
      totalOperations: 0,
      mostUsed: null,
      databaseTypes: 0,
      distribution: this.getDistribution()
    };

    let highestConnections = 0;

    this.usage.forEach((data, dbType) => {
      stats.totalConnections += data.connections;
      stats.totalQueries += data.queries;
      stats.databaseTypes++;
      
      if (data.connections > highestConnections) {
        highestConnections = data.connections;
        stats.mostUsed = dbType;
      }

      const opCount = Array.from(data.operations.values())
        .reduce((sum, count) => sum + count, 0);
      stats.totalOperations += opCount;
    });

    return stats;
  }

  /**
   * Get operation breakdown by database type
   */
  getOperationBreakdown(dbType) {
    const operations = this.operations.get(dbType) || new Map();
    const total = Array.from(operations.values()).reduce((sum, count) => sum + count, 0);

    return {
      total,
      breakdown: Array.from(operations.entries())
        .map(([operation, count]) => ({
          operation,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }))
        .sort((a, b) => b.percentage - a.percentage)
    };
  }

  /**
   * Reset usage data
   */
  reset() {
    this.usage.clear();
    this.operations.clear();
  }
}

module.exports = { DatabaseUsageAnalytics };