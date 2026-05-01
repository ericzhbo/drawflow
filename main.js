const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let server = null;
const PORT = 5001;

const isDevelopment = process.argv.includes('--dev');

// 单实例锁，防止重复启动
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function getResourcePath(...args) {
  const parts = args.join('/');
  if (app.isPackaged) {
    return __dirname + '/' + parts;
  }
  return path.join(__dirname, ...args);
}

function getUserDataPath(...args) {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, ...args);
}

function clearAllUserData() {
  const userDataPath = app.getPath('userData');
  const dbPath = getUserDataPath('database', 'drawflow.db');
  const outputDir = getUserDataPath('output');

  try {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
    console.log('[Main] 用户数据已清除');
  } catch (err) {
    console.error('[Main] 清除用户数据失败:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    frame: true,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    show: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function startServer() {
  process.env.DRAWFLOW_DB_PATH = getUserDataPath('database', 'drawflow.db');
  process.env.DRAWFLOW_OUTPUT_DIR = getUserDataPath('output');
  process.env.FLASK_PORT = PORT.toString();

  const serverModule = require('./backend/server.js');
  const result = await serverModule.startServer();
  server = result.server;
}

app.whenReady().then(async () => {
  try {
    await startServer();
    createWindow();
  } catch (err) {
    console.error('[Main] 后端服务启动异常:', err);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (server) {
    server.close();
  }
});

// IPC 处理清除数据请求
const { ipcMain } = require('electron');
ipcMain.handle('clear-all-data', async () => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: '清除所有数据',
    message: '确定要清除所有生成记录和图片吗？',
    detail: '此操作不可撤销，所有历史记录将被永久删除。',
    buttons: ['取消', '确定清除'],
    defaultId: 0,
    cancelId: 0
  });

  if (result.response === 1) {
    clearAllUserData();
    if (mainWindow) {
      mainWindow.reload();
    }
    return { success: true };
  }
  return { success: false };
});

// 启动时提示清除数据
ipcMain.handle('prompt-clear-data', async () => {
  const dbPath = process.env.DRAWFLOW_DB_PATH;
  const hasData = fs.existsSync(dbPath);

  if (!hasData) return { shouldClear: false };

  const result = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    title: '发现历史记录',
    message: '检测到之前的生成记录',
    detail: '是否要清除所有历史记录并重新开始？',
    buttons: ['保留记录', '清除所有数据'],
    defaultId: 0,
    cancelId: 0
  });

  if (result.response === 1) {
    clearAllUserData();
    if (mainWindow) {
      mainWindow.reload();
    }
    return { shouldClear: true };
  }
  return { shouldClear: false };
});
