const { MongoClient, Timestamp } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(MONGO_URI, options);

// TODO: declare 'db'
const db = client.db("business_connect");

// create a post

const createPost = async (req, res) => {
  try {
    await client.connect();

    let newPostData = {
      _id: uuidv4(),
      userId: req.body.userId,
      desc: req.body.desc,
      img: req.body.img,
      likes: [],
      createdAt: new Date(),
    };

    const newPost = await db.collection("posts").insertOne(newPostData);

    res.status(200).json({
      status: 200,
      data: newPost,
      message: "Request successful",
    });

    await client.close();
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

// update a post

const updatePost = async (req, res) => {
  await client.connect();
  try {
    const findPost = await db
      .collection("posts")
      .findOne({ _id: req.params._id });

    console.log("post", findPost);

    if (findPost._id === req.body._id) {
      const updatePostData = await db
        .collection("posts")
        .updateOne({ _id: req.body._id }, { $set: req.body });

      res.status(200).json({
        status: 200,
        data: updatePostData,
        message: "Request successful",
      });
    } else {
      res.status(404).json({ status: 404, message: "Post not found!" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
  await client.close();
};

// delete a post
const deletePost = async (req, res) => {
  await client.connect();
  try {
    const findPost = await db
      .collection("posts")
      .findOne({ _id: req.params._id });

    console.log("post", findPost);

    if (findPost._id === req.body._id) {
      const deletePostData = await db
        .collection("posts")
        .deleteOne({ _id: req.body._id }, { $set: req.body });

      res.status(200).json({
        status: 200,
        data: deletePostData,
        message: "Request successful",
      });
    } else {
      res.status(404).json({ status: 404, message: "Post not found!" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
  await client.close();
};

// like a post

const likePost = async (req, res) => {
  await client.connect();
  try {
    const findPost = await db
      .collection("posts")
      .findOne({ _id: req.params._id });

    console.log("post", findPost);

    if (!findPost.likes.includes(req.body.userId)) {
      console.log("likes");
      const updateLike = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: req.params._id },
          { $push: { likes: req.body.userId } },
          { returnDocument: "after" }
        );

      res.status(200).json({
        status: 200,
        data: updateLike,
        message: "The post has been liked",
      });
    } else {
      const unLike = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: req.params._id },
          { $pull: { likes: req.body.userId } },
          { returnDocument: "after" }
        );

      res.status(200).json({
        status: 200,
        data: unLike,
        message: "The post has been unliked",
      });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
  await client.close();
};

// get a post

const getPost = async (req, res) => {
  await client.connect();
  try {
    const findPost = await db
      .collection("posts")
      .findOne({ _id: req.params._id });

    findPost
      ? res.status(200).json({
          status: 200,
          data: findPost,
          message: "Request succesfull",
        })
      : res.status(404).json({ status: 404, message: "Post not found" });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
  await client.close();
};

// get timeline posts
const getAllPosts = async (req, res) => {
  try {
    await client.connect();
    const currentUser = await db
      .collection("users")
      .findOne({ _id: req.params.userId });

    if (currentUser) {
      const userPosts = await db
        .collection("posts")
        .find({ userId: currentUser._id })
        .toArray();

      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return db.collection("posts").find({ userId: friendId }).toArray();
        })
      );

      const allPosts = userPosts.concat(...friendPosts);

      res.status(200).json({
        status: 200,
        data: allPosts,
        message: "Request succesfull",
      });
    } else {
      res.status(404).json({ status: 404, message: "Posts not found" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

// get user's all posts

const getUserProfilePosts = async (req, res) => {
  await client.connect();
  try {
    const user = await db
      .collection("users")
      .findOne({ username: req.params.username });

    if (user) {
      const userPosts = await db
        .collection("posts")
        .find({ userId: user._id })
        .toArray();

      res.status(200).json({
        status: 200,
        data: userPosts,
        message: "Request succesfull",
      });
    } else {
      res.status(404).json({ status: 404, message: "Posts not found" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
  await client.close();
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
  getAllPosts,
  getUserProfilePosts,
};
