/**
 * Register all IPC handlers.
 */

const { registerConnectionHandlers } = require('./connections');
const { registerQueryHandlers } = require('./query');
const { registerSchemaHandlers } = require('./schema');
const { registerSettingsHandlers } = require('./settings');

function registerAllHandlers() {
  registerConnectionHandlers();
  registerQueryHandlers();
  registerSchemaHandlers();
  registerSettingsHandlers();
  console.log('All IPC handlers registered');
}

module.exports = { registerAllHandlers };
