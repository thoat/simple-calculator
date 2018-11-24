import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class CalculatorFrame extends Component {
  static propTypes = {
    onEvaluate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      input: '',
    };
  }

  takeInput = (e) => {
    const nextChar = e.target.value;
    this.setState(state => ({ input: state.input.concat(nextChar) }));
  }

  clearInput = () => {
    this.setState({ input: '' });
  }

  evaluateInputExpr = () => {
    const { input } = this.state;
  }

  render() {
    const { onEvaluate } = this.props;
    const { input } = this.state;
    return (
      <form onSubmit={this.evaluateInputExpr}>
        <div name="expression" border="1px solid black">{input}</div>
        <br />
        <button type="button" onClick={this.takeInput} value="7">7</button>
        <button type="button" onClick={this.takeInput} value="8">8</button>
        <button type="button" onClick={this.takeInput} value="9">9</button>
        <button type="button" onClick={this.takeInput} value="%">%</button>
        <br />
        <button type="button" onClick={this.takeInput} value="4">4</button>
        <button type="button" onClick={this.takeInput} value="5">5</button>
        <button type="button" onClick={this.takeInput} value="6">6</button>
        <button type="button" onClick={this.takeInput} value="x">x</button>
        <br />
        <button type="button" onClick={this.takeInput} value="1">1</button>
        <button type="button" onClick={this.takeInput} value="2">2</button>
        <button type="button" onClick={this.takeInput} value="3">3</button>
        <button type="button" onClick={this.takeInput} value="-">-</button>
        <br />
        <button type="button" onClick={this.clearInput} value="AC" color="red">AC</button>
        <button type="button" onClick={this.takeInput} value="0">0</button>
        <button type="button" onClick={this.takeInput} value=".">.</button>
        <button type="button" onClick={this.takeInput} value="+">+</button>
        <br />
        <input type="submit" value="OK" backgroundColor="green" />
      </form>
    );
  }
}
