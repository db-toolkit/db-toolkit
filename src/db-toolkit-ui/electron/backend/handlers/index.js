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
  console.log('All IPC handlers registered');
}

module.exports = { registerAllHandlers };
