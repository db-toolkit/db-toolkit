/**
 * Window management utilities.
 */

const { BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const iconPath = path.join(__dirname, "../build/icons/icon.png");
  const isMac = process.platform === "darwin";
  const isWindows = process.platform === "win32";

  const win = new BrowserWindow({
    width: 1100,
    height: 750,
    title: "DB Toolkit",
    icon: iconPath,
    frame: false,
    titleBarStyle: isMac ? "hiddenInset" : undefined,
    titleBarOverlay: isWindows
      ? {
          color: "#f9fafb",
          symbolColor: "#374151",
          height: 40,
        }
      : undefined,
    trafficLightPosition: isMac ? { x: 10, y: 10 } : undefined,
    roundedCorners: isWindows,
    backgroundMaterial: isWindows ? "mica" : undefined,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  win.on("page-title-updated", (event) => {
    event.preventDefault();
  });

  // Show menu bar on Windows even with frameless window
  if (isWindows) {
    win.setMenuBarVisibility(true);
  }

  const isDev = !require("electron").app.isPackaged;

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  return win;
}

module.exports = { createWindow };