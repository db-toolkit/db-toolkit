/**
 * Feature Usage Analytics
 * Tracks feature frequency and usage patterns
 */

class FeatureUsageAnalytics {
  constructor(telemetryManager) {
    this.telemetry = telemetryManager;
    this.features = new Map();
  }

  /**
   * Track when a feature is used
   */
  trackFeature(feature, action = 'use', metadata = {}) {
    this.telemetry.trackFeatureUsage(feature, {
      action,
      sessionTime: Date.now(),
      ...metadata
    });

    // Update local counters
    const current = this.features.get(feature) || { count: 0, actions: {} };
    current.count++;
    current.actions[action] = (current.actions[action] || 0) + 1;
    this.features.set(feature, current);
  }

  /**
   * Track query editor usage
   */
  trackQueryEditor(action, metadata = {}) {
    this.trackFeature('query_editor', action, {
      complexity: metadata.complexity,
      hasAI: metadata.hasAI,
      executionTime: metadata.executionTime
    });
  }

  /**
   * Track analytics page usage
   */
  trackAnalytics(action, metadata = {}) {
    this.trackFeature('analytics', action, {
      timeRange: metadata.timeRange,
      hasQueries: metadata.hasQueries
    });
  }

  /**
   * Track backup operations
   */
  trackBackup(action, metadata = {}) {
    this.trackFeature('backup', action, {
      automated: metadata.automated,
      compressed: metadata.compressed,
      dbType: metadata.dbType
    });
  }

  /**
   * Track workspace operations
   */
  trackWorkspace(action, metadata = {}) {
    this.trackFeature('workspace', action, {
      workspaceCount: metadata.workspaceCount,
      hasConnection: metadata.hasConnection
    });
  }

  /**
   * Get most used features
   */
  getTopFeatures(limit = 10) {
    return Array.from(this.features.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit)
      .map(([feature, data]) => ({
        feature,
        usageCount: data.count,
        topActions: Object.entries(data.actions)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([action, count]) => ({ action, count }))
      }));
  }

  /**
   * Get feature usage summary
   */
  getUsageSummary() {
    const summary = {
      totalFeatures: this.features.size,
      totalUsage: 0,
      categories: {
        editor: 0,
        analytics: 0,
        backup: 0,
        workspace: 0,
        other: 0
      }
    };

    this.features.forEach((data, feature) => {
      summary.totalUsage += data.count;
      
      if (['query_editor', 'schema', 'data_explorer'].includes(feature)) {
        summary.categories.editor += data.count;
      } else if (['analytics', 'performance'].includes(feature)) {
        summary.categories.analytics += data.count;
      } else if (['backup', 'restore'].includes(feature)) {
        summary.categories.backup += data.count;
      } else if (['workspace'].includes(feature)) {
        summary.categories.workspace += data.count;
      } else {
        summary.categories.other += data.count;
      }
    });

    return summary;
  }

  /**
   * Reset tracking data
   */
  reset() {
    this.features.clear();
  }
}

module.exports = { FeatureUsageAnalytics };