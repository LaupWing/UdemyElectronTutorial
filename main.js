const path = require('path');
const os = require('os');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const slash = require('slash');
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron');
const log = require('electron-log');

process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow
let aboutWindow

function createMainWindow(){
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height: 600,
        icon: './assets/icons/Icon_256x256.png',
        backgroundColor: 'orange',
        resizable: isDev,
        webPreferences:{
            nodeIntegration: true
        }
    });
    if(isDev){
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile('./app/index.html');
}
function createAboutWindow(){
    aboutWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height: 600,
        icon: './assets/icons/Icon_256x256.png',
        resizable: false
    });
    aboutWindow.loadFile('./app/about.html');
}

const menu = [
    ...(isMac ? [
        {
            label: app.name,
            submenu:[
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }
    ]:[
        {
            label: 'Help',
            submenu:[
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }
    ]),
    {
        role: 'fileMenu'
    },
    ...(isDev ? [
        {
            label: 'Developer',
            submenu:[
                {
                    role: 'reload'
                },
                {
                    role: 'forcereload'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'toggledevtools'
                },
            ]
        }
    ] : [])
]
app.on('ready',()=>{ 
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('close', ()=>mainWindow=null);
});

ipcMain.on('image:minimize', (e, options)=>{
    options.dest = path.join(os.homedir(), 'imageshrink');
    shrinkImage(options);
});

async function shrinkImage({imgPath, quality, dest}){
    try{
        const pngQuality = quality /100;
        const file = await imagemin([slash(imgPath)], {
            destination: dest,
            plugins:[
                imageminMozjpeg({quality}),
                imageminPngquant({
                    quality: [pngQuality, pngQuality]
                })
            ]
        });
        shell.openPath(dest);
        log.info(file);
        mainWindow.webContents.send('image:done');
    }catch(err){
        console.log(err);
        log.error(err);
    }
}

app.on('window-all-closed', ()=>{
    if(!isMac){
        app.quit();
    }
});
app.on('activate', ()=>{
    if(BrowserWindow.getAllWindows().length === 0){
        createMainWindow();
    }
});