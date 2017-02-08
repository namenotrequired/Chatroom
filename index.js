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
    socket.joinedAt = new Date();
    io.emit('join', username);
  });

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function() {
    var timeOnline = new Date() - socket.joinedAt;
    var timeOnlineSeconds = Math.ceil(timeOnline / 1000);
    io.emit('disconnect', socket.username, timeOnlineSeconds);
  });
});

http.listen(3000, function() {
  console.log('Listening on *:3000');
});
