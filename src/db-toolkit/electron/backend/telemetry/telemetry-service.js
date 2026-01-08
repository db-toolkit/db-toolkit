/**
 * Main Telemetry Service
 * Orchestrates all telemetry modules
 */

const { TelemetryManager } = require('./telemetry-manager');
const { FeatureUsageAnalytics } = require('./feature-usage-analytics');
const { SessionAnalytics } = require('./session-analytics');
const { DatabaseUsageAnalytics } = require('./database-usage-analytics');

class TelemetryService {
  constructor() {
    this.manager = new TelemetryManager();
    this.features = new FeatureUsageAnalytics(this.manager);
    this.sessions = new SessionAnalytics(this.manager);
    this.databases = new DatabaseUsageAnalytics(this.manager);
    this.initialized = false;
  }

  /**
   * Initialize telemetry service
   */
  async initialize() {
    try {
      const result = await this.manager.initialize();
      this.initialized = result.success;
      
      if (result.enabled) {
        this.sessions.startSession();
        console.log('Telemetry service initialized and enabled');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to initialize telemetry:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enable/disable telemetry
   */
  async setEnabled(enabled) {
    try {
      const result = await this.manager.setEnabled(enabled);
      
      if (enabled && !this.initialized) {
        this.sessions.startSession();
      } else if (!enabled) {
        this.sessions.endSession();
      }
      
      this.initialized = enabled;
      return result;
    } catch (error) {
      console.error('Failed to enable telemetry:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update telemetry preferences
   */
  async setPreferences(preferences) {
    try {
      return await this.manager.setPreferences(preferences);
    } catch (error) {
      console.error('Failed to set telemetry preferences:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Feature usage tracking
   */
  trackFeatureUsage(feature, action, metadata = {}) {
    if (!this.initialized) return;
    this.features.trackFeature(feature, action, metadata);
  }

  trackQueryEditor(action, metadata = {}) {
    if (!this.initialized) return;
    this.features.trackQueryEditor(action, metadata);
  }

  trackAnalytics(action, metadata = {}) {
    if (!this.initialized) return;
    this.features.trackAnalytics(action, metadata);
  }

  trackBackup(action, metadata = {}) {
    if (!this.initialized) return;
    this.features.trackBackup(action, metadata);
  }

  trackWorkspace(action, metadata = {}) {
    if (!this.initialized) return;
    this.features.trackWorkspace(action, metadata);
  }

  /**
   * Database usage tracking
   */
  trackDatabaseConnection(dbType, metadata = {}) {
    if (!this.initialized) return;
    this.databases.trackConnection(dbType, metadata);
  }

  trackDatabaseOperation(dbType, operation, metadata = {}) {
    if (!this.initialized) return;
    this.databases.trackOperation(dbType, operation, metadata);
  }

  trackQuery(dbType, metadata = {}) {
    if (!this.initialized) return;
    this.databases.trackQuery(dbType, metadata);
  }

  /**
   * Session tracking
   */
  getSessionInfo() {
    return this.sessions.getCurrentSession();
  }

  /**
   * Analytics and reporting
   */
  async getTelemetryReport() {
    if (!this.initialized) {
      return { error: 'Telemetry not enabled' };
    }

    try {
      const report = {
        timestamp: Date.now(),
        appVersion: this.manager.getAppVersion(),
        status: this.manager.getStatus(),
        
        // Feature analytics
        features: {
          topUsed: this.features.getTopFeatures(10),
          summary: this.features.getUsageSummary()
        },

        // Session analytics
        sessions: {
          stats: this.sessions.getSessionStats(30),
          peakHours: this.sessions.getPeakUsageHours(30),
          dailyPattern: this.sessions.getDailyPattern(7),
          durationBreakdown: this.sessions.getDurationBreakdown(30)
        },

        // Database analytics
        databases: {
          topTypes: this.databases.getTopDatabaseTypes(5),
          distribution: this.databases.getDistribution(),
          usageStats: this.databases.getUsageStats()
        }
      };

      return report;
    } catch (error) {
      console.error('Failed to generate telemetry report:', error);
      return { error: error.message };
    }
  }

  /**
   * Application lifecycle
   */
  async onAppStart() {
    if (this.initialized) {
      this.sessions.startSession();
    }
  }

  async onAppExit() {
    if (this.initialized) {
      this.sessions.endSession();
      
      // Upload any pending events
      await this.manager.uploadBatch();
    }
  }

  /**
   * Cleanup and reset
   */
  async clearAllData() {
    try {
      await this.manager.clearData();
      this.features.reset();
      this.sessions.clearHistory();
      this.databases.reset();
      
      return { success: true };
    } catch (error) {
      console.error('Failed to clear telemetry data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      ...this.manager.getStatus()
    };
  }
}

// Singleton instance
let telemetryService = null;

module.exports = {
  getTelemetryService: () => {
    if (!telemetryService) {
      telemetryService = new TelemetryService();
    }
    return telemetryService;
  }
};