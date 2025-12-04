
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import isDev from 'electron-is-dev';

// Import backend services (commented out for browser preview)
// import { runRssFetcher } from '../backend/services/rssFetcher';
// import { generateDailyInsights } from '../backend/services/aiInsights';

declare const __dirname: string;

let mainWindow: BrowserWindow | null = null;
let floatingWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Secure this in production!
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#09090b',
      symbolColor: '#ffffff'
    },
    backgroundColor: '#09090b',
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    // mainWindow.webContents.openDevTools();
  }

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    // Also close floating window if main app closes
    if (floatingWindow) floatingWindow.close();
  });
}

function createFloatingWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  
  floatingWindow = new BrowserWindow({
    width: 300,
    height: 100,
    x: 20,
    y: 20,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load a specific route or query param for the floating UI
  const startUrl = isDev
    ? 'http://localhost:3000?mode=floating'
    : `file://${path.join(__dirname, '../build/index.html')}?mode=floating`;

  floatingWindow.loadURL(startUrl);
}

app.on('ready', () => {
  createMainWindow();
  
  // Simulate the "Daily Update" Notification after 5 seconds
  setTimeout(() => {
    // Check if we need to show notification (logic from DB)
    createFloatingWindow();
  }, 5000);
});

app.on('window-all-closed', () => {
  if ((process as any).platform !== 'darwin') {
    app.quit();
  }
});

// --- IPC Handlers ---

ipcMain.handle('app-open-main', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  } else {
    createMainWindow();
  }
  
  if (floatingWindow) {
    floatingWindow.close();
    floatingWindow = null;
  }
});

ipcMain.handle('trigger-daily-fetch', async () => {
  // In real app:
  // await runRssFetcher();
  // const insights = await generateDailyInsights();
  // return insights;
  return { status: 'ok', message: 'Simulated Fetch Complete' };
});