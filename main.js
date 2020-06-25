const {app, BrowserWindow, Menu, globalShortcut} = require('electron');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow

function createMainWindow(){
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height: 600,
        icon: './assets/icons/Icon_256x256.png',
        backgroundColor: 'orange',
        resizable: isDev
    });
    mainWindow.loadFile('./app/index.html');
}

const menu = [
    ...(isMac ? [{role: 'appMenu'}]:[]),
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

    globalShortcut.register('CmdOrCtrl+R',()=>mainWindow.reload())
    globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I',()=>mainWindow.toggleDevTools());

    mainWindow.on('close', ()=>mainWindow=null);
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