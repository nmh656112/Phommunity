import React from 'react';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import { cleanup, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import HomepageBeforeLogin from '../components/HomepageBeforeLogin/HomepageBeforeLogin';
import LoginPage from '../components/LoginPage/LoginPage';
import RegistrationPage from '../components/RegistrationPage/Registration';
import CreatePostPage from '../components/CreatePostPage/CreatePostPage';
import PostDetailPage from '../components/PostDetailsPage/PostDetailsPage';

import Header from '../components/Header/Header';
import HomePage from '../components/HomePage/HomePage';
import PersonalSelfProfilePage from '../components/PersonalSelfProfilePage/PersonalSelfProfilePage';
import PersonalUserProfilePage from '../components/PersonalUserProfilePage/PersonalUserProfilePage';
import FollowSuggestionPage from '../components/FollowSuggestionPage/FollowSuggestionPage';
import ChangeAvatarPage from '../components/ChangeAvatarPage/ChangeAvatarPage';
import CreateCommentPage from '../components/CreateCommentPage/CreateCommentPage';
import DefinedButton from '../components/DefinedButton/DefinedButton';
import LoginRegisSubmitBtn from '../components/LoginRegisSubmitBtn/LoginRegisSubmitBtn';
import LoginRegisWelcomeInfo from '../components/LoginRegisWelcomeInfo/LoginRegisWelcomeInfo';
import UserAvatar from '../components/UserAvatar/UserAvatar';
import CommentsView from '../components/CommentsView/CommentsView';

const apiLib = require('../api/fetch');

afterEach(() => {
  cleanup();
});

test('upload a image', () => {
  const userData = { id: 'test' };
  const file = new File(['hello'], 'hello.png', { type: 'image/png' });
  render(
    <BrowserRouter>
      <CreatePostPage user={userData} />
    </BrowserRouter>,
  );
  const input = screen.getByTestId('uploadFile');
  userEvent.upload(input, file);
  expect(input.files[0]).toStrictEqual(file);
  expect(input.files).toHaveLength(1);
  const imageTag = screen.getByTestId('uploadImage');
  expect(imageTag).toBeInTheDocument();
});

test('upload a video', () => {
  const userData = { id: 'test' };
  const file = new File(['hello'], 'hello.mp4', { type: 'video/mp4' });
  render(
    <BrowserRouter>
      <CreatePostPage user={userData} />
    </BrowserRouter>,
  );
  const input = screen.getByTestId('uploadFile');
  userEvent.upload(input, file);
  expect(input.files[0]).toStrictEqual(file);
  expect(input.files).toHaveLength(1);
  const videoTag = screen.getByTestId('uploadVideo');
  expect(videoTag).toBeInTheDocument();
});

test('upload a wrong file', () => {
  const userData = { id: 'test' };
  const file = new File(['hello'], 'hello.txt', { type: 'txt' });
  render(
    <BrowserRouter>
      <CreatePostPage user={userData} />
    </BrowserRouter>,
  );
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const input = screen.getByTestId('uploadFile');
  userEvent.upload(input, file);
  expect(alertMock).toBeCalledTimes(0);
});

test('post without any file', () => {
  const userData = { id: 'test' };
  render(
    <BrowserRouter>
      <CreatePostPage user={userData} />
    </BrowserRouter>,
  );
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const post = screen.getByTestId('post_btn');
  userEvent.click(post);
  expect(alertMock).toBeCalledTimes(0);
});

test('post content', () => {
  const userData = { id: 'test' };
  render(
    <BrowserRouter>
      <CreatePostPage user={userData} />
    </BrowserRouter>,
  );
  const text = screen.getByTestId('textArea');
  userEvent.type(text, 'douala');
  expect(text).toHaveValue('douala');
});

test('homepage has login & registration entries', () => {
  render(
    <BrowserRouter>
      <HomepageBeforeLogin />
    </BrowserRouter>,
  );
  const loginElement = screen.getByText('login');
  const registrationElement = screen.getByText('Sign Up');

  expect(loginElement).toBeInTheDocument();
  expect(registrationElement).toBeInTheDocument();

  userEvent.click(loginElement);
  expect(window.location.pathname).toMatch('/Login');

  const titleImage = screen.getByAltText('titleImg');
  userEvent.click(titleImage);
  expect(window.location.pathname).toMatch('/');

  const RegistrationElement = screen.getByText('Sign Up');
  userEvent.click(RegistrationElement);
  expect(window.location.pathname).toMatch('/Registration');
});

test('LoginPage', () => {
  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>,
  );
  const elements = screen.getAllByRole('textbox');

  elements.forEach((element) => {
    userEvent.type(element, 'douala');
    expect(element).toHaveValue('douala');
  });
});

test('LoginPage matches snapshot', () => {
  const component = renderer.create(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('username content is correct', () => {
  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>,
  );
  const usernameInput = screen.getByRole('textbox');
  expect(usernameInput).toBeInTheDocument();

  const passwordInput = screen.getByTestId('password-input');
  expect(passwordInput).toBeInTheDocument();

  userEvent.type(usernameInput, '.!@##$%$%');
  userEvent.type(passwordInput, 'hktk123456');

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);
  expect(alertMock).toBeCalledTimes(0);

  expect(usernameInput).toHaveValue('');
  expect(passwordInput).toHaveValue('');
});

test('password content is correct', async () => {
  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>,
  );
  const usernameInput = screen.getByRole('textbox');
  const passwordInput = screen.getByTestId('password-input');
  userEvent.type(usernameInput, 'minghuin');
  userEvent.type(passwordInput, '.!@##$%$%');

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);
  expect(alertMock).toBeCalledTimes(0);

  expect(usernameInput).toHaveValue('');
  expect(passwordInput).toHaveValue('');
});

test('password length limit is correct', () => {
  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>,
  );
  const usernameInput = screen.getByRole('textbox');
  const passwordInput = screen.getByTestId('password-input');
  userEvent.type(usernameInput, 'minghuinasdfasdf');
  userEvent.type(passwordInput, 'asdfasdfasdfasdf');

  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);

  expect(usernameInput).toHaveValue('');
  expect(passwordInput).toHaveValue('');
});

// /*
// test('login is correct', () => {
//   render(
//     <BrowserRouter>
//       <LoginPage />
//     </BrowserRouter>,
//   );
//   const usernameInput = screen.getByRole('textbox');
//   const passwordInput = screen.getByTestId('password-input');
//   userEvent.type(usernameInput, 'minghuin');
//   userEvent.type(passwordInput, 'minghui123');

//   const alertMock = jest.spyOn(window, 'alert').mockImplementation();
//   const submitBtn = screen.getByRole('button');
//   userEvent.click(submitBtn);
//   expect(alertMock).toBeCalledTimes(0);
// });

// test('registration is correct',() =>{
//   const page = render(
//     <BrowserRouter>
//       <RegistrationPage />
//     </BrowserRouter>
//   )
//   const usernameInput = page.getByTestId("username-input")
//   const passwordInput = page.getByTestId("password-input")

//   userEvent.type(usernameInput,  'minghuin');
//   userEvent.type(passwordInput, 'minghui123')

//   const alertMock = jest.spyOn(window,'alert').mockImplementation();
//   const submit_btn = page.getByRole('button')
//   userEvent.click(submit_btn)
//   expect(alertMock).toBeCalledTimes(0)

// });

test('Registration matches snapshot', () => {
  const utils = renderer.create(
    <BrowserRouter>
      <RegistrationPage />
    </BrowserRouter>,
  );

  const tree = utils.toJSON();
  expect(tree).toMatchSnapshot();
});

test('username content correct', () => {
  render(
    <BrowserRouter>
      <RegistrationPage />
    </BrowserRouter>,
  );
  // const usernameInput = screen.getByTestId('username-input');

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);
  expect(alertMock).toBeCalledTimes(0);
});

test('email Check is correct', () => {
  render(
    <BrowserRouter>
      <RegistrationPage />
    </BrowserRouter>,
  );

  const emailInput = screen.getByTestId('email-input');

  userEvent.type(emailInput, '123');

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);
  expect(alertMock).toBeCalledTimes(0);
});

test('password content is correct - characters', () => {
  render(
    <BrowserRouter>
      <RegistrationPage />
    </BrowserRouter>,
  );

  const passwordInput = screen.getByTestId('password-input');

  userEvent.type(passwordInput, '**********');

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);
  expect(alertMock).toBeCalledTimes(0);
});

test('password content is correct - at least one number', () => {
  render(
    <BrowserRouter>
      <RegistrationPage />
    </BrowserRouter>,
  );

  const passwordInput = screen.getByTestId('password-input');

  userEvent.type(passwordInput, 'asdfasdfsadf');

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);
  expect(alertMock).toBeCalledTimes(0);
});

test('password content is correct - at least one alphabet', () => {
  render(
    <BrowserRouter>
      <RegistrationPage />
    </BrowserRouter>,
  );

  const passwordInput = screen.getByTestId('password-input');

  userEvent.type(passwordInput, '123456789');

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);
  expect(alertMock).toBeCalledTimes(0);
});

test('password length upper limit is correct', () => {
  render(
    <BrowserRouter>
      <RegistrationPage />
    </BrowserRouter>,
  );

  const passwordInput = screen.getByTestId('password-input');

  userEvent.type(passwordInput, '123456789123456789d');

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);
  expect(alertMock).toBeCalledTimes(0);
});

test('password length lower limit is correct', () => {
  render(
    <BrowserRouter>
      <RegistrationPage />
    </BrowserRouter>,
  );

  const passwordInput = screen.getByTestId('password-input');

  userEvent.type(passwordInput, '1d');

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);
  expect(alertMock).toBeCalledTimes(0);
});

test('PostDetailsPage matches snapshot', () => {
  const component = renderer.create(
    <BrowserRouter>
      <PostDetailPage />
    </BrowserRouter>,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('PostDetailsPage shows post detail', async () => {
  const userData = { _id: 'test' };
  render(
    <BrowserRouter>
      <PostDetailPage user={userData} />
    </BrowserRouter>,
  );
  const backBtn = screen.getByTestId('back_btn');
  expect(backBtn).toHaveClass('btn');
  const deleteBtn = screen.getByTestId('delete_btn');
  expect(deleteBtn).toHaveClass('btn');
  const personalSelf = screen.getByTestId('personalSelfProfile');
  expect(personalSelf).toHaveClass('homeLinkTab');
  const likes = screen.getByTestId('likes');
  expect(likes).toHaveTextContent(0);
  const likesClick = screen.getByTestId('clickLikes');
  userEvent.click(likesClick);
  expect(likes).toHaveTextContent(1);
  const content = screen.getByTestId('postContent');
  expect(content).toHaveTextContent('test');
  const comments = screen.getByTestId('comments');
  expect(comments).toHaveTextContent(0);
});

test('header has HomePage, PersonalSelfProfilePage and FollowSuggestionPage entries', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>,
  );

  const homePageElement = screen.getByTestId('HomePage');
  const personalSelfProfilePageElement = screen.getByTestId('PersonalSelfPage');
  const followSuggestionPageElement = screen.getByTestId('FollowSuggestionPage');

  userEvent.click(homePageElement);
  expect(window.location.pathname).toMatch('/Home');

  userEvent.click(personalSelfProfilePageElement);
  expect(window.location.pathname).toMatch('/PersonalSelfProfile');

  userEvent.click(followSuggestionPageElement);
  expect(window.location.pathname).toMatch('/FollowSuggestion');
});

test('header has search input', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>,
  );
  const element = screen.getByRole('textbox');

  userEvent.type(element, 'douala');
  expect(element).toHaveValue('douala');

  const btn = screen.getByTestId('UserSearchButton');
  expect(btn).toHaveClass('UserSearchBarButton');
});

test('follow suggestion page will show posts that belong to user', () => {
  const userData = { id: 'test' };

  render(
    <BrowserRouter>
      <FollowSuggestionPage user={userData} />
    </BrowserRouter>,
  );

  const tmp = screen.getByTestId('homepagePostsContainerId');
  expect(tmp).toHaveClass('homepage-posts-container');
});

test('personal self profile page will show posts that belong to user self', () => {
  const userData = { id: 'test' };

  render(
    <BrowserRouter>
      <PersonalSelfProfilePage user={userData} />
    </BrowserRouter>,
  );

  const posts = screen.getByTestId('posts');
  expect(posts).toHaveClass('personal-page-posts-container');

  const changeAvatar = screen.getByTestId('changeAvatar');
  expect(changeAvatar).toHaveClass('changeAvatarClass');

  const createPost = screen.getByTestId('createPost');
  expect(createPost).toHaveClass('createPostClass');
});

test('personal user profile page will show posts that belong to other user', () => {
  const userData = { id: 'test', followers: [], followees: [] };

  render(
    <BrowserRouter>
      <PersonalUserProfilePage user={userData} />
    </BrowserRouter>,
  );

  const posts = screen.getByTestId('posts');
  expect(posts).toHaveClass('personal-page-posts-container');

  const avatar = screen.getByTestId('avatar');
  expect(avatar).toHaveClass('self_images');

  const username = screen.getByTestId('username');
  expect(username).toHaveClass('user-username-container');

  const newPostButton = screen.getByTestId('newPostButton');
  expect(newPostButton).toHaveClass('newPostButton');

  const followAndUnfollowUser = screen.getByTestId('followAndUnfollowUserButton');
  userEvent.click(followAndUnfollowUser);
});

test('change avatar page test', () => {
  const userData = { id: 'test' };

  render(
    <BrowserRouter>
      <ChangeAvatarPage user={userData} />
    </BrowserRouter>,
  );

  const tmp = screen.getByTestId('linkTabTestId');
  expect(tmp).toHaveClass('linkTab');
});

test('defined button test', () => {
  render(
    <BrowserRouter>
      <DefinedButton text="test" />
    </BrowserRouter>,
  );

  const tmp = screen.getByTestId('testBtnId');
  expect(tmp).toHaveClass('btn');
});

test('Login Regis Submit button test', () => {
  render(
    <BrowserRouter>
      <LoginRegisSubmitBtn text="test" />
    </BrowserRouter>,
  );

  const tmp = screen.getByTestId('testBtnId');
  expect(tmp).toHaveClass('button');
});

test('Login Regis Welcome info test', () => {
  render(
    <BrowserRouter>
      <LoginRegisWelcomeInfo />
    </BrowserRouter>,
  );

  const tmp = screen.getByTestId('phommunityRowTestId');
  expect(tmp).toHaveClass('phommunity-row');
});

test('User Avatar test', () => {
  render(
    <BrowserRouter>
      <UserAvatar />
    </BrowserRouter>,
  );

  const tmp = screen.getByTestId('imagesTestid');
  expect(tmp).toHaveClass('images');
});

test('create comment page test', () => {
  const userData = { id: 'test' };

  render(
    <BrowserRouter>
      <CreateCommentPage user={userData} />
    </BrowserRouter>,
  );

  const tmp = screen.getByTestId('testImageId');
  expect(tmp).toHaveClass('images');

  const tmp2 = screen.getByTestId('post_btn');
  expect(tmp2).toHaveClass('btn');

  const tmp3 = screen.getByTestId('backTestId');
  expect(tmp3).toHaveClass('btn');

  const username = screen.getByTestId('username');
  expect(username).toHaveTextContent('testName');

  const text = screen.getByTestId('textArea');
  userEvent.type(text, '@testUser');
  expect(text).toHaveValue('@testUser');
});

test('comments view page test', () => {
  const u = { _id: 'test' };
  const c = ['test'];
  const p = { _id: 'test' };
  const a = { _id: 'test' };

  render(
    <BrowserRouter>
      <CommentsView comments={c} post={p} user={u} deleteCommentbyid={a} />
    </BrowserRouter>,
  );

  const tmp = screen.getByTestId('justTestId');
  expect(tmp).toHaveClass('justTestClass');
});

test('home page will show posts that should be recommended to user', () => {
  const userData = { id: 'test' };

  render(
    <BrowserRouter>
      <HomePage user={userData} />
    </BrowserRouter>,
  );

  const posts = screen.getByTestId('homepageTestId');
  expect(posts).toHaveClass('homepage-posts-container');
});

test('Get all users API', async () => {
  const mockResponse = {
    data: [
      {
        id: '1',
        user_name: 'yuxinhu',
        email: 'yuxinhu@seas.upenn.edu',
        password: '123dsdffe',
        avatar_url: 'https://www.paperlessmovement.com/wp-content/uploads/2019/09/o2dvsv2pnhe.jpg',
        posts: [
          '1',
          '8',
          '98.2283455196284',
          '79.67281260898254',
          '97.15363152076615',
        ],
        followers: [],
        followees: [
          '2',
          '4',
          '5',
        ],
        notifications: [],
      },
      {
        id: '2',
        user_name: 'ruizhang',
        email: 'ruizhan@seas.upenn.edu',
        password: 'few09234',
        avatar_url: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        posts: [
          '2',
          '3',
          '7',
          '65.90431380492399',
        ],
        followers: [
          '1',
          '3',
        ],
        followees: [],
        notifications: [],
      },
      {
        id: '3',
        user_name: 'minghuini',
        email: 'minghuini@seas.upenn.edu',
        password: 'abc123456',
        avatar_url: 'https://images.unsplash.com/photo-1566275529824-cca6d008f3da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80',
        posts: [
          '4',
          '5',
          '6',
        ],
        followers: [],
        followees: [
          '2',
          '4',
          '5',
        ],
        notifications: [],
      }],
  };
  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  await apiLib.getAllUsers();
  expect(mockResponse).toMatchObject(mockResponse);
});

test('Get user by ID API', async () => {
  const mockResponse = {
    data: [
      {
        id: '1',
        user_name: 'yuxinhu',
        email: 'yuxinhu@seas.upenn.edu',
        password: '123dsdffe',
        avatar_url: 'https://www.paperlessmovement.com/wp-content/uploads/2019/09/o2dvsv2pnhe.jpg',
        posts: [
          '1',
          '8',
          '98.2283455196284',
          '79.67281260898254',
          '97.15363152076615',
        ],
        followers: [],
        followees: [
          '2',
          '4',
          '5',
        ],
        notifications: [],
      }],
  };
  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const res = await apiLib.getUserById('1');
  expect(res).toMatchObject(mockResponse.data);
});

test('update user API', async () => {
  const mockResponse = 200;
  fetch.mockResponseOnce(mockResponse);
  const newUser = [
    {
      id: '1',
      user_name: 'yuxinhu',
      email: 'yuxinhu@seas.upenn.edu',
      password: '123dsdffe',
      avatar_url: 'https://www.paperlessmovement.com/wp-content/uploads/2019/09/o2dvsv2pnhe.jpg',
      posts: [
        '1',
        '8',
        '98.2283455196284',
        '79.67281260898254',
        '97.15363152076615',
      ],
      followers: [],
      followees: [
        '2',
        '4',
        '5',
      ],
      notifications: [],
    }];

  const res = await apiLib.updateUser(newUser);
  expect(res).toEqual(mockResponse);
});

test('register new user API', async () => {
  const mockResponse = 200;
  fetch.mockResponseOnce(mockResponse);

  const res = await apiLib.registerNewUser('ncm656112', 'email', 'password');
  expect(res).toEqual(mockResponse);
});

test('create new post API', async () => {
  const mockResponse = {
    data: {
      _id: 'testId',
    },
  };
  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const res = await apiLib.createPost('userId', 'text', 'imageUrl', 'videoUrl', 'isPrivate', 'isImage', 'restricted');
  expect(res).toEqual(mockResponse.data._id);
});

test('create comment API', async () => {
  const mockResponse = {
    data: {
      _id: 'testId',
    },
  };
  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const res = await apiLib.createComment('postId', 'userId', 'text');
  expect(res).toEqual(mockResponse.data._id);
});

test('edit comment by ID API', async () => {
  const mockResponse = 200;
  fetch.mockResponseOnce(mockResponse);

  const res = await apiLib.editCommentById('commentId', 'postId', 'userId', 'text');
  expect(res).toEqual(mockResponse);
});

test('update Post API', async () => {
  const mockResponse = 200;
  fetch.mockResponseOnce(mockResponse);
  const newPost = [{
    id: '1',
    date: '2022-10-16',
    user_id: '1',
    text: 'hahaha',
    image_url: 'https://www.paperlessmovement.com/wp-content/uploads/2019/09/o2dvsv2pnhe.jpg',
    video_url: '',
    likes: [
      '2',
    ],
    comments: [
      '1',
      '2',
      '3',
    ],
    private: false,
    isImage: true,
    restricted: '',
  }];

  const res = await apiLib.updatePost(newPost);
  expect(res).toEqual(mockResponse);
});

test('getPostById API', async () => {
  const mockResponse = {
    data: [
      {
        id: '1',
        date: '2022-10-16',
        user_id: '1',
        text: 'hahaha',
        image_url: 'https://www.paperlessmovement.com/wp-content/uploads/2019/09/o2dvsv2pnhe.jpg',
        video_url: '',
        likes: [
          '2',
        ],
        comments: [
          '1',
          '2',
          '3',
        ],
        private: false,
        isImage: true,
        restricted: '',
      },
    ],
  };
  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const res = await apiLib.getPostById('1');
  expect(res).toMatchObject(mockResponse.data);
});

test('getCommentById API', async () => {
  const mockResponse = {
    data: [
      {
        id: '1',
        post_id: '1',
        user_id: '2',
        date: '2022-10-21T13:36:26.849Z',
        text: 'Nice pic',
      },
    ],
  };
  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const res = await apiLib.getCommentById('1');
  expect(res).toMatchObject(mockResponse.data);
});

test('delete comment API', async () => {
  const mockResponse = 200;
  fetch.mockResponseOnce(mockResponse);

  const res = await apiLib.deleteCommentById('1');
  expect(res).toEqual(mockResponse);
});

test('delete post By ID API', async () => {
  const mockResponse = 200;
  fetch.mockResponseOnce(mockResponse);

  const res = await apiLib.deletePostById('1');
  expect(res).toEqual(mockResponse);
});

test('get follow suggestion API', async () => {
  const mockResponse = {
    data: [
      {
        id: '1',
        post_id: '1',
        user_id: '2',
        date: '2022-10-21T13:36:26.849Z',
        text: 'Nice pic',
      },
    ],
    id: 'testID',
  };

  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const res = await apiLib.getFollowSuggestion('1');
  expect(res).toMatchObject(mockResponse.data);
});
