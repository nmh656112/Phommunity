import './index.css';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HomePagePost from '../HomePagePost/HomePagePost';
import { updateUser, getUserById, getPostById } from '../../api/fetch';

/**
 * New post button component
 * @returns element of new post button
 */
function NewPostButtonComponent({ user, id }) {
  const tmpUser = user;

  const [isFollowed, setIsFollowed] = useState(false);

  function checkFollower(follower) {
    return !(follower === tmpUser._id);
  }

  function checkFollowee(followee) {
    return !(followee === id);
  }

  const followAndUnfollowUser = async (event) => {
    event.preventDefault();
    setIsFollowed(!isFollowed);

    // update followers
    if (!isFollowed) {
      tmpUser.followees.push(id);
    } else {
      tmpUser.followees = tmpUser.followees.filter(checkFollowee);
    }
    if (!(tmpUser.id === 'test')) {
      await updateUser(tmpUser);
    }

    // update followees
    let otherUser = {
      id: 'test', posts: ['2'], followers: [], followees: [],
    };
    if (!(tmpUser.id === 'test')) {
      otherUser = await getUserById(id);
    }

    if (!isFollowed) {
      otherUser.followers.push(tmpUser._id);
    } else {
      otherUser.followers = otherUser.followers.filter(checkFollower);
    }
    if (!(tmpUser.id === 'test')) {
      await updateUser(otherUser);
    }
  };

  useEffect(() => {
    // console.log(user.followees);
    // console.log(id);
    if (user.followees.includes(id)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [id, user.followees]);

  const text = isFollowed ? 'unfollow' : 'follow';

  return (
    <div data-testid="followAndUnfollowUserButton" className="HorizonalCenter"><button type="button" className="btn" onClick={(e) => followAndUnfollowUser(e)}>{text}</button></div>
  );
}

NewPostButtonComponent.propTypes = {
  user: PropTypes.shape,
  id: PropTypes.string,
};

NewPostButtonComponent.defaultProps = {
  user: null,
  id: 'null',
};

/**
 * whole page
 * @returns tow main component: header and body
 */
function PersonalUserProfilePage({ user }) {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPageUser, setCurrentPageUser] = useState(null);
  const [CurrentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const makePosts = async () => {
      let pageUser = {
        id: 'test', posts: ['2'], followers: ['test'], followees: ['test'],
      };
      if (!(user.id === 'test')) {
        pageUser = await getUserById(id);
      }
      setCurrentPageUser(pageUser);

      let presentUser = {
        id: 'test', posts: ['2'], followers: ['test'], followees: ['test'],
      };
      if (!(user.id === 'test')) {
        presentUser = await getUserById(user.id);
      }

      setCurrentUser(presentUser);

      const postsIDList = pageUser.posts;

      const allPosts = [];

      let postObjs = [];

      if (!(user.id === 'test')) {
        postObjs = await Promise.all(postsIDList.map(async (postsID) => getPostById(postsID)));
      }
      for (let i = 0; i < postsIDList.length; i += 1) {
        let postObj = {
          id: '2', date: '2022-10-16T23:21:13.852Z', text: 'lol', user_id: '2', image_url: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80', video_url: '', likes: [], tags: 'photo', comments: [], private: false, isImage: true,
        };
        if (!(user.id === 'test')) {
          postObj = postObjs[i];
        }
        if (!postObj.private) {
          allPosts.push(
            <div className="single-post-container" key={i}>
              <div>
                <HomePagePost postObj={postObj} />
              </div>
            </div>,
          );
        }
      }
      return allPosts;
    };

    async function fetchData() {
      const SelfPosts = await makePosts();
      setPosts(SelfPosts);
    }

    fetchData();
  }, [id, user.id]);

  return (
    <div>
      {!(currentPageUser && CurrentUser) ? <div> </div>
        : (
          <div>
            <div className="personal-info-section">
              <div>
                <div>
                  <div className="HorizonalCenter">
                    <div className="user-info-container">
                      <div className="user-avatar-container">
                        <div data-testid="avatar" style={{ backgroundImage: `url(${currentPageUser.avatar_url})` }} className="self_images" />
                        <div />
                      </div>
                      <div data-testid="username" className="user-username-container">
                        <h className="user-username">{currentPageUser.user_name}</h>
                      </div>
                    </div>

                    <div data-testid="newPostButton" className="newPostButton">
                      <NewPostButtonComponent user={CurrentUser} id={id} />
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div>
              <div data-testid="posts" className="personal-page-posts-container">
                {posts}
              </div>
            </div>
          </div>
        )}

    </div>
  );
}

PersonalUserProfilePage.propTypes = {
  user: PropTypes.shape,
};

PersonalUserProfilePage.defaultProps = {
  user: null,
};

export default PersonalUserProfilePage;
