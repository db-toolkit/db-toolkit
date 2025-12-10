/**
 * Migrator CLI command executor.
 */

const { spawn } = require('child_process');
const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);

class MigratorExecutor {
  static _migratorPath = null;

  static async getMigratorPath() {
    if (this._migratorPath === null) {
      try {
        const { stdout } = await execAsync('which migrator');
        this._migratorPath = stdout.trim();
      } catch (error) {
        throw new Error('migrator binary not found in PATH');
      }
    }
    return this._migratorPath;
  }

  static async executeCommand(command, timeout = 10000) {
    try {
      const migratorPath = await this.getMigratorPath();
      const args = command.split(' ');
      
      return new Promise((resolve) => {
        const process = spawn(migratorPath, args);
        let stdout = '';
        let stderr = '';
        
        const timer = setTimeout(() => {
          process.kill();
          resolve({
            success: false,
            output: '',
            error: 'Command timed out',
            exit_code: -1
          });
        }, timeout);

        process.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        process.on('close', (code) => {
          clearTimeout(timer);
          resolve({
            success: code === 0,
            output: stdout,
            error: stderr,
            exit_code: code
          });
        });
      });
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error.message,
        exit_code: -1
      };
    }
  }

  static async executeCommandStream(command, eventEmitter, cwd = null, dbUrl = null) {
    try {
      const migratorPath = await this.getMigratorPath();
      const args = command.split(' ');
      
      const options = { cwd };
      if (dbUrl) {
        options.env = { ...process.env, DATABASE_URL: dbUrl };
      }

      const process = spawn(migratorPath, args, options);

      process.stdout.on('data', (data) => {
        eventEmitter.emit('stdout', data.toString().trim());
      });

      process.stderr.on('data', (data) => {
        eventEmitter.emit('stderr', data.toString().trim());
      });

      process.on('close', (code) => {
        eventEmitter.emit('exit', {
          code,
          success: code === 0
        });
      });

      process.on('error', (error) => {
        eventEmitter.emit('error', error.message);
      });

    } catch (error) {
      eventEmitter.emit('error', error.message);
    }
  }

  static async getVersion() {
    try {
      const migratorPath = await this.getMigratorPath();
      
      return new Promise((resolve) => {
        const process = spawn(migratorPath, ['--version']);
        let stdout = '';
        
        const timer = setTimeout(() => {
          process.kill();
          resolve({ version: null, installed: false });
        }, 3000);

        process.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        process.on('close', (code) => {
          clearTimeout(timer);
          resolve({
            version: stdout.trim(),
            installed: code === 0
          });
        });
      });
    } catch (error) {
      return { version: null, installed: false };
    }
  }
}

module.exports = { MigratorExecutor };