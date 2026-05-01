const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => '4.0.0',
  getPlatform: () => process.platform
});
