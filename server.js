const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static(__dirname));

const players = {};

io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id);
  players[socket.id] = { x: 520, y: 850 };

  socket.on('state', (state) => {
    players[socket.id] = state;
  });

  socket.on('chat', (msg) => {
    socket.broadcast.emit('chat', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
    delete players[socket.id];
  });
});

setInterval(() => {
  io.emit('players', players);
}, 50); // 20 updates per second

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Multiplayer server running on port ' + PORT);
});
