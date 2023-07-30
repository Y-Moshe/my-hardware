const { app, BrowserWindow, ipcMain, shell } = require('electron')
const si = require('systeminformation')
const { projects } = require('./angular.json')

function createAppWindow() {
  var appWindow = new BrowserWindow({
    width: 769,
    minWidth: 769,
    maxWidth: 1024,
    height: 800,
    minHeight: 800,
    autoHideMenuBar: !process.env?.IS_DEV,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      webSecurity: false,
    },
  })

  const { outputPath } = projects['my-hardware'].architect.build.options
  process.env?.IS_DEV
    ? appWindow.loadURL('http://localhost:4200') // For Development
    : appWindow.loadFile(`${outputPath}/index.html`) // For Production
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createAppWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindow()
    }
  })
})

// ----------------------------------------------------------------

ipcMain.handle('openLinkedIn', () =>
  shell.openExternal('https://www.linkedin.com/in/moshe-nehemiah-254506155/')
)

ipcMain.handle('getCpuData', () => si.cpu())
ipcMain.handle('getMemoryLayout', () => si.memLayout())
ipcMain.handle('getDisksLayout', () => si.diskLayout())

ipcMain.handle('getHardwareStatus', async () => {
  const [
    cpuTemperature,
    cpuCurrentSpeed,
    cpuCurrentLoad,
    memCurrentLoad,
    disksIO,
    fsSize,
  ] = await Promise.all([
    si.cpuTemperature(),
    si.cpuCurrentSpeed(),
    si.currentLoad(),
    si.mem(),
    si.disksIO(),
    si.fsSize(),
  ])

  return {
    cpuTemperature,
    cpuCurrentSpeed,
    cpuCurrentLoad,
    memCurrentLoad,
    disksIO,
    fsSize,
  }
})
