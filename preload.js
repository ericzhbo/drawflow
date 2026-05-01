const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => '1.0.0',
  getPlatform: () => process.platform,
  clearAllData: () => ipcRenderer.invoke('clear-all-data'),
  promptClearData: () => ipcRenderer.invoke('prompt-clear-data')
});
