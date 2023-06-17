import { app, BrowserWindow, shell, ipcMain, session } from "electron"
import { release } from "node:os"
import path, { join } from "node:path"
import { update } from "./update"
import axios from "axios"
import * as child from "child_process"

process.env.DIST_ELECTRON = join(__dirname, "../")
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist")
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST

console.log(process.env.DIST)

// Disable GPU Acceleration for Windows 7
// if (release().startsWith("6.1")) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"

let win: BrowserWindow | null = null
const preload = join(__dirname, "../preload/index.js")
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, "index.html")

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    autoHideMenuBar: true,
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (url) {
    win.loadURL(url)
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url)
    return { action: "deny" }
  })

  // Apply electron-updater
  update(win)
}

if (!app.isPackaged) {
  const reactDevToolsPath = path.resolve(
    "extensions/fmkadmapgofadopljbjfkapdkoienihi"
  )

  app.whenReady().then(async () => {
    await session.defaultSession.loadExtension(reactDevToolsPath, {
      allowFileAccess: true
    })
  })
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
  win = null
  if (process.platform !== "darwin") app.quit()
})

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

if (app.isPackaged) {
  const PYPATH = join(process.env.DIST, "../../../resources/app/py/dist")
  const PY_MODULE = "main"

  let pyProc: child.ChildProcess | null
  let pyPort: number | null

  const getScriptPath = () => {
    if (process.platform === "win32") {
      return join(PYPATH, PY_MODULE + ".exe")
    } else {
      return join(PYPATH, PY_MODULE)
    }
  }

  const createPyProc = () => {
    let script = getScriptPath()
    pyProc = child.execFile(script)
  }

  async function getPID() {
    try {
      const response = await axios.get("http://127.0.0.1:4242/pid")
      return response.data.pid
    } catch (error) {
      console.log("Please ensure you manually killed python process")
    }
  }

  async function exitPyProc() {
    const pyPID = await getPID()
    console.log("Python child process pid = " + pyProc?.pid)
    console.log("Python child of child process pid = " + pyPID)

    process.kill(parseInt(pyPID))
    pyProc?.kill()
    pyProc = null
    pyPort = null
  }

  let pyKilled = false

  app.on("ready", createPyProc)
  app.on("before-quit", async (e) => {
    if (pyKilled === false) {
      e.preventDefault()
      await exitPyProc()
      pyKilled = true
      app.quit()
    }
  })
}
