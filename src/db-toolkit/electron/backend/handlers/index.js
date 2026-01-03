/**
 * Register all IPC handlers.
 */

const { registerConnectionHandlers } = require('./connections');
const { registerQueryHandlers } = require('./query');
const { registerSchemaHandlers } = require('./schema');
const { registerSettingsHandlers } = require('./settings');
const { registerDataHandlers } = require('./data');
const { registerExportHandlers } = require('./export');
const { registerDataExplorerHandlers } = require('./data-explorer');
const { registerSessionHandlers } = require('./session');
const { registerAnalyticsHandlers } = require('./analytics');
const { registerBackupHandlers } = require('./backup');
const { registerAnalyticsStreamHandlers } = require('./analytics-stream');
const { registerIssuesHandlers } = require('./issues');
const { registerAIHandlers } = require('./ai');
const { registerMigratorHandlers } = require('./migrator');
const { registerWorkspaceHandlers } = require('./workspace');
const { registerTelemetryHandlers } = require('./telemetry');
const { logger } = require('../utils/logger.js');

function registerAllHandlers() {
  registerConnectionHandlers();
  registerQueryHandlers();
  registerSchemaHandlers();
  registerSettingsHandlers();
  registerDataHandlers();
  registerExportHandlers();
  registerDataExplorerHandlers();
  registerSessionHandlers();
  registerAnalyticsHandlers();
  registerBackupHandlers();
  registerAnalyticsStreamHandlers();
  registerIssuesHandlers();
  registerAIHandlers();
  registerMigratorHandlers();
  registerWorkspaceHandlers();
  registerTelemetryHandlers();
  logger.info('All IPC handlers registered');
}

module.exports = { registerAllHandlers };
