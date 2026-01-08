/**
 * Telemetry Manager for DB Toolkit
 * Opt-in analytics for product improvement
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class TelemetryManager {
  constructor() {
    this.enabled = false;
    this.preferences = {
      featureUsage: true,
      sessionDuration: true,
      systemInfo: true,
      databaseTypes: true,
      workspaceUsage: true
    };
    this.events = [];
    const baseDir = path.join(require('os').homedir(), '.db-toolkit');
    this.configPath = path.join(baseDir, 'telemetry.json');
    this.dataPath = path.join(baseDir, 'telemetry-data.json');
    this.uploadEndpoint = null; // Will be configured
    this.maxEvents = 100; // Batch size
    this.uploadInterval = 24 * 60 * 60 * 1000; // 24 hours
    this.lastUpload = 0;
  }

  /**
   * Initialize telemetry manager
   */
  async initialize() {
    try {
      const config = await this.loadConfig();
      this.enabled = config.enabled || false;
      this.preferences = config.preferences || this.preferences;
      this.uploadEndpoint = config.endpoint || null;
      this.lastUpload = config.lastUpload || 0;
      
      if (this.enabled) {
        // Load any pending events from separate data file
        const data = await this.loadData();
        this.events = data.pendingEvents || [];
        this.startBatchProcessor();
      }
      
      return { success: true, enabled: this.enabled, preferences: this.preferences };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Enable/disable telemetry
   */
  async setEnabled(enabled) {
    this.enabled = enabled;
    await this.saveConfig();
    
    if (enabled) {
      this.startBatchProcessor();
    } else {
      this.stopBatchProcessor();
    }
    
    return { success: true, enabled };
  }

  /**
   * Update telemetry preferences
   */
  async setPreferences(preferences) {
    this.preferences = { ...this.preferences, ...preferences };
    await this.saveConfig();
    return { success: true, preferences: this.preferences };
  }

  /**
   * Track feature usage event
   */
  trackFeatureUsage(feature, metadata = {}) {
    if (!this.enabled || !this.preferences.featureUsage) return;
    
    const event = {
      type: 'feature_usage',
      feature,
      metadata: this.anonymize(metadata),
      timestamp: Date.now()
    };
    
    this.addEvent(event);
  }

  /**
   * Track session duration
   */
  trackSessionStart() {
    if (!this.enabled || !this.preferences.sessionDuration) return;
    
    const metadata = {};
    if (this.preferences.systemInfo) {
      metadata.appVersion = this.getAppVersion();
      metadata.os = this.getOSInfo();
    }
    
    const event = {
      type: 'session_start',
      metadata: this.anonymize(metadata),
      timestamp: Date.now()
    };
    
    this.addEvent(event);
    this.currentSessionStart = Date.now();
  }

  trackSessionEnd() {
    if (!this.enabled || !this.preferences.sessionDuration || !this.currentSessionStart) return;
    
    const duration = Date.now() - this.currentSessionStart;
    const event = {
      type: 'session_end',
      metadata: this.anonymize({ duration }),
      timestamp: Date.now()
    };
    
    this.addEvent(event);
    this.currentSessionStart = null;
  }

  /**
   * Track database type usage
   */
  trackDatabaseUsage(dbType, operation) {
    if (!this.enabled || !this.preferences.databaseTypes) return;
    
    const event = {
      type: 'database_usage',
      metadata: this.anonymize({ dbType, operation }),
      timestamp: Date.now()
    };
    
    this.addEvent(event);
  }

  /**
   * Track workspace usage patterns
   */
  trackWorkspaceUsage(action, count) {
    if (!this.enabled || !this.preferences.workspaceUsage) return;
    
    const event = {
      type: 'workspace_usage',
      metadata: this.anonymize({ action, count }),
      timestamp: Date.now()
    };
    
    this.addEvent(event);
  }

  /**
   * Add event to queue
   */
  addEvent(event) {
    this.events.push(event);
    
    // Save data periodically (every 10 events) to avoid too frequent writes
    if (this.events.length % 10 === 0) {
      this.saveData();
    }
    
    if (this.events.length >= this.maxEvents) {
      this.uploadBatch();
    }
  }

  /**
   * Anonymize data by removing PII
   */
  anonymize(data) {
    const anonymized = { ...data };
    
    // Remove any potentially identifying information
    const piiFields = ['username', 'password', 'host', 'database', 'email'];
    piiFields.forEach(field => delete anonymized[field]);
    
    // Hash any connection names or identifiers
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

  /**
   * Upload batch of events
   */
  async uploadBatch() {
    if (!this.enabled || !this.uploadEndpoint || this.events.length === 0) {
      return;
    }

    try {
      const batch = {
        events: this.events.slice(),
        timestamp: Date.now(),
        version: this.getAppVersion()
      };

      // For now, log to console - replace with actual upload
      console.log('Telemetry batch ready for upload:', {
        count: batch.events.length,
        types: [...new Set(batch.events.map(e => e.type))]
      });

      // Clear uploaded events
      this.events = [];
      this.lastUpload = Date.now();
      await this.saveConfig();
      await this.saveData();

    } catch (error) {
      console.error('Telemetry upload failed:', error);
    }
  }

  /**
   * Start batch processor
   */
  startBatchProcessor() {
    if (this.uploadTimer) return;
    
    this.uploadTimer = setInterval(() => {
      if (this.events.length > 0) {
        this.uploadBatch();
      }
      
      // Check if scheduled upload is due
      if (Date.now() - this.lastUpload > this.uploadInterval) {
        this.uploadBatch();
      }
    }, 60000); // Check every minute
  }

  /**
   * Stop batch processor
   */
  stopBatchProcessor() {
    if (this.uploadTimer) {
      clearInterval(this.uploadTimer);
      this.uploadTimer = null;
    }
  }

  /**
   * Save configuration (settings only)
   */
  async saveConfig() {
    try {
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });
      
      const config = {
        enabled: this.enabled,
        preferences: this.preferences,
        endpoint: this.uploadEndpoint,
        lastUpload: this.lastUpload
      };
      
      await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Failed to save telemetry config:', error);
    }
  }

  /**
   * Save telemetry data (events only)
   */
  async saveData() {
    try {
      const configDir = path.dirname(this.dataPath);
      await fs.mkdir(configDir, { recursive: true });
      
      const data = {
        pendingEvents: this.events
      };
      
      await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save telemetry data:', error);
    }
  }

  /**
   * Load configuration
   */
  async loadConfig() {
    try {
      const data = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { enabled: false };
    }
  }

  /**
   * Load telemetry data
   */
  async loadData() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { pendingEvents: [] };
    }
  }

  /**
   * Get app version
   */
  getAppVersion() {
    try {
      const packagePath = path.join(__dirname, '../../../package.json');
      const packageJson = JSON.parse(require('fs').readFileSync(packagePath, 'utf8'));
      return packageJson.version || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get OS information
   */
  getOSInfo() {
    const os = require('os');
    return {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release()
    };
  }

  /**
   * Get current telemetry status
   */
  getStatus() {
    return {
      enabled: this.enabled,
      preferences: this.preferences,
      pendingEvents: this.events.length,
      lastUpload: this.lastUpload
    };
  }

  /**
   * Clear all telemetry data
   */
  async clearData() {
    this.events = [];
    this.lastUpload = 0;
    await this.saveConfig();
    await this.saveData();
  }
}

module.exports = { TelemetryManager };