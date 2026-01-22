/**
 * Telemetry Tracker - Event tracking and anonymization
 */

const crypto = require('crypto');

class TelemetryTracker {
  constructor(manager) {
    this.manager = manager;
  }

  /**
   * Track feature usage event
   */
  trackFeatureUsage(feature, action, metadata = {}) {
    if (!this.manager.enabled || !this.manager.preferences.featureUsage) return;
    
    this.manager.addEvent({
      type: 'feature_usage',
      feature,
      metadata: this.anonymize({ action, ...metadata }),
      timestamp: Date.now()
    });
  }

  /**
   * Track database type usage
   */
  trackDatabaseUsage(dbType, operation) {
    if (!this.manager.enabled || !this.manager.preferences.databaseTypes) return;
    
    this.manager.addEvent({
      type: 'database_usage',
      metadata: this.anonymize({ dbType, operation }),
      timestamp: Date.now()
    });
  }

  /**
   * Track workspace usage patterns
   */
  trackWorkspaceUsage(action, count) {
    if (!this.manager.enabled || !this.manager.preferences.workspaceUsage) return;
    
    this.manager.addEvent({
      type: 'workspace_usage',
      metadata: this.anonymize({ action, count }),
      timestamp: Date.now()
    });
  }

  /**
   * Anonymize data by removing PII
   */
  anonymize(data) {
    const anonymized = { ...data };
    
    const piiFields = ['username', 'password', 'host', 'database', 'email'];
    piiFields.forEach(field => delete anonymized[field]);
    
    if (anonymized.connectionName) {
      anonymized.connectionHash = crypto
        .createHash('sha256')
        .update(anonymized.connectionName)
        .digest('hex')
        .substring(0, 8);
      delete anonymized.connectionName;
    }
    
    return anonymized;
  }
}

module.exports = { TelemetryTracker };
