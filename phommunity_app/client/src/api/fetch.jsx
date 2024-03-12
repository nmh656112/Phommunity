const domain = 'http://localhost:8080';

/**
 *
 * deletes any expired token and relaunch the app
 */
const reAuthenticate = (status) => {
  // if the authentication has expired
  // console.log('status:');
  // console.log(status);
  // console.log('//sattus');
  if (status === 401) {
    // delete the token
    sessionStorage.removeItem('app-token');

    // reload the app
    window.location.reload(true);
  }
};

export const getAllUsers = async () => {
  try {
    const res = await fetch(`${domain}/users/`, {
      method: 'GET',
      headers: {
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(res.status);
    const userData = await res.json();
    return userData.data;
  } catch (err) {
    // console.error(err);
    reAuthenticate(401);
    return err;
  }
};

export const loginAuser = async (username, password) => {
  const userdata = {
    userName: username,
    password,
  };
  // console.log(userdata);
  try {
    const res = await fetch(`${domain}/login`, {
      method: 'POST',
      body: JSON.stringify(userdata),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    // console.log(res);
    const response = await res.json();
    response.status = res.status;
    return response;
  } catch (err) {
    // console.error(err);
    return err;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await fetch(`${domain}/users/${id}`, {
      method: 'GET',
      headers: {
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },

    });
    reAuthenticate(res.status);
    const userData = await res.json();
    return userData.data;
  } catch (err) {
    // console.error(err);
    reAuthenticate(401);
    return err;
  }
};

// can update user
export const updateUser = async (user) => {
  try {
    const JSONServerURL = `${domain}/users/${user._id}`;
    const response = await fetch(JSONServerURL, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(response.status);
    return response.status;
  } catch (err) {
    // console.error(err);
    reAuthenticate(401);
    return err;
  }
};

export const registerNewUser = async (username, email, password) => {
  try {
    const newUserdata = {
      user_name: username,
      email,
      password,
      avatar_url: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      posts: [],
      followers: [],
      followees: [],
      fails: 0,
      locked_timeStamp: null,
    };

    // console.log(JSON.stringify(newUserdata));
    const response = await fetch(`${domain}/users/`, {
      method: 'POST',
      body: JSON.stringify(newUserdata),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    return response.status;
  } catch (err) {
    // console.error(err);
    return err;
  }
};

export const getPostById = async (postId) => {
  try {
    const url = `${domain}/posts/${postId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(response.status);
    const post = await response.json();
    return post.data;
  } catch (err) {
    // console.error(err);
    reAuthenticate(401);
    return err;
  }
};

export const createPost = async (
  userId,
  text,
  imageUrl,
  videoUrl,
  isPrivate,
  isImage,
  restricted,
) => {
  try {
    const postBody = {
      date: new Date(),
      text,
      user_id: userId,
      image_url: imageUrl,
      video_url: videoUrl,
      likes: [],
      comments: [],
      private: isPrivate,
      isImage,
      restricted,
    };
    const url = `${domain}/posts/`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(postBody),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(response.status);
    const res = await response.json();
    // console.log(res.data._id);
    return res.data._id;
  } catch (err) {
    // console.log(err);
    reAuthenticate(401);
    return err;
  }
};

export const getActivityFeed = async (userId, followees) => {
  try {
    const url = `${domain}/getActivityFeed/`;
    const posts = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(posts.status);
    const response = await posts.json();
    const activityFeed = response.data.filter((post) => {
      if (followees.includes(post.user_id) && !post.private
      && ((!post.restricted) || (post.restricted && (!post.restricted.includes(userId))))) {
        return true;
      }
      return false;
    });
    const feeds = [];
    await Promise.all(
      activityFeed.map(async (postObj) => {
        const followee = await getUserById(postObj.user_id);
        feeds.push({ post: postObj, user: followee });
      }),
    );
    feeds.sort((a, b) => {
      const d1 = Date.parse(a.post.date);
      const d2 = Date.parse(b.post.date);
      return d2 - d1;
    });
    return feeds;
  } catch (err) {
    // console.log(err);
    reAuthenticate(401);
    return err;
  }
};

export const updatePost = async (post) => {
  try {
    const JSONServerURL = `${domain}/posts/${post._id}`;
    const response = await fetch(JSONServerURL, {
      method: 'PUT',
      body: JSON.stringify(post),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(response.status);
    return response.status;
  } catch (err) {
    // console.error(err);
    reAuthenticate(401);
    return err;
  }
};

export const deletePostById = async (postId) => {
  try {
    const JSONServerURL = `${domain}/posts/${postId}`;
    const response = await fetch(JSONServerURL, {
      method: 'DELETE',
      headers: {
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(response.status);
    return response.status;
  } catch (err) {
    reAuthenticate(401);
    return err;
  }
};

export const getCommentById = async (commentId) => {
  try {
    const res = await fetch(`${domain}/comments/${commentId}`, {
      method: 'GET',
      headers: {
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(res.status);
    const commentData = await res.json();
    return commentData.data;
  } catch (err) {
    // console.log(err);
    reAuthenticate(401);
    return err;
  }
};

export const deleteCommentById = async (commentId) => {
  try {
    const JSONServerURL = `${domain}/comments/${commentId}`;
    const response = await fetch(JSONServerURL, {
      method: 'DELETE',
      headers: {
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(response.status);
    return response.status;
  } catch (err) {
    reAuthenticate(401);
    return err;
  }
};

export const createComment = async (postId, userId, text) => {
  try {
    const postBody = {
      post_id: postId,
      user_id: userId,
      date: new Date(),
      text,
    };
    const url = `${domain}/comments/`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(postBody),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(response.status);
    const res = await response.json();
    return res.data._id;
  } catch (err) {
    // console.log(err);
    reAuthenticate(401);
    return err;
  }
};

export const editCommentById = async (commentId, postId, userId, text) => {
  try {
    const postBody = {
      id: commentId,
      post_id: postId,
      user_id: userId,
      date: new Date(),
      text,
    };
    const url = `${domain}/comments/${commentId}`;
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(postBody),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(response.status);
    return response.status;
  } catch (err) {
    // console.log(err);
    reAuthenticate(401);
    return err;
  }
};

export const getFollowSuggestion = async (id) => {
  try {
    const url = `${domain}/getFollowSuggestion/${id}`;
    const posts = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null,
      },
    });
    reAuthenticate(posts.status);
    const userData = await posts.json();
    return userData.data;
  } catch (err) {
    // console.error(err);
    reAuthenticate(401);
    return err;
  }
};
