'use strict';
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

  console.log(socket);

  io.emit('join');

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function() {
    io.emit('leave');
  });

});

http.listen(3000, function() {
  console.log('Listening on *:3000');
});
