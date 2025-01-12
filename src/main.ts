import { app, BrowserWindow, Menu, shell } from 'electron';
import path from 'path';
import started from 'electron-squirrel-startup';
import { typeCast, V_CONFIG } from './types';
import v_config from './v.config.json'

// console.log('main', process.env)
const V_CONFIG = typeCast<V_CONFIG>(JSON.stringify(v_config))

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon:  '/images/icon.png',
    // title: 'Home',
    // vibrancy: 'under-window',
    // visualEffectState: 'active',
    // titleBarStyle: 'hidden',
    // trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // wjdlz/TODO: handle dotenv file load issue in prod
  // // let app_url = typeCast<AppUrl>(process.env.V_APP_URL)
  // let app_url: AppUrl = {__type: ''}
  // try{
  //   app_url = typeCast<AppUrl>(process.env.V_APP_URL)
  // }catch(error){ /* wjdlz/NOTE: loading offline */ }
  // if(app_url.__type !== 'offline' && app_url[app_url.__type]) {
  //   mainWindow.loadURL(app_url[app_url.__type])
  // } else 

  if (V_CONFIG.V_APP_URL) {
    mainWindow.loadURL(V_CONFIG.V_APP_URL);
  } else if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {// to load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
    : []),
  // { role: 'fileMenu' }
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            { role: 'showSubstitutions' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ]
        : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      // { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      // { role: 'zoom' }, fill, center, enter_full_screen
      // move & resize, full_screen_tile
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'minimize' },
            // { role: 'hide' },
            // { role: 'hideOthers' },
            // { role: 'unhide' },
            { type: 'separator' },
            { role: 'close' }
          ]
        : [
            { role: 'close' }
          ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Help Center',
        click: async () => {
          await shell.openExternal(V_CONFIG.V_HELP_CENTER)
        }
      }
    ]
  }
]

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)