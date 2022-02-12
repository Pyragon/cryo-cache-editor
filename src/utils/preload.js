const { contextBridge, ipcRenderer } = require('electron');

const remote = require('@electron/remote');

contextBridge.exposeInMainWorld('api', {
    remote,
    file: {
        get(path, type, callback) {
            ipcRenderer.send('get-file', {
                path,
                type
            });
            ipcRenderer.on('file:' + type, callback);
        },
        getMany(path, type, callback) {
            ipcRenderer.send('get-many', {
                path,
                type
            });
            ipcRenderer.on('get-many:' + type, callback);
        },
        getNames(path, type, callback) {
            ipcRenderer.send('get-names', {
                path,
                type
            });
            ipcRenderer.on('get-names:' + type, callback);
        },
        getFolder(path, type, callback) {
            ipcRenderer.send('get-folder', {
                path,
                type
            });
            ipcRenderer.on('get-folder:' + type, callback);
        },
        getInterfaces(callback) {
            ipcRenderer.send('get-interfaces', {});
            ipcRenderer.on('get-interfaces', callback);
        },
        save(path, data) {
            ipcRenderer.send('save-file', { path, file: data });
        }
    },
    window: {
        setWidth(width) {
            remote.getCurrentWindow().setSize(width, remote.getCurrentWindow().getSize()[1]);
        },
        setHeight(height) {
            remote.getCurrentWindow().setSize(remote.getCurrentWindow().getSize()[0], height);
        }
    }
});