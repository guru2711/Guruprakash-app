const ipc = require('electron').ipcRenderer;
const buttonCreated = document.getElementById('upload');
const process = require('child_process')
const $ = require('jquery')
const path = require('path')
var randomString = require('random-string');
const fs = require('fs')
var ffmpeg = require('ffmpeg-static-electron');
console.log(ffmpeg.path);
var format = 'mp3'

var dir = './media';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

buttonCreated.addEventListener('click', function (event) {
    format = $("#format option:selected").text();
    ipc.send('open-file-dialog-for-file')

});

$("#format").change(function(){
    format = $("#format option:selected").text();
})

ipc.on('selected-file', function (event, paths) {
    console.log(event)
    var randomId = randomString()
    $("#info").append(`
        <div id=${randomId} class="alert alert-success">
          ${paths} is converting So Please Wait
         </div>
    `
    )
    console.log('Full path: ', paths)


    process.exec(`ffmpeg -i "${paths}" media/${randomString()}_video.${format}`,function(error,stdout, stderr){

        console.log('stdout: ' + stdout);
        $(`#${randomId}`).detach()
        Notification.requestPermission().then(function(result){
            var myNotification = new Notification('Conversion Completed',{
                body:"Your file was successfully converted"
            });
                    
        })
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    
    })
});