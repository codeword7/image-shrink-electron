const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
//set ENV
process.env.NODE_ENV = 'development';
//check desired requirement
const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'ImageShrink',
    width: 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    // icon option is for windows only user.
    resizable: isDev,
    backgroundColor: 'white'
  })
  mainWindow.loadFile('./app/index.html')
}

app.on('ready', () => {

  createMainWindow()

  // create menu initialize
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // add global shorcut
  globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
  globalShortcut.register(isMac ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', () => mainWindow.toggleDevTools())
  // remove garbage
  mainWindow.on('closed', () => mainWindow = null)
})

// create menu for app
const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  ...(isDev
    ? [
      {
        label: 'Developer',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { type: 'separator' },
          { role: 'toggledevtools' },
        ],
      },
    ]
    : []),
];

// default behaviour of macOS
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})
// check instance of active app
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})