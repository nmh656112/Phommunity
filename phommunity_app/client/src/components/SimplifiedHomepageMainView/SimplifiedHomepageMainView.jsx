import './index.css';
import React from 'react';
import HomePageImage from '../../assets/homepageImage.jpg';

function Slogan() {
  return (
    <div className="sloganDiv">
      <p className="slogan">
        Share your life
        <br />
        {' '}
        Share the world
      </p>
    </div>
  );
}

function HomepageImages() {
  return (
    <div className="homePageImageDiv">
      <div className="image-top">
        <img src={HomePageImage} alt="test" height="300" />
      </div>
      <div className="image-down">
        <img src={HomePageImage} alt="test" height="300" />
      </div>
    </div>
  );
}

function SimplifiedHomePageMainView() {
  return (
    <div className="mainView">
      <Slogan />
      <HomepageImages />
    </div>

  );
}

export default SimplifiedHomePageMainView;
