// IPC-based event system replacing WebSockets
export const WS_ENDPOINTS = {
  BACKUPS: 'backup:updates',
  TERMINAL: 'terminal:updates', 
  MIGRATOR: 'migrator:updates',
  ANALYTICS: 'analytics:updates',
};

// Mock WebSocket for compatibility
window.WebSocket = class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;
    
    // Simulate connection open
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 100);
  }
  
  send(data) {
    // Handle analytics stream start
    if (this.url.includes('analytics')) {
      const parsed = JSON.parse(data);
      window.electron.ipcRenderer.invoke('analytics:stream:start', parsed.connection_id);
    }
  }
  
  close(code = 1000, reason = '') {
    if (this.onclose) {
      this.onclose({ code, reason });
    }
  }
};
