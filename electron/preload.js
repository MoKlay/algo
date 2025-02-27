import {contextBridge, ipcRenderer} from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    sendData: (data) => ipcRenderer.send('data-from-renderer', data),
    onDataReceived: (callback) => ipcRenderer.on('data-from-main', (_event, data) => callback(data)),
});