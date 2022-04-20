"use strict";

const express = require("express");
const morgan = require("morgan");

const PORT = 4000;

const {
  getUser,
  getUsers,
  updateUser,
  followUser,
  unfollowUser,
  getFriends,
} = require("./handlersUsers");

const {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
  getAllPosts,
  getUserProfilePosts,
} = require("./handlersPosts");

const { getProfile, registerAccount, loginAccount } = require("./handlers");

const {
  createConversation,
  getConversation,
  createMessage,
  getMessages,
} = require("./handlersConversations");

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // REST endpoints
  .get("/api/me/profile", getProfile)

  //users
  .get("/users/:_id", getUser)
  .get("/users", getUsers)
  .put("/users/:_id", updateUser)
  .put("/users/:_id/follow", followUser)
  .put("/users/:_id/unfollow", unfollowUser)
  .get("/friends/:userId", getFriends)

  //posts
  .post("/posts", createPost)
  .get("/posts/:_id", getPost)
  .get("/posts/timeline/:userId", getAllPosts)
  .put("/posts/:_id", updatePost)
  .delete("/posts/:_id", deletePost)
  .put("/posts/:_id/like", likePost)
  .get("/posts/profile/:username", getUserProfilePosts)

  //Register
  .post("/register", registerAccount)

  //Login
  .post("/login", loginAccount)

  //Conversations
  .post("/conversations", createConversation)
  .get("/conversations/:userId", getConversation)

  //Messages
  .post("/messages", createMessage)
  .get("/messages/:conversationId", getMessages)

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
