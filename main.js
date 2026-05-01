const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let server = null;
const PORT = 5001;

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

  // asar 内部的模块直接使用相对路径 require，不需要完整路径
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
