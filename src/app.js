import React, { Component } from 'react';
import logo from './logo.svg';
import './app.css';

class App extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    fetch('/history')
      .then(res => res.json())
      .then((data) => {
        // if (err) throw err;
        console.log(data);
        // console.log(res.body);
        this.setState({ data });
      });
  }

  render() {
    const { data } = this.state;
    const entries = data.map(member => <li>{member.name + member.team}</li>);
    return (
      <ol>{entries}</ol>
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
