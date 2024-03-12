import './index.css';
import React from 'react';
import SimplifiedHeader from '../SimplifiedHeader/SimplifiedHeader';
import SimplifiedHomePageMainView from '../SimplifiedHomepageMainView/SimplifiedHomepageMainView';

function HomePageWithoutLogin() {
  return (
    <div>
      <SimplifiedHeader loginVisible />
      <SimplifiedHomePageMainView />
    </div>
  );
}

export default HomePageWithoutLogin;
