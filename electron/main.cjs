const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  const isDev = process.env.VITE_DEV_SERVER_URL;
  const projectRoot = path.join(__dirname, '..');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
    backgroundColor: '#f8fafc',
  });

  mainWindow.show();
  
  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const distPath = path.join(projectRoot, 'dist', 'index.html');
    mainWindow.loadFile(distPath);
  }

  // Enable logging
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log('PDFReader:', message);
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Load error:', errorCode, errorDescription);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

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