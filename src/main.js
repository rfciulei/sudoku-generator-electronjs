// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const child_process = require("child_process");

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
  // win.webContents.openDevTools();

  ipcMain.on("toMain", (event, data) => {
    let compile = true;
    args = new Array();
    args.push(data.numberOfPuzzles);
    args.push(data.difficulty);
    args.push(data.solutions);

    let sudoku = require("sudoku");
    let puzzle = sudoku.makepuzzle();
    console.log(puzzle);

    console.log(data);
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
// const log = (string) => {
//   const months = [
//     "JAN",
//     "FEB",
//     "MAR",
//     "APR",
//     "MAY",
//     "JUN",
//     "JUL",
//     "AUG",
//     "SEP",
//     "OCT",
//     "NOV",
//     "DEC",
//   ];

//   let current_datetime = new Date();
//   let formatted_date =
//     current_datetime.getHours() + "h-" + current_datetime.getMinutes() + "m";

//   let logsFolder = path.join(__dirname, "logs");
//   console.log();
//   if (!fs.existsSync(logsFolder)) {
//     fs.mkdir(logsFolder, (err) => {
//       if (err) {
//         throw err;
//       }
//       console.log("dir was created");
//     });
//   }

//   let fileName =
//     "logs_" +
//     current_datetime.getHours() +
//     "h-" +
//     current_datetime.getMinutes() +
//     "m";
//   let currentLogFile = path.join(logsFolder, fileName);

//   formatted_date =
//     current_datetime.getHours() +
//     "h-" +
//     current_datetime.getMinutes() +
//     "m-" +
//     current_datetime.getSeconds() +
//     "s-" +
//     current_datetime.getMilliseconds() +
//     "ms";

//   fs.writeFileSync(
//     currentLogFile,
//     formatted_date + " [LOG]: " + string,
//     function (err, data) {
//       if (err) {
//         return console.log(err);
//       }
//       console.log(data);
//     }
//   );
// };
