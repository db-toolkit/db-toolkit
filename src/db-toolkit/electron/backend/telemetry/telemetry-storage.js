/**
 * Telemetry Storage - File I/O for telemetry config and data
 */

const fs = require('fs').promises;
const path = require('path');

class TelemetryStorage {
  constructor() {
    const baseDir = path.join(require('os').homedir(), '.db-toolkit');
    this.configPath = path.join(baseDir, 'telemetry.json');
    this.dataPath = path.join(baseDir, 'telemetry-data.json');
  }

  /**
   * Save configuration (settings only)
   */
  async saveConfig(config) {
    try {
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Failed to save telemetry config:', error);
    }
  }

  /**
   * Save telemetry data (events only)
   */
  async saveData(events) {
    try {
      const configDir = path.dirname(this.dataPath);
      await fs.mkdir(configDir, { recursive: true });
      const data = { pendingEvents: events };
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
}

module.exports = { TelemetryStorage };
