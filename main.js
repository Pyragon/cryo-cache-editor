const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const WindowState = require('electron-window-state');
const fs = require('fs/promises');

const props = require('./data/props.json');
const interfaceNames = require('./data/interface-names.json');

function createWindow() {

    let windowState = WindowState({
        defaultWidth: 800,
        defaultHeight: 600
    });

    let window = new BrowserWindow({
        width: 800,
        height: 600,
        x: windowState.x,
        y: windowState.y,
        resizable: true,
        frame: false,
        backgroundThrottling: false,
        transparent: true,
        title: 'Cryogen Cache Editor',
        icon: path.join(__dirname, './public/images/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'src', 'utils', 'preload.js'),
        }
    });

    window.loadFile('./public/index.html');
    window.webContents.openDevTools({ mode: 'detach' });

    let remoteMain = require('@electron/remote/main');
    remoteMain.initialize();
    remoteMain.enable(window.webContents);

    ipcMain.on('window:set-width', (_, data) => window.setSize(data.width, window.getSize()[1]));

    ipcMain.on('get-file', async(_, data) => {
        let filePath = props.UNPACKED_PATH + data.path;
        try {
            let stats = await fs.lstat(filePath);
            if (stats.isFile()) {
                window.webContents.send('file:' + data.type, JSON.stringify(require(filePath)));
                return;
            }
            let dir = (await fs.readdir(filePath, 'utf-8')).filter(file => file.endsWith('.json'));
            let files = await Promise.all(dir.map(async(file) => require(path.join(filePath, file))));
            window.webContents.send('file:' + data.type, JSON.stringify(files));
        } catch (err) {
            console.error(err);
        }
    });

    ipcMain.on('get-raw', async(_, data) => {
        //get raw file data
        let filePath = props.UNPACKED_PATH + data.path;
        try {
            let stats = await fs.lstat(filePath);
            if (stats.isFile()) {
                window.webContents.send('raw:' + data.type, await fs.readFile(filePath, 'utf-8'));
                return;
            }
            let dir = (await fs.readdir(filePath, 'utf-8')).filter(file => file.endsWith('.json'));
            let files = await Promise.all(dir.map(async(file) => await fs.readFile(path.join(filePath, file), 'utf-8')));
            window.webContents.send('raw:' + data.type, files);
        } catch (err) {
            console.error(err);
        }
    });

    ipcMain.on('get-many', async(_, data) => {
        let filePath = props.UNPACKED_PATH + data.path;
        try {
            let stats = await fs.lstat(filePath);
            if (stats.isFile()) {
                window.webContents.send('file:' + data.type, JSON.stringify(require(filePath)));
                return;
            }
            let dir = (await fs.readdir(filePath, 'utf-8')).filter(file => file.endsWith('.json'));
            let files = await Promise.all(dir.map(async(file) => require(path.join(filePath, file))));
            files.forEach(file => window.webContents.send('get-many:' + data.type, JSON.stringify(file)));
        } catch (err) {
            console.error(err);
        }
    });

    ipcMain.on('get-all', async(_, data) => {
        let filePath = props.UNPACKED_PATH + data.path;
        try {
            let stats = await fs.lstat(filePath);
            if (stats.isFile()) {
                window.webContents.send('file:' + data.type, JSON.stringify(require(filePath)));
                return;
            }
            let dir = (await fs.readdir(filePath, 'utf-8')).filter(file => file.endsWith('.json'));
            let files = await Promise.all(dir.map(async(file) => require(path.join(filePath, file))));
            window.webContents.send('get-all:' + data.type, JSON.stringify(files));
        } catch (err) {
            console.error(err);
        }
    });

    ipcMain.on('get-folder', async(_, data) => {
        let dirPath = props.UNPACKED_PATH + data.path;
        try {

            let dir = (await fs.readdir(dirPath, 'utf-8'))
                .filter(file => file != '.metadata')
                .map(file => {
                    return {
                        name: file,
                        id: parseInt(file)
                    }
                });
            window.webContents.send('get-folder:' + data.type, JSON.stringify(dir));

        } catch (err) {
            console.error(err);
        }
    });

    ipcMain.on('get-image', async(_, data) => {
        let filePath = props.UNPACKED_PATH + data.path;
        try {

        } catch (err) {
            console.error(err);
        }
    });

    ipcMain.on('get-interfaces', async(_, data) => {
        let dirPath = props.UNPACKED_PATH + '/interfaces/';
        try {
            //get interfaces and return object with name from interfaceNames
            let dir = (await fs.readdir(dirPath, 'utf-8'))
                .filter(file => file != '.metadata')
                .map(file => {
                    return {
                        name: interfaceNames[file] || 'Unknown',
                        id: parseInt(file)
                    }
                });
            window.webContents.send('get-interfaces', JSON.stringify(dir));
        } catch (err) {
            console.error(err);
        }
    });

    ipcMain.on('get-names', async(_, data) => {
        let filePath = props.UNPACKED_PATH + data.path;
        try {
            let stats = await fs.lstat(filePath);
            if (stats.isFile())
                return;
            let dir = (await fs.readdir(filePath, 'utf-8'))
                .filter(file => file.endsWith('.json'))
                .map(file => {
                    let mod = require(path.join(filePath, file));
                    return {
                        name: mod.name,
                        id: mod.id
                    }
                });
            window.webContents.send('get-names:' + data.type, JSON.stringify(dir));
        } catch (err) {
            console.error(err);
        }
    });

    ipcMain.on('save-file', async(_, data) => {
        let filePath = props.UNPACKED_PATH + data.path;
        try {
            await fs.writeFile(filePath, data.file);
        } catch (err) {
            console.error(err);
        }
    });
}

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})

app.on('ready', () => {
    app.setAppUserModelId('Cryogen.CacheEditor');
    createWindow();
});

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());

app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());