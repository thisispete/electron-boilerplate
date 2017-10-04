import { app, BrowserWindow } from 'electron';
import MenuBuilder from './menu.mjs';

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.setMaxListeners(0);

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    // kiosk: true,
    show: true,
    width: 1024,
    height: 728
  });
  mainWindow.loadURL(`file://${__dirname}/build/index.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
