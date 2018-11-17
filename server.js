const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

// PART 1: Open DB connection

const prod = process.env.NODE_ENV === 'production';
if (prod) {
  app.use(express.static(`${__dirname}/build`));
  app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/build/index.html`);
  });
} else {
  app.use(express.static(`${__dirname}/public`));
  app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
  });
}

io.on('connection', (socket) => {
  // here you can start emitting events to the client
  socket.emit('event name', { some: 'data' });
});

// PART 2: WebSocket & events

// const port = 8000;
// io.listen(port);
// console.log('Listening on port ', port);
