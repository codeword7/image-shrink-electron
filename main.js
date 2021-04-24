const { app, BrowserWindow } = require('electron');
let mainWindow;
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'ImageShrink',
    width: 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    // icon option is for windows only user.
  })
  mainWindow.loadFile('./app/index.html')
}

app.on('ready', createMainWindow)