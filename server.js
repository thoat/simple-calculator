const express = require('express');

const app = express();
const { Client } = require('pg');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 5000;

const GET_HISTORY_QUERY = 'SELECT entry, date_created '
  + 'FROM calculations_history '
  + 'LIMIT 10;';
const SAVE_HISTORY_QUERY = 'INSERT INTO calculations_history (entry) '
  + 'VALUES ';
const DELETE_OLDEST_QUERY = 'DELETE FROM calculations_history AS h'
  + 'WHERE id = ('
  + 'SELECT id FROM h '
  + 'LIMIT 1'
  + ');';

// // PART 1: Open DB connection
const client = new Client({
  connectionString: 'postgres://thoa1:20181118SUN@localhost:5433/standup_db', // process.env.DATABASE_URL,
});

// app.use(express.json());

app.get('/history', (request, response) => {
  client.connect()
    .then(client.query('SELECT * FROM members LIMIT 10;', (err, res) => {
      if (err) throw err;
      response.send(res.rows);
      client.end();
    })).catch(err => console.log(err));
});
// getHistory = (socket) => {
//   client.connect();
//   client.query(GET_HISTORY_QUERY, (err, res) => {
//     if (err) throw err;
//     let data = null;
//     // data = res.rows.map((row) => { JSON.stringify(row) }); ??am I sure? is this data an array or an object?
//     socket.emit('message', data);
//     client.end();
//   }
//   );
// }

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
const onConnection = (socket) => {
  socket.on('new record', (data) => {
    socket.broadcast.emit('new record', data);
  });
};

// io.on('conncection', onConnection);

// io.on('connection', (socket) => {
//   // receive new records to save from front-end
//   socket.on('new record', saveNewRecord(socket, data));
//   socket.emit('event name', { some: 'data' });
// });

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

// eslint-disable-next-line no-console
http.listen(port, () => console.log(`Listening on ${port}...`));
