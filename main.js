const { app, BrowserWindow } = require("electron");
const { projects } = require("./angular.json");

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 800 });
  const { outputPath } = projects["my-hardware"].architect.build.options;
  win.loadFile(`${outputPath}/index.html`);
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
