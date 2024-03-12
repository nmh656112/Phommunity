import './index.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import SimplifiedHeader from '../SimplifiedHeader/SimplifiedHeader';
import { loginAuser } from '../../api/fetch';

function LoginPage({ updateUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('Welcome To Phommunity!');
  const navigate = useNavigate();

  const loginUser = async (event) => {
    event.preventDefault();

    const letterNumber = /^[0-9a-zA-Z]+$/;
    if (!username.match(letterNumber)) {
      setNotification('Please only enter alphanumeric username!');
      setUsername('');
      setPassword('');
    } else if (!password.match(letterNumber)) {
      setNotification('Please only enter alphanumeric password!');
      setUsername('');
      setPassword('');
    } else if (username.length > 15 || password.length > 15) {
      setNotification('We only allow input less or equal to 15 characters');
    } else {
      const result = await loginAuser(username, password);
      // console.log(result);
      // console.log(result.data);
      // console.log(result.token);
      if (result.status === 201) {
        setNotification('Login Successfully');
        // console.log(result);
        result.data.id = result.data._id;
        updateUser(result.data);
        sessionStorage.setItem('app-token', result.token);
        navigate('/');
      } else {
        if (result.status === 410) {
          setNotification('account has been locked for 2 hours due to 3 consecutive login failures, please wait.');
        } else if (result.status === 409) {
          setNotification('Password incorrect. Notice: your account will be locked after 3 login failures.');
        } else {
          setNotification('Password/username incorrect, please type again');
        }
        setUsername('');
        setPassword('');
      }
      /*
      let match = false;
      let matchedUserId = '';

      // fetch data from the backend
      const userDataFromBackend = await getAllUsers();

      // determine if the input data matches a record in the database
      userDataFromBackend.forEach((element) => {
        if (element.user_name === username && element.password === password) {
          match = true;
          matchedUserId = element._id;
        }
      });
      // if matched, get the matched information from the database and update user in localstorage
      if (match) {
        setNotification('Login Successfully');
        const matchedUser = await getUserById(matchedUserId);
        matchedUser.id = matchedUser._id;
        updateUser(matchedUser);
        navigate('/');
      } else {
        setNotification('Password/username incorrect, please type again');
        setUsername('');
        setPassword('');
      } */
    }
  };

  return (
    <div>
      <SimplifiedHeader />
      <div id="login">
        <div className="welcomInfo_container">
          <div className="main-header-bar">
            <div className="phommunity-panel-header">
              <div className="phommunity-row">
                <p>{notification}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="panel_container">
          <div className="panel">
            <div className="flash-messages">
              <div id="session_warning_container" />
            </div>
            <div className="phommunity-wireframe-panel-body">
              <form className="simple_form form-vertical single-column-form" id="sign_in" action="/" method="post">

                <input type="hidden" name="authenticity_token" />
                <div className="form-group username optional username input-div">
                  <label className="control-label username optional" htmlFor="user_username">
                    Username
                    <abbr className="required disclaimer-basic">*</abbr>

                    <br />
                    <input
                      className="form-control string username optional form-input"
                      type="username"
                      name="user[username]"
                      id="user_username"
                      aria-label="username-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </label>
                  <div />
                </div>

                <div className="form-group password optional user_password input-div">
                  <label className="control-label password optional input-label" htmlFor="user_username">
                    Password
                    <abbr className="required disclaimer-basic">*</abbr>

                    <br />
                    <input
                      className="form-control password optional form-input"
                      type="password"
                      name="user[password]"
                      id="user_password"
                      data-testid="password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <div />
                </div>

                <div className="phommunity-wireframe-links">
                  <Link to={{ pathname: '/Registration' }}>Need an account? Join us Now!</Link>
                </div>

                <div className="phommunity-row">
                  <button name="button" type="submit" className="button phommunity-button phommunity-button-primary" id="submit_btn" onClick={(e) => loginUser(e)}>Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  updateUser: PropTypes.func,
};
LoginPage.defaultProps = {
  updateUser: () => { },
};
export default LoginPage;
