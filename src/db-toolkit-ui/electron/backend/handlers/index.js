/**
 * Register all IPC handlers.
 */

const { registerConnectionHandlers } = require('./connections');
const { registerQueryHandlers } = require('./query');
const { registerSchemaHandlers } = require('./schema');
const { registerSettingsHandlers } = require('./settings');
const { registerDataHandlers } = require('./data');
const { registerExportHandlers } = require('./export');

function registerAllHandlers() {
  registerConnectionHandlers();
  registerQueryHandlers();
  registerSchemaHandlers();
  registerSettingsHandlers();
  registerDataHandlers();
  registerExportHandlers();
  console.log('All IPC handlers registered');
}

module.exports = { registerAllHandlers };
