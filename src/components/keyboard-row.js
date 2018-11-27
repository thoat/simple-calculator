import PropTypes from 'prop-types';
import React from 'react';

const KeyboardRow = ({ keys, onKeyClick }) => (
  <div className="keyboard-row">
    <button type="button" onClick={onKeyClick} value={keys[0]}>{keys[0]}</button>
    <button type="button" onClick={onKeyClick} value={keys[1]}>{keys[1]}</button>
    <button type="button" onClick={onKeyClick} value={keys[2]}>{keys[2]}</button>
    <button className="operator-btn" type="button" onClick={onKeyClick} value={keys[3]}>{keys[3]}</button>
  </div>
);

KeyboardRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  keys: PropTypes.array.isRequired,
  onKeyClick: PropTypes.func.isRequired,
};

export default KeyboardRow;
