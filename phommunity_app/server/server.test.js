const supertest = require('supertest');
const app = require('./server');
/* globals describe, expect, it */

const request = supertest(app);

describe('Test root endpoint', () => {
  it('Get root endpoint Success', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('login user by username and password success', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    const response = await request.post('/login').send(user);
    expect(response.status).toBe(201);
    // console.log(response.body.token);
  });

  it('Get all users Success', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;
    response = await request.get('/users/').set('Authorization',token);
    // console.log(response);
    expect(response.status).toBe(200);
  });

  it('get user by id success', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;

    response = await request.get('/users/63730024f61b3bba903bc19e').set('Authorization',token);
    expect(response.status).toBe(200);
    // console.log(response.body.data._id)
  });

  it('get user by id fail', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;

    response = await request.get('/users/1').set('Authorization',token);
    expect(response.status).toBe(200);
  });

  it('post a user and update the user and delete the user success', async () => {
    const usera = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(usera);
    const token = response.body.token;

    const user = {
      user_name: 'testUser',
    };
    response = await request.post('/users/').send(user);
    expect(response.status).toBe(201);
    const tmpId = response.body.data._id;
    // console.log(response.body);
    // console.log(tmpId);

    const updatedUser = {
      user_name: 'updateUser',
    };

    const updateResponse = await request.put(`/users/${tmpId}`).set('Authorization',token).send(updatedUser);
    expect(updateResponse.status).toBe(200);

    const tmpResponse = await request.delete(`/users/${tmpId}`).set('Authorization',token);
    expect(tmpResponse.status).toBe(200);
  });


  it('get comment by id success', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;
    response = await request.get('/comments/63730827f61b3bba90415d59').set('Authorization',token);
    expect(response.status).toBe(200);
  });

  it('get comment by id fail', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;

    response = await request.get('/comments/000').set('Authorization',token);
    expect(response.status).toBe(200);
  });

  it('create a comment and update the comment and delete the comment success', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;

    const comment = {
      date: 'Test',
    };
    response = await request.post('/comments/').set('Authorization',token).send(comment);
    expect(response.status).toBe(201);
    const tmpId = response.body.data._id;
    // console.log(response.body);

    const updatedComment = {
      date: 'updateTest',
    };

    const updateResponse = await request.put(`/comments/${tmpId}`).set('Authorization',token).send(updatedComment);
    expect(updateResponse.status).toBe(200);

    const tmpResponse = await request.delete(`/comments/${tmpId}`).set('Authorization',token);
    expect(tmpResponse.status).toBe(200);
  });

  it('get posts success', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;

    response = await request.get('/posts').set('Authorization',token);
    expect(response.status).toBe(200);
  });

  it('get activity feed success', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;

    response = await request.get('/getActivityFeed').set('Authorization',token);
    expect(response.status).toBe(200);
  });

  it('get post by id success', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;

    response = await request.get('/posts/637304aef61b3bba903ef0ca').set('Authorization',token);
    expect(response.status).toBe(200);
  });

  it('get post by id fail', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;

    response = await request.get('/posts/000').set('Authorization',token);
    expect(response.status).toBe(200);
  });

  it('create a post and update the post and delete the post success', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;

    const post = {
      date: 'Test',
    };
    response = await request.post('/posts/').set('Authorization',token).send(post);
    expect(response.status).toBe(201);
    const tmpId = response.body.data._id;

    const updatedPost = {
      date: 'Test',
    };

    const updateResponse = await request.put(`/posts/${tmpId}`).set('Authorization',token).send(updatedPost);
    expect(updateResponse.status).toBe(200);

    const tmpResponse = await request.delete(`/posts/${tmpId}`).set('Authorization',token);
    expect(tmpResponse.status).toBe(200);
  });

  it('get FollowSuggestion success', async () => {
    const user = {
      userName: 'yuxinhu',
      password: '123dsdffe',
    };
    let response = await request.post('/login').send(user);
    const token = response.body.token;

    response = await request.get('/getFollowSuggestion/63730024f61b3bba903bc19e').set('Authorization',token);
    expect(response.status).toBe(200);
  });
});
