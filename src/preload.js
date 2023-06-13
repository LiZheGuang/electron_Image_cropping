// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
    ImageProcessing: (title) => ipcRenderer.send('image_processing', title),
    ImageOpticy:()=>ipcRenderer.send('image_opticy'),
    getPageloadPath: () => ipcRenderer.sendSync('get-page-path'),
  })

// Image processing.
