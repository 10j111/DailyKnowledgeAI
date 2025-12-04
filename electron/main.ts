
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import isDev from 'electron-is-dev';
import { runDailyFetch } from '../backend/services/rssFetcher'; // Now valid

declare const __dirname: string;

let mainWindow: BrowserWindow | null = null;
let floatingWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    show: false, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#121212',
      symbolColor: '#ffffff'
    },
    backgroundColor: '#121212',
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
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

  const startUrl = isDev
    ? 'http://localhost:3000?mode=floating'
    : `file://${path.join(__dirname, '../build/index.html')}?mode=floating`;

  floatingWindow.loadURL(startUrl);
}

// --- Scheduler Logic ---
let fetchInterval: NodeJS.Timeout;

const checkAndRunSchedule = async () => {
  const now = new Date();
  // Simple check: Is it between 8:00 and 8:05 AM? (Run once window)
  if (now.getHours() === 8 && now.getMinutes() < 5) {
     console.log("Auto-triggering Daily Fetch...");
     await performFetchAndNotify();
  }
};

const performFetchAndNotify = async () => {
  try {
    const insights = await runDailyFetch();
    
    // Notify Main Window
    if (mainWindow) {
      mainWindow.webContents.send('daily-update-ready', insights);
    }
    
    // Show Floating Widget
    if (!floatingWindow) {
      createFloatingWindow();
    }
  } catch (error) {
    console.error("Scheduled Fetch Failed:", error);
  }
};

app.on('ready', () => {
  createMainWindow();
  
  // Check schedule every minute
  fetchInterval = setInterval(checkAndRunSchedule, 60 * 1000);
  
  // Also run a check on startup just in case (optional, or manual trigger)
});

app.on('will-quit', () => {
  clearInterval(fetchInterval);
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
  console.log("Manual Fetch Triggered from UI");
  try {
    const insights = await runDailyFetch();
    return { status: 'ok', count: insights.length, data: insights };
  } catch (e: any) {
    return { status: 'error', message: e.message };
  }
});
