import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  deleteCommentById, getCommentById, getUserById, getPostById, updatePost,
} from '../../api/fetch';
import './index.css';

function CommentsView({
  comments, post, user, deleteCommentbyid,
}) {
  const [allComments, setAllComments] = useState(null);

  useEffect(() => {
    const getComments = async () => {
      const commentsList = [];
      await Promise.all(
        comments.map(async (commentId) => {
          // console.log(`show comments: ${commentId}`);
          let comment = {
            _id: 'test', user_id: 'test', post_id: 'test', text: 'test',
          };
          if (!(commentId === 'test')) {
            comment = await getCommentById(commentId);
          }
          if (comment.post_id === post._id) {
            let commentOwner = { id: 'test', avatar_url: 'atest', user_name: 'testname' };
            if (!(commentId === 'test')) {
              commentOwner = await getUserById(comment.user_id);
            }
            const path = (user._id === comment.user_id) ? '/PersonalSelfProfile' : `/PersonalUserProfile/${commentOwner._id}`;
            const postPrecessCommentText = [];
            const content = comment.text;
            const finalContentList = [];
            // console.log(content.split('@'));
            if (content.includes('[') && content.includes(']') && content.includes('@')) {
              content.split('@').forEach((element) => {
                if (element.includes('[')) {
                  const until = element.indexOf(')');
                  finalContentList.push(`@${element.substring(1, until + 1)}`);
                  finalContentList.push(`${element.substring(until + 1, element.length)}`);
                } else {
                  finalContentList.push(element);
                }
              });
            } else {
              finalContentList.push(content);
            }
            // console.log(`content ${finalContentList}`);
            finalContentList.forEach((element) => {
              if (element.includes(']')) {
                const tmpText = element.substring(0, element.indexOf(']'));
                const tmpId = element.substring(element.indexOf(']') + 2, element.length - 1);
                const tmpPath = `/PersonalUserProfile/${tmpId}`;
                postPrecessCommentText.push(
                  <Link to={{ pathname: tmpPath }} style={{ display: 'inline' }}>
                    {tmpText}
                  </Link>,
                );
              } else {
                postPrecessCommentText.push(
                  <div style={{ display: 'inline' }}>
                    {element}
                  </div>,
                );
              }
            });
            commentsList.push(
              <li>
                <div style={{ marginTop: 10 }}>
                  <div style={{ width: '10%' }}>
                    <Link data-testid="personalProfile" to={{ pathname: path }} className="homeLinkTab">
                      <div className="userInfo">
                        <div style={{ backgroundImage: `url(${commentOwner.avatar_url})` }} className="images" />
                        <span>{commentOwner.user_name}</span>
                      </div>
                    </Link>
                  </div>
                  <div className="commentText">{postPrecessCommentText}</div>
                  <div style={{ marginLeft: 400 }}>
                    {
                      commentOwner._id === user._id ? <Link to={{ pathname: `/EditComment/${comment._id}` }}><button type="submit" className="comment-edit-delete-btn">edit</button></Link> : <div />
                    }
                    {
                      commentOwner._id === user._id || post.user_id === user._id
                        ? (
                          <button
                            type="submit"
                            className="comment-edit-delete-btn"
                            onClick={async () => {
                              await deleteCommentById(commentId);
                              const currPost = await getPostById(post._id);
                              currPost.comments = currPost.comments.filter(
                                (id) => !(id === commentId),
                              );
                              await updatePost(currPost);
                              deleteCommentbyid(commentId);
                            }}
                          >
                            delete
                          </button>
                        ) : <div />
                    }
                  </div>
                </div>
              </li>,
            );
          }
        }),
      );
      // console.log(`comments length: ${commentsList}`);
      setAllComments(commentsList);
    };
    async function fetchData() {
      await getComments();
    }
    fetchData();
  }, [comments, deleteCommentbyid, post._id, post.user_id, user._id]);

  return (
    <div>
      {
        (!allComments) ? <div data-testid="justTestId" className="justTestClass" /> : (
          <ul className="commentsList">
            {allComments}
          </ul>
        )
      }
    </div>
  );
}

CommentsView.propTypes = {
  post: PropTypes.func,
  user: PropTypes.func,
  comments: PropTypes.func,
  deleteCommentbyid: PropTypes.func,
};
CommentsView.defaultProps = {
  post: () => { },
  user: () => { },
  comments: () => { },
  deleteCommentbyid: () => { },
};

export default CommentsView;
