// Memu
// context Menu
const {remote} = nodeRequire('electron');
const {Menu, MenuItem} = remote;

const contextMenu = new Menu();
contextMenu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked'); } }));
contextMenu.append(new MenuItem({ type: 'separator' }));
contextMenu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true, click(e) { console.log('item 2 clicked. args = %O', args); } }));

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  contextMenu.popup(remote.getCurrentWindow());
}, false);

// Application Menu
const template = [{
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
      label: 'Redo',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    }, {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }]
}, {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click(item, focusedWindow) {
        if (focusedWindow) focusedWindow.reload();
      }
    }, {
        label: 'Toggle Full Screen',
        accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
        click(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.webContents.toggleDevTools();
        }
      }]
  }, {
    label: 'Window',
    role: 'window',
    submenu: [{
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }, {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }]
  }, {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: 'Learn More',
      click() { require('electron').shell.openExternal('http://electron.atom.io'); }
    }]
  }];

if (process.platform === 'darwin') {
  const app = require('electron').remote.app;
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [{
      label: 'About ' + name,
      role: 'about'
    }, {
        type: 'separator'
      }, {
        label: 'Services',
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      }, {
        label: 'Show All',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      }]
  });
  // Window menu.
  template[3].submenu.push({
    type: 'separator'
  }, {
      label: 'Bring All to Front',
      role: 'front'
    });
}

const appMenu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(appMenu);