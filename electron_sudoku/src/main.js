// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
var exec = require("child_process").exec;

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 400,
    height: 280,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  win.loadFile("index.html");
  // no menu bar
  win.setMenuBarVisibility(false);
  // Open the DevTools.
  win.webContents.openDevTools();

  ipcMain.on("toMain", (event, data) => {
    let compile = false;
    args = new Array();

    args.push(data.numberOfPuzzles);
    args.push(data.difficulty);
    args.push(data.solutions);

    //build args for main.cpp
    argsString = "";
    for (let i = 0; i < args.length; i++) {
      argsString += " ";
      argsString += args[i];
    }

    if (compile) {
      exec(
        "g++ sudokuGen.cpp " + argsString,
        function callback(error, stdout, stderr) {
          if (!error) {
            exec("a.exe", function callback(error, stdout, stderr) {
              if (!error) {
                console.log("[FINISHED] : g++ sudokuGen.cpp");
                win.webContents.send("fromMain", "finished");
              }
            });
          }
        }
      );
    } else {
      cppDirPath = path.join(__dirname, "cpp");
      exePath = path.join(cppDirPath, "a.exe");

      console.log(exePath);

      exec(exePath, function callback(error, stdout, stderr) {
        if (!error) {
          win.webContents.send("fromMain", "finished");
        }
      });
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const log = (string) => {
  const dir = "./logs";

  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, (err) => {
      if (err) {
        throw err;
      }
      console.log("dir was created");
    });
  }

  fs.writeFile("/logs/" + new Date(), "[LOG]" + string, function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });
};
