let WS_BASE_URL = 'ws://localhost:8000/ws';

// Get backend port from Electron
if (window.electron?.getBackendPort) {
  window.electron.getBackendPort().then(port => {
    WS_BASE_URL = `ws://localhost:${port}/ws`;
  });
}

export const getWsEndpoint = (endpoint) => {
  return `${WS_BASE_URL}/${endpoint}`;
};

export const WS_ENDPOINTS = {
  get BACKUPS() { return getWsEndpoint('backups'); },
  get TERMINAL() { return getWsEndpoint('terminal'); },
  get MIGRATOR() { return getWsEndpoint('migrator'); },
  get ANALYTICS() { return getWsEndpoint('analytics'); },
};
