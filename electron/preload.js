const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  leerPdfAuto: (filePath) => ipcRenderer.invoke('leer-pdf-auto', filePath),
  savePdf: (base64Data, fileName) => ipcRenderer.invoke('save-pdf', base64Data, fileName)
});