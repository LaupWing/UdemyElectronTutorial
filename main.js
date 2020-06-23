const {app, BrowserWindow} = require('electron');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;

let mainWindow

function createMainWindow(){
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height: 600,
        icon: './assets/icons/Icon_256x256.png'
    });

    mainWindow.loadFile('./app/index.html');
}

app.on('ready', createMainWindow);