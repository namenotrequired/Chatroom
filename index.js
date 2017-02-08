'use strict';
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Router
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css');
});

// Organise chat
io.on('connection', (socket) => {
    // Join
    socket.on('join', (username) => {

        socket.username = username;
        socket.joinedAt = new Date();

        io.emit('join', username);
    });

    // Send chat messages
    socket.on('message', (msg) => {
        io.emit('message', msg, socket.username);
    });

    // Send leave messages
    socket.on('disconnect', () => {
        var timeOnline = new Date() - socket.joinedAt;
        var secondsOnline = Math.round(timeOnline / 1000);

        io.emit('disconnect', socket.username, secondsOnline);
    });
});

http.listen(3000, () => {
    console.log('Listening on port 3000');
});
