const { app, BrowserWindow, Menu } = require('electron');
//set ENV
process.env.NODE_ENV = 'development';
//check desired requirement
const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;
// create main window
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
// create about window
const createAboutWindow = () => {
  aboutWindow = new BrowserWindow({
    title: 'About ImageShrink',
    width: 300,
    height: 300,
    // icon option is for windows only user.
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: false,
    backgroundColor: 'white'
  })
  aboutWindow.loadFile('./app/about.html')
}

app.on('ready', () => {

  createMainWindow()

  // create menu initialize
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // remove garbage
  mainWindow.on('closed', () => mainWindow = null)
})

// create menu for app
const menu = [

  ...(isMac ? [{
    label: app.name,
    submenu: [{
      label: 'About',
      click: createAboutWindow
    }]
  }] : []),

  {
    role: 'fileMenu',
  },
  // create about menu for windows OS
  ...(!isMac ? [{
    label: 'Help',
    submenu: [{
      label: 'About',
      click: createAboutWindow
    }]
  }] : []),

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