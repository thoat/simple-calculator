import React, { Component } from 'react';
import socketIoClient from 'socket.io-client';
import './app.css';

// const socket = socketIoClient(); // not specify a URL, since it defaults to trying to connect to the host that serves the page
// const socket = socketIoClient('ws://localhost:3000'); //, {transports: ['websocket']});

class App extends Component {
  state = {
    data: false,
    socket: socketIoClient('http://127.0.0.1:5000'),
  };

  componentDidMount() {
    const { socket } = this.state;
    socket.on('history', data => this.setState({ data }));
    // this.fetchHistory();
  }

  fetchHistory = () => {
    fetch('/history')
      .then(res => res.json()) // can't skip this! Or else, the returned stuff is the Response object, not the data I want!
      .then((data) => {
        console.log(data);
        this.setState({ data });
      });
  }

  handleNewRecord = (e) => {
    e.preventDefault();
    const { value } = e.target.elements.expression; // e.target returns the "form" object
    console.log(value);
    const { socket } = this.state;
    socket.emit('new record', { entry: value });
    // socket.on('history', data => this.setState({ data }));
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
            <input type="text" name="expression" value="um X * um Y"/>
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
    // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
  }
}

export default App;
