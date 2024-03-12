import './index.css';
import React from 'react';
import PropTypes from 'prop-types';

function DefinedButton({ text }) {
  return <button data-testid="testBtnId" type="button" className="btn">{text}</button>;
}

DefinedButton.propTypes = {
  text: PropTypes.shape,
};

DefinedButton.defaultProps = {
  text: null,
};

export default DefinedButton;
