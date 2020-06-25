const {app, BrowserWindow, Menu, ipcMain} = require('electron');

process.env.NODE_ENV = 'development';

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
    
});

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