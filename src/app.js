import React, { Component } from 'react';
import socketIoClient from 'socket.io-client'; /* have to explicitly use this
client library bcz I'm using Node. If I initialize socket inside index.html,
then a standalone build of the client is already exposed by default by the
server at /socket.io/socket.io.js (acc. to the docs). */
import './app.css';

import CalculatorFrame from './components/calculator-frame';
import RecordList from './components/record-list';

class App extends Component {
  state = {
    data: false,
    socket: socketIoClient(window.location.href), /* um, cannot leave this URL
    empty, or else WebSocket will try polling and yield error */
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
        <div className="App">
          <h1 className="App-header">Your Simple Calculator</h1>
          <CalculatorFrame onSubmitRecord={this.handleNewRecord} />
          <RecordList entries={entries} />
        </div>
      );
    }
    return <div><p>Loading...</p></div>;
  }
}

export default App;
