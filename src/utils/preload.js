const { contextBridge, ipcRenderer } = require('electron');

const remote = require('@electron/remote');
const fs = remote.require('fs/promises');

const UNPACKED_PATH = "D:/workspace/github/cryogen-cache/unpacked"

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
        async getImage(path) {
            let image = (await fs.readFile(UNPACKED_PATH + path)).toString('base64');
            return `data:image/png;base64,${image}`;
        },
        getPromise(path, type) {
            return new Promise((resolve, reject) => {
                ipcRenderer.send('get-file', {
                    path,
                    type
                });
                ipcRenderer.once('file:' + type, (_, data) => {
                    resolve(data);
                });
            });
        },
        getRaw(path, type) {
            return new Promise((resolve, reject) => {
                ipcRenderer.send('get-raw', {
                    path,
                    type
                });
                ipcRenderer.once('raw:' + type, (_, data) => {
                    resolve(data);
                });
            });
        },
        getMany(path, type, callback) {
            ipcRenderer.send('get-many', {
                path,
                type
            });
            ipcRenderer.on('get-many:' + type, callback);
        },
        getAll(path, type, callback) {
            ipcRenderer.send('get-all', {
                path,
                type
            });
            ipcRenderer.on('get-all:' + type, callback);
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