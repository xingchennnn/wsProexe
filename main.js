const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
let win; // 定义窗口变量

app.on('ready', () => {
  // 当应用准备就绪时
  win = new BrowserWindow({
    x: 500,
    y: 700,
    show: false,
    frame: true,
    autoHideMenuBar: true,
    width: 400,
    height: 600,
    minHeight: 200,
    minWidth: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false

    }
  });

  win.loadFile('index.html').then(() => {
    console.log('渲染index.html loaded');
    // 监听窗口关闭事件
    win.on('closed', () => {
      win = null;
    });

    // 监听窗口准备显示事件
    win.on('ready-to-show', () => {
      win.show();
    });
  });

  // 监听所有窗口关闭事件
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // 监听应用激活事件
  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });
});

// 接收传入的事件，在新窗口的参数：createNew
ipcMain.on('createNew', (event, arg) => {
  // 创建一个新窗口
  let newWin = new BrowserWindow({
    x: 400, // 设置窗口 x 坐标
    y: 600, // 设置窗口 y 坐标
    show: false, // 初始时不显示窗口
    frame: true, // 显示窗口边框
    autoHideMenuBar: true, // 自动隐藏菜单栏
    width: 400, // 窗口宽度
    height: 600, // 窗口高度
    minHeight: 200, // 窗口最小高度
    minWidth: 400, // 窗口最小宽度
    webPreferences: {
      nodeIntegration: true, // 允许使用Node.js集成
      contextIsolation: false // 禁用上下文隔离
    }
  });

  // 加载index.html文件
  newWin.loadFile('index.html').then(() => {
    console.log('index.html loaded');
    // 监听窗口关闭事件
    newWin.on('closed', () => {
      console.log('newWin closed');
      newWin = null; // 释放窗口对象
    });

    // 监听窗口准备显示事件
    newWin.on('ready-to-show', () => {
      newWin.show(); // 显示窗口
    });
  });
});


