import './index.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getFollowSuggestion, getUserById } from '../../api/fetch';
// import UserAvatar from '../UserAvatar/UserAvatar';

/**
 * whole follow suggestion page
 * @returns tow main component: header and body
 */
function FollowSuggestionPage({ user }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUserSuggestion = async () => {
      let suggestedUsers = [];
      if (!(user.id === 'test')) {
        suggestedUsers = await getFollowSuggestion(user.id);
      }
      // let curSelfUser = { id: 'test', followees: ['test', 'test'] };
      // const curFollowees = curSelfUser.followees;
      // const map = new Map();
      // await Promise.all(
      //   curFollowees.map(async (curFollowee) => {
      //     let curFolloweeObj = { followers: ['test'] };
      //     if (!(user.id === 'test')) {
      //       curFolloweeObj = await getUserById(curFollowee);
      //     }
      //     const curFolloweeFollwer = curFolloweeObj.followers;
      //     for (let i = 0; i < curFolloweeFollwer.length; i += 1) {
      //       const tmp = curFolloweeFollwer[i];
      //       if (map.get(tmp)) {
      //         map.set(tmp, map.get(tmp) + 1);
      //       } else {
      //         map.set(tmp, 1);
      //       }
      //     }
      //   }),
      // );
      // const tmpSuggestUsers = [];
      // map.forEach((value, key) => {
      //   if (value > 2) {
      //     tmpSuggestUsers.push(key);
      //   }
      // });
      // for (let j = 0; j < tmpSuggestUsers.length; j += 1) {
      //   const tmp = tmpSuggestUsers[j];

      //   if (!(tmp.toString() === user.id) && !curFollowees.includes(tmp)) {
      //     suggestedUsers.push(tmp);
      //   }
      // }
      // if (curFollowees.length < 3) {
      //   // cold start
      //   suggestedUsers = [];
      // }
      const allUsers = [];
      await Promise.all(
        suggestedUsers.map(async (curUser) => {
          const suggestedUser = await getUserById(curUser);
          allUsers.push(
            <div className="homepage-single-post-container">
              <div>
                <div>
                  <Link data-testid="personalUserProfile" to={{ pathname: `/PersonalUserProfile/${suggestedUser._id}` }} className="homeLinkTab">
                    <div className="userInfo">
                      <div style={{ backgroundImage: `url(${suggestedUser.avatar_url})` }} className="images" />
                      <span>{suggestedUser.user_name}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>,
          );
        }),
      );
      setUsers(allUsers);
    };
    async function fetchData() {
      await getUserSuggestion();
    }
    fetchData();
  }, [user.id]);

  return (
    <div>
      <div id="followerSuggestionTitleContainer">
        Follower Suggestion
      </div>
      {
        !users ? <div />
          : <div data-testid="homepagePostsContainerId" className="homepage-posts-container">{users}</div>
      }
    </div>
  );
}
FollowSuggestionPage.propTypes = {
  user: PropTypes.func,
  id: PropTypes.string,
};
FollowSuggestionPage.defaultProps = {
  user: () => { },
  id: null,
};

export default FollowSuggestionPage;
