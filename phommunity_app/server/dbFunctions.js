// this is a node app, we must use commonJS modules/ require

// import the mongodb driver
const { MongoClient } = require('mongodb');

// import ObjectID
const { ObjectId } = require('mongodb');

const mongodbKeys = require('./mongodbKeys.json');

// the mongodb server URL
const dbURL = `mongodb+srv://${mongodbKeys.username}:${mongodbKeys.password}@cluster0.zvajbip.mongodb.net/Phommunity?retryWrites=true&w=majority`;

/**
 * MongoDB database connection
 * It will be exported so we can close the connection
 * after running our tests
 */
let MongoConnection;
// connection to the db
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = (await MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )); // we return the entire connection, not just the DB
    // check that we are connected to the db
    // console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    // console.log(err.message);
    return null;
  }
};
/**
 *
 * @returns the database attached to this MongoDB connection
 */
const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
 *
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

// READ all users
// await/async syntax
const getAllUsers = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').find({}).toArray();
    // print the results
    // console.log(`Users: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// Get a user by ID
const getAUser = async (UserID) => {
  try {
    // get the db
    const db = await getDB();
    // console.log(ObjectId(UserID));
    const result = await db.collection('users').findOne({ _id: ObjectId(UserID) });
    // print the result
    // console.log(`User: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// UPDATE a user by ID
const updateAUser = async (newUser) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').updateOne(
      { _id: ObjectId(newUser._id) },
      {
        $set: {
          user_name: newUser.user_name,
          email: newUser.email,
          avatar_url: newUser.avatar_url,
          posts: newUser.posts,
          followers: newUser.followers,
          followees: newUser.followees,
          fails: newUser.fails,
          locked_timeStamp: newUser.locked_timeStamp,
        },
      },
    );
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// create a new user
const addUser = async (newUser) => {
  // get the db
  const db = await getDB();
  db.collection('users').insertOne(
    newUser,
    (err, result) => {
      // if there was an error
      if (err) {
        // console.log(`error: ${err.message}`);
      }
      // print the id of the student
      // console.log(`New student created with id: ${result.insertedId}`);
      // return the result
      return result.insertedId;
    },
  );
};

const deleteAUser = async (userID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').deleteOne(
      { _id: ObjectId(userID) },
    );
    // print the result
    // console.log(`User: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// READ all comments
const getAllComments = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('comments').find({}).toArray();
    // console.log(`Users: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// Get a comment by ID
const getAComment = async (commentId) => {
  try {
    // get the db
    const db = await getDB();
    // console.log(ObjectId(commentId));
    const result = await db.collection('comments').findOne({ _id: ObjectId(commentId) });
    // print the result
    // console.log(`User: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// Edit a comment
const editComment = async (commentId, newComment) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('comments').updateOne(
      { _id: ObjectId(commentId) },
      {
        $set: {
          post_id: ObjectId(newComment.post_id),
          user_id: ObjectId(newComment.user_id),
          date: newComment.date,
          text: newComment.text,
        },
      },
    );
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// Create a new comment
const createComment = async (newComment) => {
  // get the db
  const db = await getDB();
  db.collection('comments').insertOne(
    newComment,
    (err, result) => {
      // if there was an error
      if (err) {
        // console.log(`error: ${err.message}`);
      }
      // print the id of the student
      // console.log(`New comment created with id: ${result.insertedId}`);
      // return the result
      return result.insertedId;
    },
  );
};

// Delete a comment
const deleteComment = async (commentId) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('comments').deleteOne(
      { _id: ObjectId(commentId) },
    );
    // print the result
    // console.log(`Comment: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// READ all posts
const getAllPosts = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('posts').find({}).toArray();
    // console.log(`Users: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// Get a post by ID
const getAPost = async (postId) => {
  try {
    // get the db
    const db = await getDB();
    // console.log(ObjectId(postId));
    const result = await db.collection('posts').findOne({ _id: ObjectId(postId) });
    // print the result
    // console.log(`User: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// Edit a post
const editPost = async (postId, newPost) => {
  try {
    // get the db
    const db = await getDB();
    // console.log(newPost.image_url);
    const result = await db.collection('posts').updateOne(
      { _id: ObjectId(postId) },
      {
        $set: {
          date: newPost.date,
          user_id: ObjectId(newPost.user_id),
          text: newPost.text,
          image_url: newPost.image_url,
          video_url: newPost.video_url,
          likes: newPost.likes,
          comments: newPost.comments,
          private: newPost.private,
          isImage: newPost.isImage,
          restricted: newPost.restricted,
        },
      },
    );
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// Create a new Post
const createPost = async (newPost) => {
  // get the db
  const db = await getDB();
  db.collection('posts').insertOne(
    newPost,
    (err, result) => {
      // if there was an error
      if (err) {
        // console.log(`error: ${err.message}`);
      }
      // print the id of the student
      // console.log(`New post created with id: ${result.insertedId}`);
      // return the result
      return result.insertedId;
    },
  );
};

// Delete a comment
const deletePost = async (postId) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('posts').deleteOne(
      { _id: ObjectId(postId) },
    );
    // print the result
    // console.log(`Post: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

// export the functions
module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
  addUser,
  getAllUsers,
  getAUser,
  updateAUser,
  deleteAUser,
  getAllComments,
  getAComment,
  editComment,
  createComment,
  deleteComment,
  getAllPosts,
  getAPost,
  editPost,
  createPost,
  deletePost,
};
