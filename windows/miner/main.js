const { app, BrowserWindow, shell } = require('electron');

const APP_URL = 'https://galaxium-quantum-core.base44.app/';

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'Galaxium Miner',
    backgroundColor: '#070b12',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.loadURL(APP_URL);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());