import './index.css';
import React from 'react';
import PropTypes from 'prop-types';

function LoginRegisSubmitBtn(props) {
  const { text } = props;

  return (
    <div className="phommunity-row">
      <button data-testid="testBtnId" name="button" type="submit" className="button phommunity-button phommunity-button-primary" id="sign_in">{text}</button>
    </div>
  );
}
LoginRegisSubmitBtn.propTypes = {
  text: PropTypes.string,
};
LoginRegisSubmitBtn.defaultProps = {
  text: 'Login',
};
export default LoginRegisSubmitBtn;
