import './index.css';
import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import TitleImg from '../../assets/title.jpg';

function TitlePhommunity() {
  return (
    <div className="titlePhommunity">
      <Link to={{ pathname: '/' }}>
        <img src={TitleImg} alt="titleImg" />
      </Link>
    </div>
  );
}

function LogInAndSignUp() {
  return (
    <div className="loginAndSignUp-Body">
      <div className="loginAndSignUp">
        <Link to={{ pathname: '/Login' }}> login </Link>
        /
        <Link to={{ pathname: '/Registration' }}>Sign Up</Link>
      </div>
    </div>
  );
}

function SimplifiedHeader(props) {
  const { loginVisible } = props;
  if (loginVisible) {
    return (
      <div className="homePageHeader">
        <TitlePhommunity />
        <LogInAndSignUp />
        <br />
        <hr align="center" color="#0abab5" />
      </div>
    );
  }
  return (
    <div className="homePageHeader">
      <TitlePhommunity />
      <br />
      <br />
      <hr align="center" color="#0abab5" />
    </div>
  );
}

SimplifiedHeader.propTypes = {
  loginVisible: PropTypes.bool,
};
SimplifiedHeader.defaultProps = {
  loginVisible: null,
};

export default SimplifiedHeader;
