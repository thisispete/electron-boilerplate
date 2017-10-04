import { app, Menu } from 'electron';

class MenuBuilder {
  constructor(window) {
    this.mainWindow = window;
  }

  buildMenu() {
    this.setupDevelopmentEnvironment();

    let template;

    if (process.platform === 'darwin') {
      template = this.buildDarwinTemplate();
    } else {
      template = this.buildDefaultTemplate();
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click: () => {
          this.mainWindow.inspectElement(x, y);
        }
      }]).popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    const appMenu = {
      label: 'Time For Pie!',
      submenu: [
        { label: 'Quit', accelerator: 'Command+Q', click: () => { app.quit(); } }
      ]
    };
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'Command+R', click: () => { this.mainWindow.webContents.reload(); } },
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } },
        { label: 'Toggle Developer Tools', accelerator: 'Alt+Command+I', click: () => { this.mainWindow.toggleDevTools(); } }
      ]
    };
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } }
      ]
    };

    const subMenuView = process.env.NODE_ENV === 'development'
      ? subMenuViewDev
      : subMenuViewProd;

    return [appMenu, subMenuView];
  }

  buildDefaultTemplate() {
    const appMenu = {
      label: 'Time For Pie!',
      submenu: [
        { label: 'Quit', accelerator: 'Command+Q', click: () => { app.quit(); } }
      ]
    };
    const subMenuViewDev = {
      label: '&View',
      submenu: [
        { label: '&Reload', accelerator: 'Ctrl+R', click: () => { this.mainWindow.webContents.reload(); } },
        { label: 'Toggle &Full Screen', accelerator: 'F11', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } },
        { label: 'Toggle &Developer Tools', accelerator: 'Alt+Ctrl+I', click: () => { this.mainWindow.toggleDevTools(); } }
      ]
    };
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        { label: 'Toggle &Full Screen', accelerator: 'F11', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } },
        { label: 'Toggle &Developer Tools', accelerator: 'Alt+Ctrl+I', click: () => { this.mainWindow.toggleDevTools(); } }
      ]
    };

    const subMenuView = process.env.NODE_ENV === 'development'
      ? subMenuViewDev
      : subMenuViewProd;

    return [appMenu, subMenuView];
  }
}

export default MenuBuilder;
