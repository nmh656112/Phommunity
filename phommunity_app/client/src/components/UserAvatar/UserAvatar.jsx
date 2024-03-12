import React from 'react';
import './index.css';

function UserAvatar() {
  return (
    <div className="userInfo">
      <div data-testid="imagesTestid" style={{ backgroundImage: 'url("./assets/test.jpeg")' }} className="images" />
      <h href="">username</h>
    </div>
  );
}
export default UserAvatar;
