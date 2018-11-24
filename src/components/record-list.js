import PropTypes from 'prop-types';
import React from 'react';

const RecordList = ({ entries }) => (
  <div>
    <h4>Last 10 entries:</h4>
    <ul>{entries}</ul>
  </div>
);

RecordList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  entries: PropTypes.array.isRequired,
};

export default RecordList;
