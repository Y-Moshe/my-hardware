const { app, BrowserWindow, ipcMain } = require("electron");
const si = require("systeminformation");
const { projects } = require("./angular.json");

function createWindow() {
  var win = new BrowserWindow({
    width: 800,
    height: 800,
    roundedCorners: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      webSecurity: false,
    },
  });

  // const { outputPath } = projects["my-hardware"].architect.build.options;
  // win.loadFile(`${outputPath}/index.html`);
  win.loadURL('http://localhost:4200')
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// ----------------------------------------------------------------

ipcMain.handle("getCpuData", async () => {
  try {
    return await si.cpu();
  } catch (error) {
    console.log("error", error);
  }
});

ipcMain.handle("getCpuStatus", async () => {
  try {
    const [cpuTemperature, cpuCurrentSpeed] = await Promise.all([
      si.cpuTemperature(),
      si.cpuCurrentSpeed(),
    ]);

    return {
      temperature: cpuTemperature,
      speed: cpuCurrentSpeed,
    };
  } catch (error) {
    console.log("error", error);
  }
});
