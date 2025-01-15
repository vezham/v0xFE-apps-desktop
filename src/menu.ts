import { app, shell } from 'electron';
import { typeCast, V_CONFIG } from './types';
import v_config from './v.config.json';

// console.log('main', process.env)
const V_CONFIG = typeCast<V_CONFIG>(JSON.stringify(v_config))

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const isMac = process.platform === 'darwin'

const menu_template = [
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
      ...(V_CONFIG.V_IS_DEBUG? [{ role: 'toggleDevTools' }] : []),
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
      // move & resize, full_screen_tile, window_list
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

export { menu_template };

