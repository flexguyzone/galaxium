const { app, BrowserWindow, shell } = require('electron');

const APP_URL = 'https://galaxium-quantum-core.base44.app/wallet';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 900,
    minHeight: 640,
    title: 'Galaxium Wallet',
    backgroundColor: '#070b12',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.loadURL(APP_URL);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());