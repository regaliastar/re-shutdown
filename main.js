const electron = require('electron');
const { app } = electron;                      // 控制应用生命周期的模块。
const { BrowserWindow } = electron;  // 创建原生浏览器窗口的模块
const { ipcMain } = electron;

var handle = function(taskTime){
  var cmd = require('node-cmd');

  cmd.get(
          'shutdown -s -t '+taskTime,
          function(err, data, stderr){
              console.log(data+'命令成功执行, 系统于 '+Math.floor(taskTime/60)+' 分钟后关机');
          }
      );

      cmd.run('touch example.created.file');
}

var quit = function(){
  var cmd = require('node-cmd');

  cmd.get(
          'shutdown -a',
          function(err, data, stderr){
              console.log(data+'成功取消关机任务');
          }
      );

      cmd.run('touch example.created.file');
}

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var win = null;

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
  // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
  // 应用会保持活动状态
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
var createWindow = function(){
  // 创建浏览器窗口。
  win = new BrowserWindow({
                      width: 800, 
                      height: 400
                      //transparent: true,  //透明
                      //frame: false        //无边框
                    });

  // 加载应用的 index.html
  win.loadURL('file://' + __dirname + '/src/index.html');

  // 打开开发工具
  //win.webContents.openDevTools();

  //加载完成
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('main-process-messages', 'webContents event "did-finish-load" called');
  });

  //设置监听
  ipcMain.on('main-process-message', (event,message) => {
    console.log('message from Main Process: ' , message);  // Prints Main Process Message.
  });

  // 监听同步消息
  ipcMain.on('synchronous-message', (event, arg) => {
    if(!isNaN(arg) && arg !== 0){
      handle(arg);
    }
    
    event.returnValue = 'ok';
  });


  // 监听异步的消息。
  ipcMain.on('asynchronous-message', (event, arg) => {
    if(arg == 'quit'){
      quit();
    }
    // 返回消息
    event.sender.send('asynchronous-reply', 'pong');
  });

  // 当 window 被关闭，这个事件会被发出
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 但这次不是。
    win = null;
  });
}
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

