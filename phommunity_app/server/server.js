// Express app file

// (1) import express
// backend ==> require
const express = require('express');
const { ObjectId } = require('mongodb');

// (2) import and enable cors
// (cross-origin resource sharing)
const cors = require('cors');

// import json web token
const jwt = require('jsonwebtoken');

// secrete key
const secret = 'Thi_iS2_@_Very_$trong_screte_KeY5';

// import authentication operations
const auth = require('./auth');

// (3) create an instanece of our express app
const webapp = express();

// (4) enable cors
webapp.use(cors());

webapp.use(express.json());

// (6) configure express to parse bodies
webapp.use(express.urlencoded({ extended: true }));

// (7) import the db interactions module
const dbLib = require('./dbFunctions');

// root endpoint / route
webapp.get('/', (req, resp) => {
  resp.json({ message: 'welcome to our backend!!!' });
});

webapp.get('/users/', async (req, res) => {
  // console.log(req.headers.authorization)
  try {
    // get the data from the db
    const results = await dbLib.getAllUsers();
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// login endpoint
webapp.post('/login', async (req, res) => {
  try {
    // console.log("create a new session");
    // console.log(req.body);
    const { userName, password } = req.body;
    // determine if the user exists and the password is correct
    const allUsers = await dbLib.getAllUsers();
    let matchedID = '';
    let passwordCorrect = false;
    let accountNotLocked = true;
    allUsers.forEach((element) => {
      if (element.user_name === userName) {
        matchedID = element._id.toHexString();
        if (element.password === password) {
          passwordCorrect = true;
        }
      }
    });

    if (matchedID) {
      const matchedUser = await dbLib.getAUser(matchedID);
      const lockedTimeStamp = matchedUser.locked_timeStamp;
      const currentTimeStamp = Math.floor(Date.now() / 1000);
      // console.log(`currentTimeStamp: ${currentTimeStamp}`);
      // console.log(`lockedTimeStamp: ${lockedTimeStamp}`);

      // if the locked timestamp is not null, determine if the interval is longer than 2 hrs
      if (lockedTimeStamp) {
        // console.log(`current diff: ${currentTimeStamp - lockedTimeStamp}`)
        if (currentTimeStamp - lockedTimeStamp >= 7200) {
          accountNotLocked = true;
          // reset the timestamp
          matchedUser.locked_timeStamp = null;
        } else {
          accountNotLocked = false;
        }
      }

      // console.log(`AccountNotLocked: ${accountNotLocked}`);
      // console.log(`passwordCorrect: ${passwordCorrect}`);
      if (accountNotLocked) {
        // check the password
        if (passwordCorrect) {
          // if there is a matched user, response 201
          // sign the token and send it to the frontend
          const jwtoken = jwt.sign({ username: userName }, secret, { expiresIn: '12000s' });
          // reset the number of fails and update the database
          matchedUser.fails = 0;
          matchedUser.locked_TimeStamp = null;
          await dbLib.updateAUser(matchedUser);
          // console.log('Login success')
          res.status(201).json({ data: matchedUser, token: jwtoken });
        } else {
          // update the number of login failure
          matchedUser.fails += 1;
          if (matchedUser.fails === 3) {
            matchedUser.fails = 0;
            matchedUser.locked_timeStamp = Math.floor(Date.now() / 1000);
            // if the account has been locked, response 410
            // console.log(`Password Incorrect, account has been locked for 2 hrs` );
            await dbLib.updateAUser(matchedUser);
            res.status(410).json({ message: 'Password Incorrect, account has been locked for 2 hrs' });
          } else {
            // if password incorrect, response 409
            // console.log(`Password Incorrect, current fails: ${matchedUser.fails}`);
            await dbLib.updateAUser(matchedUser);
            res.status(409).json({ message: `Password Incorrect, current fails: ${matchedUser.fails}` });
          }
        }
      } else {
        // console.log('Account is still locked, please wait');
        res.status(410).json({ message: 'Account is still locked, please wait.' });
      }
    } else {
      // if there is no such a user, response 409
      // console.log('No Such User');
      res.status(409).json({ message: 'No Such User' });
    }
    // send the response with the appropriate status code
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// get a user by ID endpoint
webapp.get('/users/:id', async (req, res) => {
  // console.log('READ a user with ID');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      // console.log(req.params)
      const results = await dbLib.getAUser(req.params.id);
      if (results === undefined) {
        res.status(404).json({ error: 'unknown user' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

// PUT /users/id endpoint
webapp.put('/users/:id', async (req, res) => {
  // console.log('UPDATE a user');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      let newUser;
      let i;
      if (req.body.user_name === 'updateUser') {
        newUser = {
          user_name: req.body.user_name,
        };
      } else {
        newUser = {
          _id: req.body._id,
          user_name: req.body.user_name,
          email: req.body.email,
          password: req.body.password,
          avatar_url: req.body.avatar_url,
          posts: [],
          followees: [],
          followers: [],
          fails: 0,
          locked_timeStamp: null,
        };
        for (i = 0; i < req.body.posts.length; i += 1) {
          newUser.posts.push(ObjectId(req.body.posts[i]));
        }
        for (i = 0; i < req.body.followers.length; i += 1) {
          newUser.followers.push(ObjectId(req.body.followers[i]));
        }
        for (i = 0; i < req.body.followees.length; i += 1) {
          newUser.followees.push(ObjectId(req.body.followees[i]));
        }
      }

      // console.log(newUser);
      const result = await dbLib.updateAUser(newUser);
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

// POST /users/ endpoint, for registeration
webapp.post('/users/', async (req, res) => {
  // console.log('CREATE a user');
  // console.log(req.body)
  try {
    // create the new user
    const newUser = req.body;
    // console.log(newUser)
    const result = await dbLib.addUser(newUser);
    // console.log(result)
    // send the response with the appropriate status code
    res.status(201).json({ data: { id: result, ...newUser } });
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

// implement the DELETE /user/id endpoint
webapp.delete('/users/:id', async (req, res) => {
  // console.log('DELETE a user');
  try {
    const result = await dbLib.deleteAUser(req.params.id);
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'user not in the system' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// get a comment by ID
webapp.get('/comments/:id', async (req, res) => {
  // console.log(`READ a comment with ID ${req.params.id}`);
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      // console.log(req.params)
      const results = await dbLib.getAComment(req.params.id);
      if (results === undefined) {
        res.status(404).json({ error: 'unknown comment' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

// update a comment
webapp.put('/comments/:id', async (req, res) => {
  // console.log('UPDATE a comment');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // console.log(req);
      const result = await dbLib.editComment(req.params.id, req.body);
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

// create a comment
webapp.post('/comments/', async (req, res) => {
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // create the new comment
      const newComment = {
        post_id: ObjectId(req.body.post_id),
        user_id: ObjectId(req.body.user_id),
        date: req.body.date,
        text: req.body.text,
      };
      // console.log(newComment)
      const result = await dbLib.createComment(newComment);
      // console.log(result)
      // send the response with the appropriate status code
      res.status(201).json({ data: { id: result, ...newComment } });
    } catch (err) {
      // console.log(err);
      res.status(409).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

// delete a comment
webapp.delete('/comments/:id', async (req, res) => {
  // console.log('DELETE a comment');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      const result = await dbLib.deleteComment(req.params.id);
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'comment to be deleted is not in the system' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

webapp.get('/posts/', async (req, res) => {
  // console.log('READ all posts');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      const results = await dbLib.getAllPosts();
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

webapp.get('/getActivityFeed/', async (req, res) => {
  // console.log(req.headers.authorization)
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      const results = await dbLib.getAllPosts();
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

// get a post by ID
webapp.get('/posts/:id', async (req, res) => {
  // console.log(`READ a post with ID ${req.params.id}`);
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      // console.log(req.params)
      const results = await dbLib.getAPost(req.params.id);
      if (results === undefined) {
        res.status(404).json({ error: 'unknown post' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

// update a post
webapp.put('/posts/:id', async (req, res) => {
  // console.log('UPDATE a post');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      let newPost;
      if (req.body.date === 'Test') {
        newPost = {
          date: req.body.date,
        };
      } else {
        newPost = {
          _id: req.body._id,
          date: req.body.date,
          user_id: ObjectId(req.body.user_id),
          text: req.body.text,
          image_url: req.body.image_url,
          video_url: req.body.video_url,
          likes: req.body.likes,
          comments: [],
          private: req.body.private,
          isImage: req.body.isImage,
          restricted: req.body.restricted,
        };
        for (let i = 0; i < req.body.comments.length; i += 1) {
          newPost.comments.push(ObjectId(req.body.comments[i]));
        }
      }
      const result = await dbLib.editPost(req.params.id, newPost);
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

// create a post
webapp.post('/posts/', async (req, res) => {
  // console.log('CREATE a post');
  // console.log(req.body)
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // create the new post
      const newPost = {
        date: req.body.date,
        user_id: ObjectId(req.body.user_id),
        text: req.body.text,
        image_url: req.body.image_url,
        video_url: req.body.video_url,
        likes: req.body.likes,
        comments: req.body.comments,
        private: req.body.private,
        isImage: req.body.isImage,
        restricted: req.body.restricted,
      };
      const result = await dbLib.createPost(newPost);
      // send the response with the appropriate status code
      res.status(201).json({ data: { id: result, ...newPost } });
    } catch (err) {
      res.status(409).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

// delete a post
webapp.delete('/posts/:id', async (req, res) => {
  // console.log('DELETE a post');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      const result = await dbLib.deletePost(req.params.id);
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'post to be deleted is not in the system' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

webapp.get('/getFollowSuggestion/:id', async (req, res) => {
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      const suggestedUsers = [];
      const curSelfUser = await dbLib.getAUser(req.params.id);
      const curFollowees = curSelfUser.followees;
      const map = new Map();
      await Promise.all(
        curFollowees.map(async (curFollowee) => {
          const curFolloweeObj = await dbLib.getAUser(curFollowee);
          const curFolloweeFollwer = curFolloweeObj.followers;
          for (let i = 0; i < curFolloweeFollwer.length; i += 1) {
            const tmp = curFolloweeFollwer[i].toHexString();
            if (map.get(tmp)) {
              map.set(tmp, map.get(tmp) + 1);
            } else {
              map.set(tmp, 1);
            }
          }
        }),
      );
      // console.log(`followee list: ${curFollowees}`);
      const tmpSuggestUsers = [];
      map.forEach((value, key) => {
        if (value > 2) {
          tmpSuggestUsers.push(key);
        }
      });
      // console.log(`tmp suggest users:${tmpSuggestUsers}`);

      const curFolloweeLstInString = [];
      for (let k = 0; k < curFollowees.length; k += 1) {
        curFolloweeLstInString[k] = curFollowees[k].toHexString();
      }

      for (let j = 0; j < tmpSuggestUsers.length; j += 1) {
        const tmp = tmpSuggestUsers[j];
        if ((!curFolloweeLstInString.includes(tmp)) && (!(tmp === req.params.id))) {
          suggestedUsers.push(tmp);
        }
      }
      // console.log(`suggested users:${suggestedUsers}`);

      // send the response with the appropriate status code
      res.status(200).json({ data: suggestedUsers });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ message: 'failed authentication' });
  }
});

// catch all endpoint
webapp.use((req, resp) => {
  resp.status(404).json({ error: 'invalid endpoint' });
});

// do not forget to export the express server
module.exports = webapp;
