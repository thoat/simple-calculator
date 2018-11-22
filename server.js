/* eslint-disable no-console */
const { Client } = require('pg');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 5000;
const dbClient = new Client({
  connectionString: 'postgres://thoa2:sezzle2K!8@localhost:5433/calc_db', // process.env.DATABASE_URL,
});
const index = require('./routes/index');

const app = express();
app.use(index);

const server = http.createServer(app);

const GET_HISTORY_QUERY = 'SELECT * FROM top10hist_tbl LIMIT 10;';

const fetchHistory = async (socket) => {
  try {
    await dbClient.connect();
    const res = await dbClient.query(GET_HISTORY_QUERY);
    await dbClient.end();
    socket.emit('history', res.rows);
  } catch (err) {
    console.error(`Error &^&^: ${err}`);
  }
};

const SAVE_RECORD_QUERY = 'INSERT INTO top10hist_tbl (entry) VALUES ';
const DELETE_OLDEST_QUERY = 'DELETE FROM top10hist_tbl WHERE rowid = ('
  + 'SELECT rowid FROM top10hist_tbl LIMIT 1);';

const io = socketIo(server);
io.on('connection', (socket) => {
  console.log('New client connected', fetchHistory(socket));
  socket.on('disconnect', () => console.log('Client disconnected'));
});


// app.use(express.json());

// app.get('/history', (request, response) => {
//   client.connect()
//     .then(client.query(GET_HISTORY_QUERY, (err, res) => {
//       if (err) throw err;
//       response.send(res.rows);
//       client.end();
//     })).catch(err => console.log(err));
// });

// saveHistory = (socket, data) => {
//   client.connect();
//   let updateHistoryQuery =
//     SAVE_HISTORY_QUERY
//     + `(${data});` //TODO: verify if this is correct format
//     + DELETE_OLDEST_QUERY;
//   client.query(updateHistoryQuery, (err, res) => {
//     if (err) throw err;
//     socket.broadcast.emit('new record added');
//   })
//   client.end();
// }

// PART 2: WebSocket & events
// this will listen for new records updated. TODO: I also want the history to load at appload.
// const onConnection = (socket) => {
//   socket.on('new record', (data) => {
//     console.log('hello from server', data.entry);
//     // save to database
//     io.emit('new record');
//   });
//   socket.on('disconnect', () => console.log('socket disconnected'));
// };

// io.on('connection', onConnection);

// io.on('connection', (socket) => {
//   // receive new records to save from front-end
//   socket.on('new record', saveNewRecord(socket, data));
//   socket.emit('event name', { some: 'data' });
// });

// For Heroku deployment
// const prod = process.env.NODE_ENV === 'production';
// if (prod) {
//   app.use(express.static(`${__dirname}/build`));
//   app.get('*', (req, res) => {
//     res.sendFile(`${__dirname}/build/index.html`);
//   });
// } else {
//   app.use(express.static(`${__dirname}/public`));
//   app.get('*', (req, res) => {
//     res.sendFile(`${__dirname}/public/index.html`);
//   });
// }

server.listen(port, console.log(`Listening on ${port}...`));
