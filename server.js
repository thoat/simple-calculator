/* eslint-disable no-console */
const { Pool } = require('pg');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// const index = require('./routes/index');

const app = express();
// app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

/* Use a connection pool instead of a single Client because this app
will make frequent queries */
const db = new Pool({
  connectionString: 'postgres://thoa2:sezzle2K!8@localhost:5433/calc_db', // process.env.DATABASE_URL,
});

/* The pool will emit an error on behalf of any idle clients it
contains if a backend error or network partition happens */
db.on('error', (err) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

const GET_HISTORY_QUERY = 'SELECT * FROM top10hist_tbl ORDER BY created_at DESC LIMIT 10;';

const emitHistory = async (emitter) => {
  try {
    const { rows } = await db.query(GET_HISTORY_QUERY);
    emitter.emit('history', rows);
  } catch (err) {
    console.error(`Error &^&^: ${err}`);
  }
};

const SAVE_RECORD_QUERY = 'INSERT INTO top10hist_tbl (entry) VALUES ';

const saveNewRecord = async (data) => {
  try {
    const { entry } = data;
    console.log('neww recorddd', data);
    const query = `${SAVE_RECORD_QUERY} ('${entry}');`;
    console.log('query:', query);
    await db.query(query);
    emitHistory(io);
  } catch (err) {
    console.error(`Error &^&^: ${err}`);
  }
};

io.on('connection', (socket) => {
  console.log('New client connected', emitHistory(socket));
  socket.on('new record', data => saveNewRecord(data));
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// when to?
// await pool.end();

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

const port = process.env.PORT || 5000;
server.listen(port, console.log(`Listening on ${port}...`));
