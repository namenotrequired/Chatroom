/* global io:false $:false */
'use strict';
var socket = io();

// Choose username & set in localStorage
var username;
if ('localStorage' in window && localStorage.getItem('username')) {
    username = localStorage.getItem('username');
} else {
    username = window.prompt('Hi! To enter Chatroom, tell us your name.');
    if ('localStorage' in window) {
        localStorage.setItem('username', username);
    }
}

socket.emit('join', username);

$(document).ready(() => {
    // Send a message
    $('form').submit((e) => {
        e.preventDefault();

        var msg = $('#writeMsg').val();
        socket.emit('message', msg);

        $('#writeMsg').val('');
    });

    // Receive message
    socket.on('message', (msg, username) => {
        addUserMsg(msg, username);
    });

    // Receive disconnect message
    socket.on('disconnect', (username, time) => {

        if (username === 'transport close' && time === undefined) {
            return; // Ignore server restart (and fail) messages
        }

        var unit = (time === 1) ? 'second' : 'seconds';
        addAutoMsg(`${username} left after ${time} ${unit}.`);
    });

    // Receive join message
    socket.on('join', (username) => {
        addAutoMsg(`${username} joined`);
    });
});

// Generic functions to add to messages
var addToMessages = (msgElement) => {
    $('#messages').append(msgElement);
};

var addAutoMsg = (msg) => {
    var msgElement = $('<li class="autoMsg">').html(msg);
    addToMessages(msgElement);
};

var addUserMsg = (msg, byUser) => {
    if (byUser === username) {
        byUser = 'You';
    }

    var content = `<span class="username">${byUser}:</span> ${msg}`;
    var msgElement = $('<li>').html(content);
    addToMessages(msgElement);
};
