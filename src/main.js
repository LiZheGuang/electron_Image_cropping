const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Notification,
} = require("electron");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const {} = require("./app/utils/node_utils");

function showNotification(title, body) {
  new Notification({
    title: title,
    body: body,
  }).show();
}
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false, // false 之后就可以访问 本地资源文件了
      webviewTag: true,
    },
  });

  ipcMain.on("image_processing", function (event, val) {
    dialog
      .showOpenDialog({
        properties: ["openFile", "multiSelections"],
        filters: [
          {
            name: "Images",
            extensions: ["jpg", "png", "gif", "PNG", "JPEG", "jpeg"],
          },
        ],
      })
      .then((result) => {
        let canceled = result.canceled;
        if (canceled === true) {
          return;
        }
        showNotification("图片压缩功能启动", "图片压缩中");

        const desktopPath = path.join(require("os").homedir(), "Desktop");
        const folderName = "ImageDist";
        let arslen = 0;
        for (let i = 0; i < result.filePaths.length; i++) {
          let filePaths = result.filePaths[i];
          const extName = path.extname(filePaths); // .jpeg
          let fileName = path.basename(filePaths); // Leonardo_Diffusion_vector_tshirt_art_ready_to_print_colourful_1.jpeg
          // console.log(fileName, extName);
          fileName = new Date().getTime() + "_" + fileName;
          // 目录地址
          const folderPath = path.join(desktopPath, folderName);
          // 图片路径 拼接目录地址
          const filePath = path.join(folderPath, fileName);
          //检查文件夹是否存在，如果不存在则创建文件夹
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
            console.log(`Created ${folderPath} directory`);
          }
          const inputBuffer = fs.readFileSync(filePaths);
          let SharpServer;
          if (extName === "png" || extName == "PNG") {
            SharpServer = sharp(inputBuffer).png({
              quality: 60, // 默认60
            });
          } else {
            SharpServer = sharp(inputBuffer).jpeg({
              quality: 60, // 默认60
            });
          }
          SharpServer.toFile(filePath, (err, info) => {
            if (err) {
              console.error(err);
            } else {
              arslen++;
              if (arslen >= result.filePaths.length) {
                showNotification(
                  "图片压缩功能启动",
                  "图片压缩完成 ✿✿ヽ(°▽°)ノ✿"
                );
              }
            }
          });
        }
      });
  });

  ipcMain.on("image_opticy", function (event, val) {
    console.log("node-server-image_opticy");
    dialog
      .showOpenDialog({
        properties: ["openFile", "multiSelections"],
        filters: [
          {
            name: "Images",
            extensions: ["jpg", "png", "gif", "PNG", "JPEG", "jpeg"],
          },
        ],
      })
      .then((result) => {
        let canceled = result.canceled;
        if (canceled === true) {
          return;
        }
        const desktopPath = path.join(require("os").homedir(), "Desktop");
        const folderName = "ImageDist";
        let arslen = 0;
        for (let i = 0; i < result.filePaths.length; i++) {
          let filePaths = result.filePaths[i];
          const extName = path.extname(filePaths); // .jpeg
          let fileName = path.basename(filePaths); // Leonardo_Diffusion_vector_tshirt_art_ready_to_print_colourful_1.jpeg
          // console.log(fileName, extName);
          fileName = new Date().getTime() + "_" + fileName;
          // 目录地址
          const folderPath = path.join(desktopPath, folderName);
          // 图片路径 拼接目录地址
          const filePath = path.join(folderPath, fileName);
          //检查文件夹是否存在，如果不存在则创建文件夹
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
            console.log(`Created ${folderPath} directory`);
          }
          const inputBuffer = fs.readFileSync(filePaths);
          console.log(inputBuffer);
          sharp(inputBuffer)
            .png()
            .unflatten()
            // .ensureAlpha(0)
            .toFile(filePath, (err, info) => {
              if (err) {
                console.error(err);
              } else {
                console.log(info);
              }
            });
        }
      });
  });
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
