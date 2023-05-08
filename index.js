const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io")
const cors = require('cors');

app.use(cors())

const server = http.createServer(app);
var oldRoom = "";

const io = new Server(server,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
});

io.on("connection", (socket) => {
    console.log(`a user connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.leave(oldRoom);
        socket.to(oldRoom).emit("room_log", `${socket.id} left`);

        socket.join(data);
        socket.to(data).emit("room_log", `${socket.id} joined`);
        oldRoom = data;
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", {user: socket.id, message: data.message})
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});