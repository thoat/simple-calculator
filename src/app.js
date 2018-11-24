import React, { Component } from 'react';
import socketIoClient from 'socket.io-client';
import './app.css';

import CalculatorFrame from './components/calculator-frame';
import RecordList from './components/record-list';

// const socket = socketIoClient('ws://localhost:3000'); //, {transports: ['websocket']}); PREVIOUS TROUBLESHOOTING

class App extends Component {
  state = {
    data: false,
    socket: socketIoClient('http://127.0.0.1:5000'), // um, cannot leave this
    // URL empty, or else WebSocket will try polling and yield error
  };

  componentDidMount() {
    const { socket } = this.state;
    socket.on('history', data => this.setState({ data }));
  }

  handleNewRecord = (record) => {
    const { socket } = this.state;
    socket.emit('new record', { entry: record });
  }

  render() {
    const { data } = this.state;
    if (data) {
      const entries = data.map(row => <li key={row.rowid}>{row.entry}</li>);
      return (
        <div>
          <h1>Your Simple Calculator</h1>
          <CalculatorFrame onSubmitRecord={this.handleNewRecord} />
          <RecordList entries={entries} />
        </div>
      );
    } else {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }
  }
}

export default App;
