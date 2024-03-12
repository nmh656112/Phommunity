import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { Mention, MentionsInput } from 'react-mentions';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import mentionsInputStyle from './mentionsInputStyles';
import {
  createComment, editCommentById, getAllUsers, getCommentById, getPostById, getUserById, updatePost,
} from '../../api/fetch';

function CreateCommentPage({ user }) {
  const { commentId } = useParams();
  const { postId } = useParams();
  const [text, setText] = useState('');
  const [currUser, setCurrUser] = useState(null);
  const [comment, setComment] = useState(null);
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();

  const submitCreation = async (event) => {
    event.preventDefault();
    if (text) {
      if (postId) {
        const newCommentId = await createComment(postId, user._id, text);
        const currPost = await getPostById(postId);
        await currPost.comments.push(newCommentId);
        await updatePost(currPost);
        navigate(`/PostDetails/${postId}`);
      } else if (commentId) {
        await editCommentById(comment._id, comment.post_id, user._id, text);
        navigate(`/PostDetails/${comment.post_id}`);
      }
    }
  };

  useEffect(() => {
    const getAllAvailableUsers = async () => {
      const allUsers = await getAllUsers();
      const allUsersExceptSelf = allUsers.filter((eachUser) => eachUser._id !== user._id);
      const availableUsers = allUsersExceptSelf.map((everyUser) => (
        { id: everyUser._id, display: everyUser.user_name }
      ));
      setUsers(availableUsers);
    };
    const getComment = async () => {
      const currComment = await getCommentById(commentId);
      setComment(currComment);
      setText(currComment.text);
    };
    async function fetchData() {
      if (user.id === 'test') {
        const testCurrentUser = { avatar_url: 'https://www.paperlessmovement.com/wp-content/uploads/2019/09/o2dvsv2pnhe.jpg', user_name: 'testName' };
        setCurrUser(testCurrentUser);
        const testUser = [{ id: 'testUser', display: 'testUser' }];
        setUsers(testUser);
      } else {
        const preUser = await getUserById(user._id);
        setCurrUser(preUser);
        await getAllAvailableUsers();
        if (commentId) {
          await getComment();
        }
      }
    }

    fetchData();
  }, [commentId, user._id, user.id]);

  return (
    <div>
      {
        (!currUser || !users) ? <div /> : (
          <div id="commentCreation">
            <div>
              <div>
                <button data-testid="backTestId" type="button" className="btn" onClick={() => { window.history.back(); }}>
                  back
                </button>
              </div>
              <div id="commentRightBtn">
                <button type="button" className="btn" onClick={submitCreation} data-testid="post_btn">
                  comment
                </button>
              </div>
            </div>
            <div className="userInfo">
              <div data-testid="testImageId" style={{ backgroundImage: `url(${currUser.avatar_url})` }} className="images" />
              <span data-testid="username">{currUser.user_name}</span>
            </div>
            <div>
              <div id="commentTextContainer">
                <MentionsInput
                  style={mentionsInputStyle}
                  className="mentions"
                  placeholder="Type anything, start with @ to add mentions"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  data-testid="textArea"
                >
                  <Mention data={users} trigger="@" style={{ backgroundColor: '#cee4e5' }} />
                </MentionsInput>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

CreateCommentPage.propTypes = {
  user: PropTypes.func,
};

CreateCommentPage.defaultProps = {
  user: () => { },
};

export default CreateCommentPage;
