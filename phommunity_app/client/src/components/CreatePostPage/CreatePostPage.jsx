import React, { useEffect, useState } from 'react';
import './index.css';
import { Checkbox, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import AWS from 'aws-sdk';
import { Mention, MentionsInput } from 'react-mentions';
import {
  getPostById, createPost, updateUser, getUserById, updatePost, getAllUsers,
} from '../../api/fetch';
import mentionsInputStyle from '../CreateCommentPage/mentionsInputStyles';

const S3key = require('../../assets/keys.json');

AWS.config.update({ region: 'us-east-2', credentials: new AWS.Credentials(S3key.ID, S3key.SECRET) });

const { TextArea } = Input;

function CreatePostPage({ user }) {
  const { postId } = useParams();
  const [text, setText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isImage, setIsImage] = useState(true);
  const [users, setUsers] = useState(null);
  const [notification, setNotification] = useState('');
  const [restricted, setRestricted] = useState('');
  const navigate = useNavigate();

  const handleFileChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const uploadParams = { Bucket: 'cis557yuxinruiminghui', Key: file.name, Body: file };
    const upload = new AWS.S3.ManagedUpload({ params: uploadParams });
    const promise = upload.promise();
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      promise.then((data) => {
        setImageUrl(data.Location);
      }).catch((err) => err);
      setIsImage(true);
      setVideoUrl('');
      setNotification('');
    } else if ((file.type === 'video/quicktime') || (file.type === 'video/mp4')) {
      promise.then((data) => {
        setVideoUrl(data.Location);
      }).catch((err) => err);
      setIsImage(false);
      setImageUrl('');
      setNotification('');
    } else {
      setNotification('please upload image with .jpeg or.png or video with .mp4!');
    }
  };

  const submitCreation = async (event) => {
    event.preventDefault();
    if (imageUrl === '' && videoUrl === '') {
      setNotification('Must upload photo/video!');
      return;
    }
    if (postId) {
      let tmpPreviousPost = await getPostById(postId);
      if (!tmpPreviousPost) {
        tmpPreviousPost = {
          likes: [],
          comments: [],
        };
      }
      const postBody = {
        _id: postId,
        date: new Date(),
        text,
        user_id: user.id,
        image_url: imageUrl,
        video_url: videoUrl,
        likes: tmpPreviousPost.likes,
        comments: tmpPreviousPost.comments,
        private: isPrivate,
        isImage,
        restricted,
      };
      await updatePost(postBody);
      navigate(`/PostDetails/${postId}`);
    } else {
      const newPostId = await createPost(
        user.id,
        text,
        imageUrl,
        videoUrl,
        isPrivate,
        isImage,
        restricted,
      );
      const updatedUser = await getUserById(user.id);
      await updatedUser.posts.push(newPostId);
      await updateUser(updatedUser);
      navigate('/PersonalSelfProfile');
    }
  };

  useEffect(() => {
    const getPost = async () => {
      const postObj = await getPostById(postId);
      setText(postObj.text);
      setIsPrivate(postObj.private);
      setImageUrl(postObj.image_url);
      setIsImage(postObj.isImage);
      setVideoUrl(postObj.video_url);
      setRestricted(postObj.restricted);
    };
    const getAllAvailableUsers = async () => {
      const allUsers = await getAllUsers();
      const allUsersExceptSelf = allUsers.filter((eachUser) => eachUser._id !== user._id);
      const availableUsers = allUsersExceptSelf.map((everyUser) => (
        { id: everyUser._id, display: everyUser.user_name }
      ));
      setUsers(availableUsers);
    };
    async function fetchData() {
      if (user.id === 'test') {
        const testUser = { id: 'justTest' };
        setUsers(testUser);
      } else {
        await getAllAvailableUsers();
        if (postId) {
          await getPost();
        }
      }
    }
    fetchData();
  }, [postId, user.id, user._id]);

  return (
    <div>
      {!users ? <div /> : (
        <div id="postCreation">
          <div>
            <div>
              <button type="button" className="btn">
                <Link to={{ pathname: '/PersonalSelfProfile' }} className="linkTab">back</Link>
              </button>
            </div>
            <div id="rightbtn">
              <button type="button" className="btn" onClick={submitCreation} data-testid="post_btn">
                post
              </button>
            </div>
          </div>

          <div id="notificationContainer">
            {notification}
          </div>
          <div>
            <div id="textContainer">
              <TextArea
                value={text}
                data-testid="textArea"
                onChange={(e) => setText(e.target.value)}
                placeholder="Max words are 100"
                id="postTextArea"
              />
            </div>
            <div id="postTag" />
            <div>
              <div id="checkForPrivate">
                <Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)}>
                  Private
                </Checkbox>
              </div>

              <div id="restrictedPeopleContainer">
                <MentionsInput
                  style={mentionsInputStyle}
                  className="mentions"
                  placeholder="To restrict anyone from seeing this post, start with @ to add users' name"
                  value={restricted}
                  onChange={(e) => setRestricted(e.target.value)}
                >
                  <Mention data={users} trigger="@" style={{ backgroundColor: '#cee4e5' }} />
                </MentionsInput>
              </div>

              <div id="postFile">
                <label htmlFor="uploadFileBtn" id="uploadLabel">
                  Upload file
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    id="uploadFileBtn"
                    data-testid="uploadFile"
                    onChange={(e) => handleFileChange(e)}
                  />
                </label>

                <br />
                <br />
                {
                  isImage ? (
                    <div>
                      {
                        imageUrl ? (
                          <img src={imageUrl} className="newFile" data-testid="uploadImage" alt="post" />
                        ) : (
                          <div data-testid="uploadImage" />
                        )
                      }

                    </div>
                  ) : (
                    <div>
                      <video controls src={videoUrl} className="newFile" data-testid="uploadVideo">
                        <track kind="captions" />
                      </video>
                    </div>
                  )
                }

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CreatePostPage.propTypes = {
  user: PropTypes.func,
  id: PropTypes.string,
};
CreatePostPage.defaultProps = {
  user: () => { },
  id: null,
};

export default CreatePostPage;
