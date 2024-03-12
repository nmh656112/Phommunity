import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PhommunityIcon from '../../assets/PhommunityIcon.jpg';
import FollowSuggestionIcon from '../../assets/FollowSuggestionIcon.jpg';
import { getAllUsers } from '../../api/fetch';

/**
 * Phommunity Icon
 * @returns the icon of Phommunity
 */
function PhommunityIconReturnFunction() {
  return (
    <a href="/Home">
      <Link data-testid="HomePage" to={{ pathname: '/Home' }} />
      <img className="PhommunityIcon" src={PhommunityIcon} alt="phommunity" />
    </a>

  );
}

/**
 * Follow Suggestion Icon
 * @returns the icon of Follow Suggestion
 */
function FollowSuggestionIconReturnFunction() {
  return (
    <a href="/FollowSuggestion">
      <Link data-testid="FollowSuggestionPage" to={{ pathname: '/FollowSuggestion' }} />
      <img className="FollowSuggestionIcon" src={FollowSuggestionIcon} alt="FollowSuggestion" />
    </a>
  );
}

/**
 * Profile Icon
 * @returns the icon of Profile
 */
function ProfileIconReturnFunction() {
  return (
    <a href="/PersonalSelfProfile">
      <Link data-testid="PersonalSelfPage" to={{ pathname: '/PersonalSelfProfile' }} />
      profile
    </a>
  );
}

/**
 * Logout Icon
 * @returns the icon of Logout
 */
function LogoutIconReturnFunction({ userLogout }) {
  return (
    <button onClick={() => userLogout()} type="button" id="logoutBtn">
      <Link to={{ pathname: '/' }}>
        logout
      </Link>
    </button>
  );
}

LogoutIconReturnFunction.propTypes = {
  userLogout: PropTypes.func,
};

LogoutIconReturnFunction.defaultProps = {
  userLogout: null,
};

/**
 * Login component
 * @returns Login elements
 */
function Header({ user, logout }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const searchUser = async (event) => {
    event.preventDefault();

    const letterNumber = /^[0-9a-zA-Z]+$/;
    if (!username.match(letterNumber)) {
      setUsername('test');
    } else if (username.length > 15) {
      setUsername('test');
    } else {
      let match = false;
      let matchedUserId = '';

      // fetch data from the backend
      const userDataFromBackend = await getAllUsers();

      userDataFromBackend.forEach((element) => {
        if (element.user_name === username) {
          match = true;
          matchedUserId = element._id;
        }
      });
      setUsername('');

      if (match) {
        if (matchedUserId !== user.id) {
          navigate(`/PersonalUserProfile/${matchedUserId}`);
        } else {
          navigate('/PersonalSelfProfile');
        }
      } else {
        navigate('/FollowSuggestion');
      }
    }
  };

  const userLogout = () => {
    logout();
  };

  return (
    <div>
      <div data-testid="Header" className="Header">

        <PhommunityIconReturnFunction />

        <div className="UserSearch">
          <input className="UserSearchBar" placeholder="input username to find a user" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button className="UserSearchBarButton" data-testid="UserSearchButton" type="button" onClick={(e) => searchUser(e)}>
            <span role="img" aria-label="search">
              <svg viewBox="64 64 896 896" focusable="false" data-icon="search" width="1em" height="0.9em" fill="currentColor" aria-hidden="true">
                <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
              </svg>
            </span>
          </button>
        </div>

        <div className="OutmostHeaderRight">

          <div className="HeaderMostRightPart">

            <div className="ActivityIconToLogoutIcon HeaderMostRightPart">

              {/* Activity feed and follow suggestion icon */}
              <div className="HeaderExceptPhommunityIcon FollowAndActivity">

                <div className="HeaderExceptPhommunityIcon ImgIcon">

                  {/* <ActivityFeedIconReturnFunction/> */}

                </div>

                <div className="HeaderExceptPhommunityIcon ImgIcon">

                  <FollowSuggestionIconReturnFunction />

                </div>

              </div>

              {/* profile and logout link component */}
              <div className="HeaderExceptPhommunityIcon">

                <div className="HeaderExceptPhommunityIcon TextIcon">

                  <ProfileIconReturnFunction />

                </div>

                <div className="HeaderExceptPhommunityIcon TextIcon">
                  |
                </div>

                <div className="HeaderExceptPhommunityIcon TextIcon">

                  <LogoutIconReturnFunction userLogout={userLogout} />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <hr align="center" color="#0abab5" />

    </div>
  );
}

Header.propTypes = {
  logout: PropTypes.func,
  user: PropTypes.element,
};

Header.defaultProps = {
  logout: null,
  user: null,
};

export default Header;
