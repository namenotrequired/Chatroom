'use strict';
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

  socket.on('join', function(username) {
    socket.username = username;
    io.emit('join', username);
  });

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function() {
    io.emit('disconnect', socket.username);
  });

});

http.listen(3000, function() {
  console.log('Listening on *:3000');
});
