import React, { Component } from 'react';
import io from 'socket.io';
import logo from './logo.svg';
import './app.css';

const socket = io(); // not specify a URL, since it defaults to trying to connect to the host that serves the page

class App extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    this.fetchHistory();
  }

  fetchHistory = () => {
    fetch('/history')
      .then(res => res.json()) // can't skip this! Or else, the returned stuff is the Response object, not the data I want!
      .then((data) => {
        console.log(data);
        this.setState({ data });
      });
  }

  handleNewRecord = () => {
    socket.emit('new record', { entry });
    socket.on('new record', this.fetchHistory);
  }

  render() {
    const { data } = this.state;
    const entries = data.map(row => <li>{row.entry}</li>);
    return (
      <ul>{entries}</ul>
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
    );
  }
}

export default App;
