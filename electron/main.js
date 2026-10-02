const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Where the Galaxium web app is hosted. Update after publishing,
// or set the GALAXIUM_APP_URL environment variable.
const APP_URL = process.env.GALAXIUM_APP_URL || 'https://galaxium-quantum-core.base44.app';

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'Galaxium',
    backgroundColor: '#070b12',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Open external links (like payment or OAuth popups) in the default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.loadURL(APP_URL);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});