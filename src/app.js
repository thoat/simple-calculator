import React, { Component } from 'react';
import socketIoClient from 'socket.io-client';
import './app.css';

// const socket = socketIoClient('ws://localhost:3000'); //, {transports: ['websocket']}); OLDER TROUBLESHOOTING

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

  handleNewRecord = (e) => {
    e.preventDefault();
    const { value } = e.target.elements.expression; // e.target returns the "form" object
    console.log(value);
    const { socket } = this.state;
    socket.emit('new record', { entry: value });
  }

  render() {
    const { data } = this.state;
    if (data) {
      const entries = data.map(row => <li key={row.rowid}>{row.entry}</li>);
      return (
        <div>
          <ul>{entries}</ul>
          <form onSubmit={this.handleNewRecord}>
            {'Enter an expression: '}
            <input type="text" name="expression" value="xYxYxY"/>
            <br />
            <input type="submit" value="Submit" />
          </form>
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
