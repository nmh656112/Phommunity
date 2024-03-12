import React, { useState, useEffect } from 'react';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';
import {
  updateUser, getUserById,
} from '../../api/fetch';

const S3key = require('../../assets/keys.json');

AWS.config.update({ region: 'us-east-2', credentials: new AWS.Credentials(S3key.ID, S3key.SECRET) });

function ChangeAvatarPage({ user }) {
  const [avatarURL, setAvatarURL] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const handleAvatarChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
      setNotification('Please upload photo');
      return;
    }
    const uploadParams = { Bucket: 'cis557yuxinruiminghui', Key: file.name, Body: file };
    const upload = new AWS.S3.ManagedUpload({ params: uploadParams });
    const promise = upload.promise();
    promise.then((data) => {
      // console.log('Successfully uploaded:', data.Location);
      setAvatarURL(data.Location);
      // console.log('PATH', videoUrl);
    }).catch((err) => err);
    setNotification('');
    // setAvatarURL('https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80');
  };

  const changeAvatar = async (event) => {
    event.preventDefault();
    const updatedUser = await getUserById(user.id);
    updatedUser.avatar_url = avatarURL;
    await updateUser(updatedUser);
    navigate('/PersonalSelfProfile');
  };

  useEffect(() => {
    const getCurrentAvatar = async () => {
      let id = 'test';
      if (user.id === 'test') {
        id = '1';
      } else {
        id = user.id;
      }
      const currUser = await getUserById(id);
      setAvatarURL(currUser.avatar_url);
    };
    async function fetchData() {
      await getCurrentAvatar();
    }
    fetchData();
  }, [user.id]);

  return (
    <div id="avatarContainer">
      <div>
        <div>
          <button type="button" className="btn">
            <Link data-testid="linkTabTestId" to={{ pathname: '/PersonalSelfProfile' }} className="linkTab">back</Link>
          </button>
        </div>
        <div id="btn01">
          <button type="button" className="btn" onClick={changeAvatar}>
            confirm
          </button>
        </div>
        <div id="avatarChangeNotificationContainer">
          {notification}
        </div>
      </div>
      <div id="wholeAvatar">
        <div style={{ backgroundImage: `url(${avatarURL})` }} className="currentAvartar" />
        <br />
        <label id="label01" htmlFor="avatarFor">
          Upload Avatar
          <input id="avatarFor" style={{ display: 'none' }} type="file" onChange={(e) => handleAvatarChange(e)} />
        </label>
      </div>
    </div>
  );
}

ChangeAvatarPage.propTypes = {
  user: PropTypes.func,
};
ChangeAvatarPage.defaultProps = {
  user: () => { },
};

export default ChangeAvatarPage;
