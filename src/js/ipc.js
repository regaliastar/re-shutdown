const electron = nodeRequire('electron');
const ipcRenderer = electron.ipcRenderer;

// 监听webContents.send主动传递的消息。
// ipcRenderer.on('main-process-messages', (event, message) => {
//   console.log('message from Main Process: ' , message);  // Prints Main Process Message.
// });
      
// // 使用ipcRenderer触发同步消息
// var sMessage = ipcRenderer.sendSync('synchronous-message', 'ping');
// console.log('同步消息sMessage: ', sMessage);
      
// // 使用ipcRenderer触发异步消息，消息结果使用监听来完成。
// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log('监听到的异步消息: ', arg);
// });

//ipcRenderer.send('asynchronous-message', 'ping');