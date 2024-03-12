import React, { useState, useEffect } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { LikeOutlined, CommentOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getActivityFeed, getUserById } from '../../api/fetch';

/**
 * whole page
 * @returns main component: recommendation posts
 */
function HomePage({ user }) {
  const [posts, setPosts] = useState([]);
  const [postss, setPostss] = useState([]);

  const fetchMoreData = () => {
    setTimeout(() => {
      if (postss.length + 10 > posts.length) {
        setPosts(posts.concat(posts));
      }
      setPostss(postss.concat(posts.slice(postss.length, postss.length + 10)));
    }, 150);
  };

  useEffect(() => {
    const getFolloweesPosts = async () => {
      let activityFeed = null;
      if (user.id === 'test') {
        activityFeed = [{
          post: {
            user_id: 'test', _id: 'tsest', isImage: true, image_url: 'test', video_url: 'test', likes: [], comments: [], text: 'test',
          },
          user: {
            _id: 'test', avatar_url: 'atest', user_name: 'name-test',
          },
        }, {
          post: {
            user_id: 'test', _id: 'tsest', isImage: true, image_url: 'test', video_url: 'test', likes: [], comments: [], text: 'test',
          },
          user: {
            _id: 'test', avatar_url: 'atest', user_name: 'name-test',
          },
        }];
      } else {
        const currUser = await getUserById(user.id);
        activityFeed = await getActivityFeed(user.id, currUser.followees);
      }
      const allPosts = [];
      activityFeed.map(async (postObj) => {
        allPosts.push(
          <div className="homepage-single-post-container">
            <div>
              <div>
                <Link data-testid="personalUserProfile" to={{ pathname: `/PersonalUserProfile/${postObj.user._id}` }} className="homeLinkTab">
                  <div className="userInfo">
                    <div style={{ backgroundImage: `url(${postObj.user.avatar_url})` }} className="images" />
                    <span>{postObj.user.user_name}</span>
                  </div>
                </Link>

                <div>
                  <Link data-testid="postDetails" to={{ pathname: `/PostDetails/${postObj.post._id}` }}>
                    <div>
                      {postObj.post.isImage
                        ? <img src={postObj.post.image_url} alt="test" height="300" width="200" />
                        : (
                          <video controls src={postObj.post.video_url} type="video/mp4" height="300" width="200">
                            <track kind="captions" />
                          </video>
                        )}
                    </div>
                  </Link>
                  <div>
                    <LikeOutlined />
                    <span style={{ marginRight: 10 }}>{postObj.post.likes.length}</span>
                    <CommentOutlined />
                    <span>{postObj.post.comments.length}</span>
                  </div>
                  <div data-testid="posts" className="homepage-post-text">
                    <div>{postObj.post.text}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
        );
      });
      setPosts(allPosts);
      setPostss(allPosts.slice(0, 10));
    };
    async function fetchData() {
      await getFolloweesPosts();
    }
    fetchData();
    setInterval(() => {
      fetchData();
    }, 10000);
  }, [user.id]);

  return (
    <div>
      {
        !posts ? <div />
          : (
            <div>
              <InfiniteScroll
                dataLength={postss.length}
                next={fetchMoreData}
                hasMore
                loader={<h4> </h4>}
              >
                <div className="homepage-posts-container" data-testid="homepageTestId">{postss}</div>
              </InfiniteScroll>
            </div>
          )
      }
    </div>
  );
}
HomePage.propTypes = {
  user: PropTypes.func,
  id: PropTypes.string,
};
HomePage.defaultProps = {
  user: () => { },
  id: null,
};

export default HomePage;
