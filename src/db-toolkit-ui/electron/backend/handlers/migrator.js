/**
 * IPC handlers for migrator operations.
 */

const { ipcMain } = require('electron');
const { EventEmitter } = require('events');
const { MigratorExecutor } = require('../operations/migrator-executor');

function registerMigratorHandlers() {
  ipcMain.handle('migrator:execute', async (event, command) => {
    try {
      return await MigratorExecutor.executeCommand(command);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('migrator:version', async () => {
    try {
      return await MigratorExecutor.getVersion();
    } catch (error) {
      return { version: null, installed: false, error: error.message };
    }
  });

  ipcMain.handle('migrator:execute-stream', async (event, command, cwd, dbUrl) => {
    try {
      const streamEmitter = new EventEmitter();
      const streamId = `stream_${Date.now()}`;
      
      streamEmitter.on('stdout', (data) => {
        event.sender.send('migrator:stream', {
          streamId,
          type: 'stdout',
          data
        });
      });

      streamEmitter.on('stderr', (data) => {
        event.sender.send('migrator:stream', {
          streamId,
          type: 'stderr',
          data
        });
      });

      streamEmitter.on('exit', (result) => {
        event.sender.send('migrator:stream', {
          streamId,
          type: 'exit',
          ...result
        });
      });

      streamEmitter.on('error', (error) => {
        event.sender.send('migrator:stream', {
          streamId,
          type: 'error',
          data: error
        });
      });

      await MigratorExecutor.executeCommandStream(command, streamEmitter, cwd, dbUrl);
      
      return { success: true, streamId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}

module.exports = { registerMigratorHandlers };