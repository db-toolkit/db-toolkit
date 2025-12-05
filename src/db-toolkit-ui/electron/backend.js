const { app } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let backendProcess = null;
let backendPort = null;

function startBackend() {
  return new Promise((resolve, reject) => {
    const isDev = !app.isPackaged;
    const backendPath = isDev
      ? path.join(__dirname, '../../db-toolkit/dist/db-toolkit-backend/db-toolkit-backend')
      : path.join(process.resourcesPath, 'backend', 'db-toolkit-backend');

    console.log('Starting backend from:', backendPath);
    
    backendProcess = spawn(backendPath, [], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false
    });

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Backend:', output);
      
      const match = output.match(/BACKEND_PORT:(\d+)/);
      if (match) {
        backendPort = parseInt(match[1]);
        const portFile = path.join(app.getPath('userData'), 'backend-port.txt');
        fs.writeFileSync(portFile, backendPort.toString());
        console.log('Backend started on port:', backendPort);
        resolve(backendPort);
      }
    });

    backendProcess.stderr.on('data', (data) => {
      console.error('Backend error:', data.toString());
    });

    backendProcess.on('error', (err) => {
      console.error('Failed to start backend:', err);
      reject(err);
    });

    backendProcess.on('exit', (code) => {
      console.log('Backend exited with code:', code);
      backendProcess = null;
      backendPort = null;
    });
  });
}

function stopBackend() {
  if (backendProcess) {
    console.log('Stopping backend...');
    backendProcess.kill();
    backendProcess = null;
  }
}

function getBackendPort() {
  return backendPort;
}

module.exports = { startBackend, stopBackend, getBackendPort };
