import React from 'react';
import './index.css';
import { LikeOutlined, CommentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function HomePagePost({ postObj }) {
  return (

    <div>
      <Link to={{ pathname: `/PostDetails/${postObj._id}` }}>
        <div>
          {postObj.isImage ? <img src={postObj.image_url} alt="test" height="300" width="200" /> : <video controls src={postObj.video_url} height="300" width="200"><track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions" /></video>}
        </div>
      </Link>
      <div>
        <LikeOutlined />
        {' '}
        <span style={{ marginRight: 10 }}>{postObj.likes.length}</span>
        <CommentOutlined />
        {' '}
        <span>{postObj.comments.length}</span>
      </div>
      <div className="homepage-post-text">
        <div>{postObj.text}</div>
      </div>
    </div>
  );
}

HomePagePost.propTypes = {
  postObj: PropTypes.shape,
};

HomePagePost.defaultProps = {
  postObj: null,
};

export default HomePagePost;
