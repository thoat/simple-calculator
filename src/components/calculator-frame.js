/* eslint-disable no-alert */
import * as math from 'mathjs-expression-parser';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

function Token(type, value) {
  this.type = type;
  this.value = value;
}

function isDigit(ch) {
  return /\d/.test(ch);
}

function isOperator(ch) {
  return /\+|-|\*|\//.test(ch);
}

export default class CalculatorFrame extends Component {
  static propTypes = {
    onSubmitRecord: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      decimalAlready: false,
      inputTokens: [],
      numBuffer: [],
    };
  }

  validateInput = (char) => {
    const { decimalAlready, inputTokens, numBuffer } = this.state;

    /* Rule: First token can be anything but * and / */
    if (!inputTokens.length
      && (!numBuffer.length || isOperator(numBuffer[numBuffer.length - 1]))
      && (char === '*' || char === '/')) {
      alert('Invalid first input'); return false;
    }

    /* Rule: Decimal point cannot repeat within a single number */
    if (decimalAlready && char === '.') {
      alert('Invalid decimal point'); return false;
    }

    if (inputTokens.length) {
      const lastToken = inputTokens[inputTokens.length - 1];

      /* Rule: Operators cannot be succeeded by another operator, except for + and - */
      if (lastToken.type === 'Operator'
        // check in case numBuffer is holding some value not yet emptied out
        && (!numBuffer.length || isOperator(numBuffer[numBuffer.length - 1]))
        && (char === '*' || char === '/')) {
        alert('Invalid operator'); return false;
      }

      /* Rule: No 0 literal is allowed after a / operator */
      // isOperator(char) === true signals numBuffer to be joined at this point,
      // telling us whether a 0 literal is submitted
      if (isOperator(char) && lastToken.value === '/' && parseInt(numBuffer.join(''), 10) === 0) {
        alert('No division by 0'); return false;
      }
    }

    return true;
  }

  takeInput = (e) => {
    const char = e.target.value;
    const inputIsValid = this.validateInput(char);

    if (!inputIsValid) return;

    if (isDigit(char) || char === '.') {
      // console.log('case 1');
      this.setState(state => ({
        decimalAlready: state.decimalAlready || char === '.',
        numBuffer: [...state.numBuffer, char],
      }));
    } else if (isOperator(char)) {
      const { inputTokens, numBuffer } = this.state;

      // special case: + or - preceeding an operant e.g. '+2' or '3 * --+-1'
      if ((char === '+' || char === '-')
        && (!inputTokens.length
          || inputTokens[inputTokens.length - 1].type === 'Operator')
        && (!numBuffer.length
          || isOperator(numBuffer[numBuffer.length - 1]))) {
        // console.log('case 2');
        this.setState(state => ({
          numBuffer: [...state.numBuffer, char],
        }));
      } else {
        // console.log('case 3');
        if (numBuffer.length) {
          const newNum = numBuffer.join('');
          this.setState(state => ({
            inputTokens: [...state.inputTokens, new Token('Literal', newNum)],
            numBuffer: [],
            decimalAlready: false,
          }));
        }
        this.setState(state => ({
          inputTokens: [...state.inputTokens, new Token('Operator', char)],
        }));
      }
    }
  }

  clearInput = () => {
    this.setState({ inputTokens: [], numBuffer: [], decimalAlready: false });
  }

  deleteLastChar = () => {
    const { inputTokens, numBuffer } = this.state;

    if (numBuffer.length) {
      const newArr = numBuffer.slice();
      newArr.splice(-1, 1);
      this.setState({ numBuffer: newArr });
    } else if (inputTokens.length) {
      const newArr = inputTokens.slice();
      newArr.splice(-1, 1);
      this.setState({ inputTokens: newArr });
    }
  }

  evaluateExpr = () => {
    const { inputTokens } = this.state;
    const input = inputTokens.map(token => token.value).join(' ');
    const output = math.eval(input);
    const newRecord = `${input} = ${output}`;
    const { onSubmitRecord } = this.props;
    onSubmitRecord(newRecord);
    this.clearInput();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { inputTokens, numBuffer } = this.state;

    /* Rule: No empty submission */
    if (!inputTokens.length) {
      alert('Cannot submit empty'); return;
    }

    /* Rule: Last token must be either a digit or a valid decimal point */
    if (!numBuffer.length || isOperator(numBuffer[numBuffer.length - 1])) {
      alert('Cannot end with an operator'); return;
    }

    /* Rule: No 0 literal is allowed after a / operator */
    const lastToken = inputTokens[inputTokens.length - 1];
    if (lastToken.value === '/' && parseInt(numBuffer.join(''), 10) === 0) {
      alert('No division by 0'); return;
    }

    // empty out everything in numBuffer
    const newNum = numBuffer.join('');
    this.setState(state => ({
      inputTokens: [...state.inputTokens, new Token('Literal', newNum)],
    }), () => {
      this.evaluateExpr();
    });
  }

  render() {
    const { inputTokens, numBuffer } = this.state;
    let inputStr = '';
    if (inputTokens.length) {
      inputStr = inputTokens.map(token => token.value).join(' ');
      inputStr = inputStr.concat(' '); // space b4 concat anything else after
    }
    // console.log('numBuffer', numBuffer);
    inputStr = inputStr.concat(numBuffer.join(''));
    return (
      <form id="calculator-frame" onSubmit={this.handleSubmit}>
        <div id="expression-textarea" border="1px solid black">{inputStr}</div>
        <button className="clear-btn spanning-btn" type="button" onClick={this.clearInput} value="CLEAR ALL" color="red">CLEAR ALL</button>
        <br />
        <div className="keyboard-row">
          <button type="button" onClick={this.takeInput} value="7">7</button>
          <button type="button" onClick={this.takeInput} value="8">8</button>
          <button type="button" onClick={this.takeInput} value="9">9</button>
          <button className="operator-btn" type="button" onClick={this.takeInput} value="/">/</button>
        </div>
        <div className="keyboard-row">
          <button type="button" onClick={this.takeInput} value="4">4</button>
          <button type="button" onClick={this.takeInput} value="5">5</button>
          <button type="button" onClick={this.takeInput} value="6">6</button>
          <button className="operator-btn" type="button" onClick={this.takeInput} value="*">*</button>
        </div>
        <div className="keyboard-row">
          <button type="button" onClick={this.takeInput} value="1">1</button>
          <button type="button" onClick={this.takeInput} value="2">2</button>
          <button type="button" onClick={this.takeInput} value="3">3</button>
          <button className="operator-btn" type="button" onClick={this.takeInput} value="-">-</button>
        </div>
        <div className="keyboard-row">
          <button className="clear-btn" type="button" onClick={this.deleteLastChar} value="DEL" color="red">DEL</button>
          <button type="button" onClick={this.takeInput} value="0">0</button>
          <button type="button" onClick={this.takeInput} value=".">.</button>
          <button className="operator-btn" type="button" onClick={this.takeInput} value="+">+</button>
        </div>
        <input id="submit-btn" className="spanning-btn" type="submit" value="OK" backgroundColor="green" />
      </form>
    );
  }
}
