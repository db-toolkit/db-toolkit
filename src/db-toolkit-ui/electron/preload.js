const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getSystemMetrics: () => ipcRenderer.invoke('get-system-metrics'),
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action));
  },
  removeMenuActionListener: () => {
    ipcRenderer.removeAllListeners('menu-action');
  },
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
  }
});
