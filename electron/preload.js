const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  leerPdfAuto: (filePath) => ipcRenderer.invoke('leer-pdf-auto', filePath)
});