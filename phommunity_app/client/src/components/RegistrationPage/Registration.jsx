import './index.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimplifiedHeader from '../SimplifiedHeader/SimplifiedHeader';
import { getAllUsers, registerNewUser } from '../../api/fetch';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState('Welcome To Phommunity!');
  const navigate = useNavigate();

  const registerUser = async (event) => {
    event.preventDefault();
    const letterNumber = /^[0-9a-zA-Z]+$/;
    let pass = true;
    let userDataFromBackend;

    // username check
    if (!username.match(letterNumber)) {
      setNotification('Please only enter alphanumeric username!');
      pass = false;
    } else {
      userDataFromBackend = await getAllUsers();
      // verify if the username exists
      let usernameExists = false;

      // check the username existance
      userDataFromBackend.forEach((element) => {
        if (element.user_name === username) {
          usernameExists = true;
        }
      });

      if (usernameExists) {
        setNotification('username already exists');
        pass = false;
      }
    }

    // password check
    if (!password.match(letterNumber)) {
      setNotification('Please only enter alphanumeric password!');
      pass = false;
    } else if (password.length < 8) {
      setNotification('Please use a longer password');
      pass = false;
    } else {
      let numberFlag = false;
      let letterFlag = false;
      let i = 0;
      while (i < password.length) {
        // const ch = password.charAt(i);
        const asc = password.charCodeAt(i);
        if ((asc >= 65 && asc <= 90) || (asc >= 97 && asc <= 122)) {
          letterFlag = true;
        } else if (asc >= 48 && asc <= 57) {
          numberFlag = true;
        }
        i += 1;
        // console.log(`Checking char ${ch}, if it is a number: ${asc >= 48 && asc <= 57}`);
        // console.log(`Checking char ${ch}, if it is a alphabet: ${letterFlag}`);
      }
      if (!numberFlag || !letterFlag) {
        setNotification('Please contain both numbers and alphabets in your password');
        pass = false;
      }
    }

    // email check
    if (!email.includes('@') || !email.includes('.')) {
      setNotification('Please use correct email address');
      pass = false;
    } else {
      let emailExists = false;
      userDataFromBackend = await getAllUsers();
      // check email existence
      userDataFromBackend.forEach((element) => {
        if (element.email === email) {
          emailExists = true;
        }
      });

      if (emailExists) {
        setNotification('email already exists');
        pass = false;
      }
    }

    if (pass) {
      const status = await registerNewUser(username, email, password);

      if (status === 201) {
        // setNotification('Registration Success');
        navigate('/Login');
      } else {
        setNotification('Registration failed for unknown reasons');
      }
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div>
      <SimplifiedHeader />
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
                    data-testid="username-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
                <div />
              </div>

              <div className="form-group email optional input-div">
                <label className="control-label email optional" htmlFor="user_email">
                  Email
                  <abbr className="required disclaimer-basic">*</abbr>

                  <br />
                  <input
                    className="form-control string email optional form-input"
                    type="email"
                    name="user[email]"
                    id="user_email"
                    data-testid="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <div />
              </div>

              <div className="form-group password optional user_password input-div">
                <label className="control-label password optional input-label" htmlFor="user_password">
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

              <div className="PasswordRequirement-container">
                <p>
                  Password needs to contain:
                  {' '}
                  <br />
                  1. At lease 8 characters
                  {' '}
                  <br />
                  2. Contains at least 1 Alphabet
                  {' '}
                  <br />
                  3. Contains at lease 1 Number
                </p>
              </div>

              <div className="phommunity-row">
                <button name="button" type="submit" className="button phommunity-button phommunity-button-primary" id="submit_btn" data-testid="submit-btn" onClick={(e) => registerUser(e)}>Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
