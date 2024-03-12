import React, { useEffect, useState } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import HomePagePost from '../HomePagePost/HomePagePost';
import NewPostButton from '../NewPostButton/index';
import { getUserById, getPostById } from '../../api/fetch';

/**
 * whole page
 * @returns tow main component: header and body
 */
function PersonalSelfProfilePage({ user }) {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const makePosts = async () => {
      let presentUser = { id: '1', posts: ['2'] };

      if (!(user.id === 'test')) {
        presentUser = await getUserById(user.id);
      }
      setCurrentUser(presentUser);
      const postsIDList = presentUser.posts;
      const allPosts = [];

      let postObjs = [];

      if (!(user.id === 'test')) {
        postObjs = await Promise.all(postsIDList.map(async (postsID) => getPostById(postsID)));
      }

      for (let i = 0; i < postsIDList.length; i += 1) {
        let postObj = {
          id: '2', date: '2022-10-16T23:21:13.852Z', text: 'lol', user_id: '2', image_url: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80', video_url: '', likes: [], tags: 'photo', comments: [], private: true, isImage: true,
        };
        if (!(user.id === 'test')) {
          postObj = postObjs[i];
        }
        allPosts.push(
          <div className="single-post-container" key={i}>
            <div>
              <HomePagePost postObj={postObj} />
            </div>
          </div>,
        );
      }
      return allPosts;
    };

    async function fetchData() {
      const SelfPosts = await makePosts();
      setPosts(SelfPosts);
    }

    fetchData();
  }, [user.id]);

  return (
    <div>
      {!currentUser ? <div> </div>
        : (
          <div>
            <div className="personal-info-section">
              <div>
                <div>
                  <div className="HorizonalCenter">
                    <div className="user-info-container">
                      <div className="user-avatar-container">
                        <Link data-testid="changeAvatar" to={{ pathname: '/ChangeAvatar' }} className="changeAvatarClass">
                          <div style={{ backgroundImage: `url(${currentUser.avatar_url})` }} className="self_images" />
                        </Link>
                      </div>
                      <div className="user-username-container">
                        <h className="user-username">{currentUser.user_name}</h>
                      </div>
                    </div>

                    <div className="newPostButton">
                      <a href="/CreatePost">
                        <Link data-testid="createPost" to={{ pathname: '/CreatePost' }} className="createPostClass" />
                        <NewPostButton text="New Post" />
                      </a>
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

PersonalSelfProfilePage.propTypes = {
  user: PropTypes.shape,
};

PersonalSelfProfilePage.defaultProps = {
  user: null,
};

export default PersonalSelfProfilePage;
