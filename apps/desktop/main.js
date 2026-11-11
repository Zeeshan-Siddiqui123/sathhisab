const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets/icon.ico'), // Desktop Window Icon
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Agar dev mode me hai toh localhost:5173 load karega, varna live URL/Build load karega
  const startUrl = process.env.ELECTRON_START_URL || 'https://sathhisab.vercel.app';
  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});