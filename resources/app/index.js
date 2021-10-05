'use strict';

var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var mainWindow = null;
var ipc = require('electron').ipcMain;
var os = require('os');
var {dialog} = require('electron');

ipc.on('close-main-window', function() {
    app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        resizable: true,
        height: 600,
        width: 800,
        webPreferences:{
          nodeIntegration:true
        }
    });

mainWindow.loadURL('file://' + __dirname + '/main.html');
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});



ipc.on('open-file-dialog-for-file', function (event) {
    console.log("button pressed")
    console.log(event)
    if(os.platform() === 'linux' || os.platform() === 'win32'){

        dialog.showOpenDialog(null, {
            properties: ['openFile']
          }).then(result => {
            console.log(result.filePaths)
            event.sender.send("selected-file",result.filePaths[0])
          }).catch(err => {
            console.log(err)
          })
   } else {
       dialog.showOpenDialog({
           properties: ['openFile', 'openDirectory']
       }, function (files) {
           if (files) event.sender.send('selected-file', files[0]);
       });
   }});

