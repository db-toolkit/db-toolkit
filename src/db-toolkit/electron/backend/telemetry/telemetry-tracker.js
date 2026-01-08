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
  trackFeatureUsage(feature, metadata = {}) {
    if (!this.manager.enabled || !this.manager.preferences.featureUsage) return;
    
    this.manager.addEvent({
      type: 'feature_usage',
      feature,
      metadata: this.anonymize(metadata),
      timestamp: Date.now()
    });
  }

  /**
   * Track session start
   */
  trackSessionStart() {
    if (!this.manager.enabled || !this.manager.preferences.sessionDuration) return;
    
    const metadata = {};
    if (this.manager.preferences.systemInfo) {
      metadata.appVersion = this.manager.storage.getAppVersion();
      metadata.os = this.manager.storage.getOSInfo();
    }
    
    this.manager.addEvent({
      type: 'session_start',
      metadata: this.anonymize(metadata),
      timestamp: Date.now()
    });
    this.manager.currentSessionStart = Date.now();
  }

  /**
   * Track session end
   */
  trackSessionEnd() {
    if (!this.manager.enabled || !this.manager.preferences.sessionDuration || !this.manager.currentSessionStart) return;
    
    const duration = Date.now() - this.manager.currentSessionStart;
    this.manager.addEvent({
      type: 'session_end',
      metadata: this.anonymize({ duration }),
      timestamp: Date.now()
    });
    this.manager.currentSessionStart = null;
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
