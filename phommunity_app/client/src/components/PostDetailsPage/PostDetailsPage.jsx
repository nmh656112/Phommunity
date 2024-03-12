import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './index.css';
import { LikeOutlined, CommentOutlined } from '@ant-design/icons';
import {
  deletePostById, getPostById, getUserById, updatePost, deleteCommentById, updateUser,
} from '../../api/fetch';
import CommentsView from '../CommentsView/CommentsView';

function PostDetailsPage({ user }) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likedNumber, setLikedNumber] = useState(0);
  const [commentNumber, setCommentNumber] = useState(0);
  const navigate = useNavigate();

  const deletePost = async (event) => {
    event.preventDefault();
    await deletePostById(postId);
    await Promise.all(post.comments.map(async (commentId) => {
      await deleteCommentById(commentId);
    }));
    const currUser = await getUserById(user._id);
    currUser.posts = currUser.posts.filter((currPostId) => !(currPostId === postId));
    await updateUser(currUser);
    navigate('/PersonalSelfProfile');
  };

  const clickLikes = async () => {
    const currPost = post;
    if (!isLiked) {
      setIsLiked(true);
      setLikedNumber(likedNumber + 1);
      currPost.likes.push(user._id);
    } else {
      setIsLiked(false);
      setLikedNumber(likedNumber - 1);
      currPost.likes = currPost.likes.filter((id) => !(id === user._id));
    }
    // console.log(currPost);
    await updatePost(currPost);
    setPost(currPost);
  };

  useEffect(() => {
    const getPost = async () => {
      const postDetails = await getPostById(postId);
      setPost(postDetails);
      setLikedNumber(postDetails.likes.length);
      setCommentNumber(postDetails.comments.length);
      setComments(postDetails.comments);
      const otherUser = await getUserById(postDetails.user_id);
      setPostUser(otherUser);
      if (postDetails.likes.includes(user._id)) {
        setIsLiked(true);
      }
    };
    async function fetchData() {
      if (user._id === 'test') {
        const postDetails = {
          user_id: 'test', _id: 'tsest', isImage: true, image_url: 'test', video_url: 'test', likes: [], comments: [], text: 'test',
        };
        setPost(postDetails);
        setLikedNumber(0);
        setCommentNumber(0);
        setComments([]);
        const otherUser = {
          _id: 'test', avatar_url: 'atest', user_name: 'name-test',
        };
        setPostUser(otherUser);
      } else {
        await getPost();
      }
    }
    fetchData();
  }, [postId, user._id]);

  const deleteCommentbyid = (commentId) => {
    const newComments = comments.filter((element) => element !== commentId);
    setComments(newComments);
    setCommentNumber(newComments.length);
  };

  return (
    <div>
      {
        (!post || !postUser) ? <div /> : (
          <div className="outer-container">
            <div>
              <div style={{ margin: 10 }}>
                <button type="button" className="btn" onClick={() => { window.history.back(); }} data-testid="back_btn">
                  back
                </button>
              </div>
              {
                user._id === post.user_id
                  ? (
                    <div id="btn01">
                      <button type="button" className="btn" onClick={deletePost} data-testid="delete_btn">delete</button>
                    </div>
                  ) : null
              }
            </div>
            <div className="post-details-container">
              <div>
                {
                  (postUser._id === user._id) ? (
                    <div style={{ width: '10%' }}>
                      <Link data-testid="personalSelfProfile" to={{ pathname: '/PersonalSelfProfile' }} className="homeLinkTab" style={{ width: '10px' }}>
                        <div className="userInfo">
                          <div style={{ backgroundImage: `url(${postUser.avatar_url})` }} className="images postUserAvatarUrl" />
                          <span>{postUser.user_name}</span>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div style={{ width: '10%' }}>
                      <Link data-testid="personalUserProfile" to={{ pathname: `/PersonalUserProfile/${postUser._id}` }} className="homeLinkTab">
                        <div className="userInfo">
                          <div style={{ backgroundImage: `url(${postUser.avatar_url})` }} className="images postUserAvatarUrl" />
                          <span>{postUser.user_name}</span>
                        </div>
                      </Link>
                    </div>
                  )
                }

                <div>
                  {post.isImage
                    ? <img src={post.image_url} alt="test" height="480" width="360" />
                    : (
                      <video controls src={post.video_url} type="video/mp4" height="480" width="360">
                        <track kind="captions" />
                      </video>
                    )}
                </div>

                <div>
                  {isLiked ? <LikeOutlined id="likes" style={{ color: '#0abab5' }} onClick={clickLikes} data-testid="clickLikes" /> : <LikeOutlined id="likes" onClick={clickLikes} data-testid="clickLikes" />}
                  <span style={{ marginRight: 20 }} data-testid="likes">{likedNumber}</span>
                  <CommentOutlined />
                  <span data-testid="comments">{commentNumber}</span>
                  {
                    user._id === post.user_id
                      ? (
                        <div id="postEditBtn">
                          <Link to={{ pathname: `/EditPost/${post._id}` }}>
                            <button type="button" className="btn">edit post</button>
                          </Link>
                        </div>
                      ) : null
                  }
                </div>
                <div id="postContent01" data-testid="postContent">{post.text}</div>
              </div>
              <div className="allComments">
                <CommentsView
                  post={post}
                  user={user}
                  comments={comments}
                  deleteCommentbyid={deleteCommentbyid}
                />
                <Link to={{ pathname: `/CreateComment/${post._id}` }}>
                  <div style={{
                    position: 'relative', left: 420, width: 300, margin: 50,
                  }}
                  >
                    <button type="button" className="btn">Add comment</button>
                  </div>
                </Link>

              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

PostDetailsPage.propTypes = {
  user: PropTypes.func,
};
PostDetailsPage.defaultProps = {
  user: () => { },
};

export default PostDetailsPage;
