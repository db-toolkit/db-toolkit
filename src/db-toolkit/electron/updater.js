const { dialog, shell, BrowserWindow } = require("electron");
const https = require("https");
const fs = require("fs");
const path = require("path");
const os = require("os");

const GITHUB_REPO = "db-toolkit/db-toolkit";
const CURRENT_VERSION = "0.1.0-beta7";

function compareVersions(current, latest) {
  const parse = (v) => {
    const clean = v.replace(/^v/, "");
    const [core, pre] = clean.split("-", 2);
    const parts = core.split(".").map((n) => Number(n));
    while (parts.length < 3) parts.push(0);

    // Parse prerelease tag (e.g., "beta6" -> {type: "beta", number: 6})
    let prereleaseType = null;
    let prereleaseNumber = 0;
    if (pre) {
      const match = pre.match(/^([a-z]+)(\d+)?$/i);
      if (match) {
        prereleaseType = match[1];
        prereleaseNumber = match[2] ? parseInt(match[2], 10) : 0;
      }
    }

    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0,
      prerelease: Boolean(pre),
      prereleaseType,
      prereleaseNumber,
    };
  };

  const c = parse(current);
  const l = parse(latest);

  // Compare core version
  if (l.major !== c.major) return l.major > c.major ? 1 : -1;
  if (l.minor !== c.minor) return l.minor > c.minor ? 1 : -1;
  if (l.patch !== c.patch) return l.patch > c.patch ? 1 : -1;

  // If core versions equal, compare prerelease
  // Stable > prerelease
  if (c.prerelease && !l.prerelease) return 1;
  if (!c.prerelease && l.prerelease) return -1;

  // Both prerelease - compare type and number
  if (c.prerelease && l.prerelease) {
    if (c.prereleaseType !== l.prereleaseType) {
      // alpha < beta < rc
      const order = { alpha: 1, beta: 2, rc: 3 };
      const cOrder = order[c.prereleaseType] || 0;
      const lOrder = order[l.prereleaseType] || 0;
      if (lOrder !== cOrder) return lOrder > cOrder ? 1 : -1;
    }
    // Same type, compare number
    if (l.prereleaseNumber !== c.prereleaseNumber) {
      return l.prereleaseNumber > c.prereleaseNumber ? 1 : -1;
    }
  }

  return 0;
}

function fetchLatestRelease() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: `/repos/${GITHUB_REPO}/releases/latest`,
      headers: {
        "User-Agent": "DB-Toolkit",
      },
    };

    https
      .get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error("Failed to fetch release"));
          }
        });
      })
      .on("error", reject);
  });
}

function getAssetForPlatform(assets) {
  const platform = process.platform;

  if (platform === "darwin") {
    return (
      assets.find((a) => a.name.endsWith(".dmg")) ||
      assets.find((a) => a.name.endsWith(".zip"))
    );
  } else if (platform === "win32") {
    return (
      assets.find((a) => a.name.endsWith(".exe")) ||
      assets.find((a) => a.name.endsWith(".msi")) ||
      assets.find((a) => a.name.endsWith(".zip"))
    );
  } else if (platform === "linux") {
    return (
      assets.find((a) => a.name.endsWith(".AppImage")) ||
      assets.find((a) => a.name.endsWith(".deb")) ||
      assets.find((a) => a.name.endsWith(".rpm")) ||
      assets.find((a) => a.name.endsWith(".tar.gz"))
    );
  }
  return null;
}

function downloadFile(url, destPath, progressCallback) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "DB-Toolkit",
          },
        },
        (response) => {
          if (response.statusCode === 302 || response.statusCode === 301) {
            return downloadFile(
              response.headers.location,
              destPath,
              progressCallback,
            )
              .then(resolve)
              .catch(reject);
          }

          const totalSize = parseInt(response.headers["content-length"], 10);
          let downloadedSize = 0;

          response.on("data", (chunk) => {
            downloadedSize += chunk.length;
            const progress = (downloadedSize / totalSize) * 100;
            progressCallback(progress);
          });

          response.pipe(file);

          file.on("finish", () => {
            file.close();
            resolve(destPath);
          });
        },
      )
      .on("error", (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
  });
}

function createProgressWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 150,
    resizable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(path.join(__dirname, "progress.html"));

  return win;
}

async function downloadUpdate(release) {
  // Get the installer file for current platform from GitHub release assets
  // asset.browser_download_url contains the direct download URL from GitHub
  const asset = getAssetForPlatform(release.assets);

  if (!asset) {
    dialog.showMessageBox({
      type: "error",
      title: "Download Failed",
      message: "No installer found for your platform",
      buttons: ["OK"],
    });
    return;
  }

  const progressWin = createProgressWindow();
  const downloadPath = path.join(os.homedir(), "Downloads", asset.name);

  try {
    await downloadFile(asset.browser_download_url, downloadPath, (progress) => {
      progressWin.webContents.executeJavaScript(`
        document.getElementById('progress').style.width = '${progress}%';
        document.getElementById('percentage').textContent = '${Math.round(progress)}%';
      `);
    });

    progressWin.close();

    const response = await dialog.showMessageBox({
      type: "info",
      title: "Download Complete",
      message: "Update downloaded successfully!",
      detail: `The installer has been saved to your Downloads folder.\n\nClick "Quit and Install" to close DB Toolkit and open the installer.`,
      buttons: ["Quit and Install", "Install Later"],
      defaultId: 0,
    });

    if (response.response === 0) {
      shell.openPath(downloadPath);
      process.exit(0);
    } else {
      shell.showItemInFolder(downloadPath);
    }
  } catch (error) {
    progressWin.close();
    dialog.showMessageBox({
      type: "error",
      title: "Download Failed",
      message: "Failed to download update",
      detail: error.message,
      buttons: ["OK"],
    });
  }
}

async function checkForUpdates(options = {}) {
  const { silent = false, notifyWindow = null } = options;
  try {
    const release = await fetchLatestRelease();
    const latestVersion = release.tag_name;
    const comparison = compareVersions(CURRENT_VERSION, latestVersion);

    if (comparison < 0) {
      if (silent) {
        if (notifyWindow?.webContents) {
          notifyWindow.webContents.send("update:available", {
            latestVersion,
            currentVersion: CURRENT_VERSION,
            releaseName: release.name,
            releaseNotes: release.body || "",
          });
        }
        return;
      }

      const response = await dialog.showMessageBox({
        type: "info",
        title: "Update Available",
        message: `DB Toolkit ${latestVersion} is available!`,
        detail: `You are currently using version ${CURRENT_VERSION}.\n\n${release.name}\n\n${release.body?.substring(0, 200) || ""}...`,
        buttons: ["Download Update", "Later"],
        defaultId: 0,
      });

      if (response.response === 0) {
        await downloadUpdate(release);
      }
    } else {
      if (!silent) {
        dialog.showMessageBox({
          type: "info",
          title: "No Updates",
          message: "You're up to date!",
          detail: `DB Toolkit ${CURRENT_VERSION} is the latest version.`,
          buttons: ["OK"],
        });
      }
    }
  } catch (error) {
    if (!silent) {
      dialog.showMessageBox({
        type: "error",
        title: "Update Check Failed",
        message: "Unable to check for updates",
        detail: "Please check your internet connection and try again.",
        buttons: ["OK"],
      });
    }
  }
}

module.exports = { checkForUpdates };
