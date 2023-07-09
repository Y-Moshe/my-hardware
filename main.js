const { app, BrowserWindow, ipcMain } = require('electron')
const si = require('systeminformation')
const { projects } = require('./angular.json')

var appWindow
var appWindowOverlay

function createAppWindow() {
  appWindow = new BrowserWindow({
    width: 800,
    height: 800,
    roundedCorners: true,
    // autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      webSecurity: false,
    },
  })

  // const { outputPath } = projects["my-hardware"].architect.build.options;
  // appWindow.loadFile(`${outputPath}/index.html`);
  appWindow.loadURL('http://localhost:4200')
}

function createAppOverlayWindow() {
  appWindowOverlay = new BrowserWindow({
    width: 300,
    minWidth: 300,
    minHeight: 200,
    roundedCorners: true,
    // autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
    // modal: true,
    // parent: appWindow,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      webSecurity: false,
    },
  })

  appWindowOverlay.loadURL('http://localhost:4200/overlay')
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createAppWindow()
  // createAppOverlayWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindow()
      // createAppOverlayWindow()
    }
  })
})

// ----------------------------------------------------------------

ipcMain.handle('getCpuData', () => si.cpu())

ipcMain.handle('getCpuStatus', async () => {
  const [cpuTemperature, cpuCurrentSpeed, currentLoad] = await Promise.all([
    si.cpuTemperature(),
    si.cpuCurrentSpeed(),
    si.currentLoad(),
  ])

  return {
    temperature: cpuTemperature,
    speed: cpuCurrentSpeed,
    load: currentLoad,
  }
})

// ----------------------------------------------------------------

ipcMain.handle('getDisksLayout', () => si.diskLayout())

ipcMain.handle('getDisksStatus', async () => {
  const [disksIO, fsSize] = await Promise.all([si.disksIO(), si.fsSize()])

  return {
    disksIO,
    disksUsage: fsSize,
  }
})

// ----------------------------------------------------------------

ipcMain.handle('getMemoryLayout', () => si.memLayout())

ipcMain.handle('getMemoryStatus', () => si.mem())
