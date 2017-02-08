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

  socket.on('message', function(msg) {
    io.emit('message', msg, socket.username);
  });

  socket.on('disconnect', function() {
    var timeOnline = new Date() - socket.joinedAt;
    var secondsOnline = Math.round(timeOnline / 1000);
    io.emit('disconnect', socket.username, secondsOnline);
  });
});

http.listen(3000, function() {
  console.log('Listening on *:3000');
});
