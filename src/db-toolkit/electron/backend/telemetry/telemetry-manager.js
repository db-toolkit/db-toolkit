/**
 * Telemetry Manager for DB Toolkit
 * Opt-in analytics for product improvement
 */

const { TelemetryStorage } = require('./telemetry-storage');
const { TelemetryTracker } = require('./telemetry-tracker');
const { API_ENDPOINTS } = require('../utils/constants');
const https = require('https');

class TelemetryManager {
  constructor() {
    this.enabled = false;
    this.preferences = {
      featureUsage: true,
      systemInfo: true,
      databaseTypes: true,
      workspaceUsage: true
    };
    this.events = [];
    this.storage = new TelemetryStorage();
    this.tracker = new TelemetryTracker(this);
    this.maxEvents = 100;
    this.uploadInterval = 24 * 60 * 60 * 1000; // 24 hours
    this.lastUpload = 0;
  }

  /**
   * Initialize telemetry manager
   */
  async initialize() {
    try {
      const config = await this.storage.loadConfig();
      this.enabled = config.enabled || false;
      this.preferences = config.preferences || this.preferences;
      this.lastUpload = config.lastUpload || 0;
      
      if (this.enabled) {
        const data = await this.storage.loadData();
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
    await this._saveConfig();
    
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
    await this._saveConfig();
    return { success: true, preferences: this.preferences };
  }

  /**
   * Add event to queue
   */
  addEvent(event) {
    this.events.push(event);
    
    if (this.events.length % 10 === 0) {
      this.storage.saveData(this.events);
    }
    
    if (this.events.length >= this.maxEvents) {
      this.uploadBatch();
    }
  }

  /**
   * Upload batch of events
   */
  async uploadBatch() {
    if (!this.enabled || this.events.length === 0) {
      return;
    }

    try {
      const batch = {
        events: this.events.slice(),
        timestamp: Date.now(),
        version: this.storage.getAppVersion()
      };

      const payload = JSON.stringify(batch);
      const url = new URL(API_ENDPOINTS.TELEMETRY_UPLOAD);

      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            if (res.statusCode === 200) {
              console.log(`Telemetry uploaded: ${batch.events.length} events`);
              resolve();
            } else {
              reject(new Error(`Upload failed: ${res.statusCode}`));
            }
          });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
      });

      this.events = [];
      this.lastUpload = Date.now();
      await this._saveConfig();
      await this.storage.saveData(this.events);
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
      if (Date.now() - this.lastUpload > this.uploadInterval) {
        this.uploadBatch();
      }
    }, 60000);
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
    await this._saveConfig();
    await this.storage.saveData(this.events);
  }

  /**
   * Save config helper
   */
  async _saveConfig() {
    const config = {
      enabled: this.enabled,
      preferences: this.preferences,
      lastUpload: this.lastUpload
    };
    await this.storage.saveConfig(config);
  }

  // Proxy methods to tracker
  trackFeatureUsage(feature, metadata) { this.tracker.trackFeatureUsage(feature, metadata); }
  trackSessionStart() { this.tracker.trackSessionStart(); }
  trackSessionEnd() { this.tracker.trackSessionEnd(); }
  trackDatabaseUsage(dbType, operation) { this.tracker.trackDatabaseUsage(dbType, operation); }
  trackWorkspaceUsage(action, count) { this.tracker.trackWorkspaceUsage(action, count); }
  getAppVersion() { return this.storage.getAppVersion(); }
  getOSInfo() { return this.storage.getOSInfo(); }
}

module.exports = { TelemetryManager };
