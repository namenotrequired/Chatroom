/* global io:false $:false */
'use strict';

const socket = io();

// ==================================================
// Choose username & set in localStorage
// ==================================================
let username;
if ('localStorage' in window && localStorage.getItem('username')) {
    username = localStorage.getItem('username');
} else {
    username = window.prompt('Hi! To enter Chatroom, tell us your name.');
    if ('localStorage' in window) {
        localStorage.setItem('username', username);
    }
}

socket.emit('join', username);

// ==================================================
// Generic functions to add to messages
// ==================================================
function addToMessages(msgElement) {
    $('#messages').append(msgElement);
}

function addAutoMsg(msg) {
    const msgElement = $('<li class="autoMsg">').html(msg);

    addToMessages(msgElement);
}

function addUserMsg(msg, byUser) {
    const name = (byUser === username) ? 'You' : byUser;
    const content = `<span class="username">${name}:</span> ${msg}`;
    const msgElement = $('<li>').html(content);

    addToMessages(msgElement);
}

// ==================================================
// Handle chat events
// ==================================================
$(document).ready(() => {
    // Send a message
    $('form').submit((e) => {
        e.preventDefault();

        const msg = $('#writeMsg').val();
        socket.emit('message', msg);

        $('#writeMsg').val('');
    });

    // Receive message
    socket.on('message', (msg, name) => {
        addUserMsg(msg, name);
    });

    // Receive disconnect message
    socket.on('disconnect', (name, time) => {
        if (name === 'transport close' && time === undefined) {
            return; // Ignore server restart (and fail) messages
        }

        const unit = (time === 1) ? 'second' : 'seconds';
        addAutoMsg(`${name} left after ${time} ${unit}.`);
    });

    // Receive join message
    socket.on('join', (name) => {
        addAutoMsg(`${name} joined`);
    });
});
