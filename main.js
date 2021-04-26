const path = require('path')
const os = require('os')
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const imagemin = require('imagemin')
const imageminMonzjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const slash = require('slash')
const log = require('electron-log')
//set ENV either to 'production' or 'development'
process.env.NODE_ENV = 'production';
//check desired requirement
const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;
// create main window
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'ImageShrink',
    width: isDev ? 800 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    // icon option is for windows only user.
    resizable: isDev,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

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

// catch the event send from frontend

ipcMain.on('image:minimize', (e, options) => {
  options.dest = path.join(os.homedir(), 'imageshrink-store')
  shrinkImage(options)
})

const shrinkImage = async ({ imgPath, quality, dest }) => {

  try {
    const pngQuality = quality / 100
    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMonzjpeg({ quality }),
        imageminPngquant({
          quality: [pngQuality, pngQuality]
        })
      ]
    })
    log.info(files)
    shell.openPath(dest)
    mainWindow.webContents.send('image:done') // send event to front-end
  } catch (error) {
    log.error(error)
  }
}
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