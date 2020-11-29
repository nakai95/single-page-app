var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/' , function(req, res){
    res.sendFile(__dirname+'/public/index.html');
});

io.on('connection',function(socket){
    socket.on('message',function(msg){
        io.emit('message', 'Anonymous: '+msg);
    });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});