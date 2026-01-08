/**
 * IPC handlers for telemetry operations
 */

const { ipcMain } = require('electron');
const { getTelemetryService } = require('../telemetry/telemetry-service');

function registerTelemetryHandlers() {
    const { logger } = require('../utils/logger');

    /**
     * Initialize telemetry service
     */
    ipcMain.handle('telemetry:initialize', async () => {
        try {
            const service = getTelemetryService();
            const result = await service.initialize();
            
            logger.info(`Telemetry initialized: ${result.enabled ? 'enabled' : 'disabled'}`);
            return result;
        } catch (error) {
            logger.error('Failed to initialize telemetry:', error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Enable/disable telemetry
     */
    ipcMain.handle('telemetry:setEnabled', async (event, enabled) => {
        try {
            const service = getTelemetryService();
            const result = await service.setEnabled(enabled);
            
            logger.info(`Telemetry ${enabled ? 'enabled' : 'disabled'}`);
            return result;
        } catch (error) {
            logger.error('Failed to set telemetry state:', error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Update telemetry preferences
     */
    ipcMain.handle('telemetry:setPreferences', async (event, preferences) => {
        try {
            const service = getTelemetryService();
            const result = await service.setPreferences(preferences);
            
            logger.info('Telemetry preferences updated');
            return result;
        } catch (error) {
            logger.error('Failed to set telemetry preferences:', error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Get telemetry status
     */
    ipcMain.handle('telemetry:getStatus', async () => {
        try {
            const service = getTelemetryService();
            const status = service.getStatus();
            
            return { success: true, status };
        } catch (error) {
            logger.error('Failed to get telemetry status:', error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Track feature usage
     */
    ipcMain.handle('telemetry:trackFeature', async (event, feature, action, metadata = {}) => {
        try {
            const service = getTelemetryService();
            service.trackFeatureUsage(feature, action, metadata);
        } catch (error) {
            logger.error('Failed to track feature usage:', error);
        }
    });

    /**
     * Track database usage
     */
    ipcMain.handle('telemetry:trackDatabase', async (event, dbType, operation, metadata = {}) => {
        try {
            const service = getTelemetryService();
            service.trackDatabaseConnection(dbType, metadata);
            service.trackDatabaseOperation(dbType, operation, metadata);
        } catch (error) {
            logger.error('Failed to track database usage:', error);
        }
    });

    /**
     * Track session events
     */
    ipcMain.handle('telemetry:trackSession', async (event, action, metadata = {}) => {
        try {
            const service = getTelemetryService();
            
            if (action === 'start') {
                service.getSessionInfo() || service.onAppStart();
            } else if (action === 'end') {
                service.onAppExit();
            }
        } catch (error) {
            logger.error('Failed to track session event:', error);
        }
    });

    /**
     * Get telemetry report
     */
    ipcMain.handle('telemetry:getReport', async () => {
        try {
            const service = getTelemetryService();
            const report = await service.getTelemetryReport();
            
            return report;
        } catch (error) {
            logger.error('Failed to get telemetry report:', error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Clear all telemetry data
     */
    ipcMain.handle('telemetry:clear', async () => {
        try {
            const service = getTelemetryService();
            const result = await service.clearAllData();
            
            logger.info('Telemetry data cleared');
            return result;
        } catch (error) {
            logger.error('Failed to clear telemetry data:', error);
            return { success: false, error: error.message };
        }
    });

    /**
     * Handle application lifecycle
     */
    ipcMain.handle('app:before-quit', async () => {
        try {
            const service = getTelemetryService();
            await service.onAppExit();
        } catch (error) {
            logger.error('Failed to handle app exit:', error);
        }
    });

    logger.info('Telemetry IPC handlers registered');
}

module.exports = { registerTelemetryHandlers };