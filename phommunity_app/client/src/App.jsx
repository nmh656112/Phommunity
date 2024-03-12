import { Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ChangeAvatarPage from './components/ChangeAvatarPage/ChangeAvatarPage';
import CreatePostPage from './components/CreatePostPage/CreatePostPage';
import HomepageBeforeLogin from './components/HomepageBeforeLogin/HomepageBeforeLogin';
import LoginPage from './components/LoginPage/LoginPage';
import PostDetailsPage from './components/PostDetailsPage/PostDetailsPage';
import RegistrationPage from './components/RegistrationPage/Registration';
import FollowSuggestionPage from './components/FollowSuggestionPage/FollowSuggestionPage';
import HomePage from './components/HomePage/HomePage';
import PersonalSelfProfilePage from './components/PersonalSelfProfilePage/PersonalSelfProfilePage';
import PersonalUserProfilePage from './components/PersonalUserProfilePage/PersonalUserProfilePage';
import Header from './components/Header/Header';
import CreateCommentPage from './components/CreateCommentPage/CreateCommentPage';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const updateUser = (userNew) => {
    setUser(userNew);
    sessionStorage.setItem('user', JSON.stringify(userNew));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.setItem('user', null);
    sessionStorage.setItem('app-token', null);
    navigate('/');
  };

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('user');
    if (loggedIn) {
      const found = JSON.parse(loggedIn);
      setUser(found);
    }
  }, []);

  // console.log("UPHERE", user);
  if (sessionStorage.getItem('app-token') && user) {
    return (
      <div>
        <Header user={user} logout={logout} />
        <Routes>
          <Route path="/" exact element={<HomePage user={user} />} />
          <Route path="/Home" exact element={<HomePage user={user} />} />
          <Route path="/PersonalSelfProfile" exact element={<PersonalSelfProfilePage user={user} />} />
          <Route path="/PersonalUserProfile/:id" exact element={<PersonalUserProfilePage user={user} />} />
          <Route path="/FollowSuggestion" exact element={<FollowSuggestionPage user={user} />} />
          <Route path="/CreatePost" element={<CreatePostPage user={user} />} />
          <Route path="/EditPost/:postId" element={<CreatePostPage user={user} />} />
          <Route path="/ChangeAvatar" exact element={<ChangeAvatarPage user={user} />} />
          <Route path="/PostDetails/:postId" exact element={<PostDetailsPage user={user} />} />
          <Route path="/CreateComment/:postId" exact element={<CreateCommentPage user={user} />} />
          <Route path="/EditComment/:commentId" exact element={<CreateCommentPage user={user} />} />
        </Routes>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/Registration" exact element={<RegistrationPage />} />
        <Route path="/Login" element={<LoginPage updateUser={updateUser} />} />
        <Route path="/" element={<HomepageBeforeLogin />} />
        <Route path="/Home" element={<HomepageBeforeLogin />} />
        <Route path="/PersonalSelfProfile" element={<HomepageBeforeLogin />} />
        <Route path="/PersonalUserProfile/:id" element={<HomepageBeforeLogin />} />
        <Route path="/FollowSuggestion" element={<HomepageBeforeLogin />} />
        <Route path="/CreatePost" element={<HomepageBeforeLogin />} />
        <Route path="//EditPost/:postId" element={<HomepageBeforeLogin />} />
        <Route path="/ChangeAvatar" element={<HomepageBeforeLogin />} />
        <Route path="/PostDetails/:postId" element={<HomepageBeforeLogin />} />
        <Route path="/CreateComment/:postId" element={<HomepageBeforeLogin />} />
        <Route path="/EditComment/:commentId" element={<HomepageBeforeLogin />} />
      </Routes>
    </div>
  );
}

export default App;
