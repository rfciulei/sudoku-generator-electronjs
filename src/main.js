// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const spawn = require("child_process").spawn;
const buildPdf = require("./buildPdf");

let cppDirPath = path.join(__dirname, "cpp");
let execPath = path.join(cppDirPath, "sudokuGen.exe");

//these should've been in an env.js file
let devEnv = false;
// TO-DO -> link dll's to exe file before release
let compile = true;

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 400,
    height: 280,
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  win.loadFile("index.html");
  // no menu bar
  win.setMenuBarVisibility(false);
  // Open the DevTools.
  if (devEnv == true) win.webContents.openDevTools();

  ipcMain.on("toMain", (event, data) => {
    args = new Array();
    args.push(data.numberOfPuzzles);
    args.push(data.difficulty);
    if (data.solutions) {
      args.push("1");
    } else {
      args.push("0");
    }
    // src/cpp/puzzles dir should be empty for each sudokuGen.exe execution
    createOrEmptyPuzzlesDirSync();
    //ISSUE : does not verify if g++ is present on the system
    if (compile) {
      compileCode(win);
      executeCpp(win, args);
    } else {
      executeCpp(win, args);
    }
  });
}
// ISSUE -> does not show output
const compileCode = (win) => {
  let c =
    "g++ " +
    path.join(cppDirPath, "sudokuGen.cpp") +
    " -o " +
    path.join(cppDirPath, "sudokuGen");
  // we use execSync so that we make sure the compilation
  // is finished before execution
  child_process.execSync(c, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    if (stdout) {
      console.log("[FINISHED][SUCCESS] : compilation");
    }
    // console.log(`g++ stdout:\n${stdout}`);
  });
};
// TO-DO : fix error codes passing
const executeCpp = (win, args) => {
  const opts = {
    cwd: path.join(__dirname, "cpp"),
    env: process.env,
  };
  exec = spawn(execPath, args, opts);
  exec.stdout.on("data", function (data) {
    console.log("sudokuGen.exe stdout:\n" + data.toString());
  });
  exec.stderr.on("data", function (data) {
    console.log("stderr: " + data.toString());
  });
  exec.on("exit", function (code) {
    if (code.toString() === "0") {
      console.log("[FINISHED][SUCCESS] : sudokuGen.exe execution");
      win.webContents.send("fromMain", "finished");
      // will build pdf if code return 0
      buildPdf();
    } else {
      console.log("[FINISHED][FAIL] : sudokuGen.exe execution");
      win.webContents.send("fromMain", "finished");
    }
  });
};

//ISSUE
const createOrEmptyPuzzlesDirSync = () => {
  let directory = path.join(__dirname, "cpp", "puzzles");

  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      fs.unlinkSync(path.join(directory, file));
    }
  } else fs.mkdirSync(directory);
};

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
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getHours() + "h-" + current_datetime.getMinutes() + "m";

  let logsFolder = path.join(__dirname, "logs");
  console.log();
  if (!fs.existsSync(logsFolder)) {
    fs.mkdir(logsFolder, (err) => {
      if (err) {
        throw err;
      }
      console.log("dir was created");
    });
  }

  let fileName =
    "logs_" +
    current_datetime.getHours() +
    "h-" +
    current_datetime.getMinutes() +
    "m";
  let currentLogFile = path.join(logsFolder, fileName);

  formatted_date =
    current_datetime.getHours() +
    "h-" +
    current_datetime.getMinutes() +
    "m-" +
    current_datetime.getSeconds() +
    "s-" +
    current_datetime.getMilliseconds() +
    "ms";

  fs.writeFileSync(
    currentLogFile,
    formatted_date + " [LOG]: " + string,
    function (err, data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    }
  );
};
