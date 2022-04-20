const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(MONGO_URI, options);
const client1 = new MongoClient(MONGO_URI, options);

// TODO: declare 'db'
const db = client.db("business_connect");
const db1 = client1.db("business_connect");

//get a user

const getUser = async (req, res) => {
  const reqParamId = req.params._id;

  try {
    await client.connect();

    const usersFetch = await db
      .collection("users")
      .findOne({ _id: reqParamId });

    if (usersFetch) {
      const { password, ...other } = usersFetch;

      res.status(200).json({
        status: 200,
        data: other,
        message: "Request successful",
      });
    } else {
      res.status(404).json({ status: 404, message: "User not found" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

//get all users

const getUsers = async (req, res) => {
  try {
    await client1.connect();

    const usersFetch = await db1.collection("users").find().toArray();

    let filterUsers = [];
    if (usersFetch) {
      filterUsers = usersFetch.map((user) => {
        delete user.password;

        return user;
      });

      res.status(200).json({
        status: 200,
        data: filterUsers,
        message: "Request successful",
      });
    } else {
      res.status(404).json({ status: 404, message: "User not found" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client1.close();
    console.log("disconnect:");
  }
};

const updateUser = async (req, res) => {
  const reqParamId = req.params._id;
  const reqBodyId = req.body._id;
  await client.connect();

  if (reqBodyId === reqParamId || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const usersFetch = await db
        .collection("users")
        .findOneAndUpdate({ _id: reqParamId }, { $set: req.body });

      const { password, ...other } = req.body;

      res.status(200).json({
        status: 200,
        data: other,

        message: "Request successful",
      });
    } catch (err) {
      console.log("error", err);
      res.status(500).json({ status: 500, message: err.message });
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }

  await client.close();
};

const followUser = async (req, res) => {
  const reqParamId = req.params._id;
  const reqBodyId = req.body._id;

  await client.connect();

  if (reqBodyId !== reqParamId) {
    try {
      const user = await db.collection("users").findOne({ _id: reqParamId });

      console.log(" user:", user);

      const currentUser = await db
        .collection("users")
        .findOne({ _id: reqBodyId });

      console.log("current user:", currentUser);

      if (!user.followers.includes(reqBodyId)) {
        const usersFollowers = await db
          .collection("users")
          .findOneAndUpdate(
            { _id: reqParamId },
            { $push: { followers: reqBodyId } },
            { returnDocument: "after" }
          );
        await db
          .collection("users")
          .findOneAndUpdate(
            { _id: reqBodyId },
            { $push: { followings: reqParamId } }
          );

        console.log("userFollowers:", usersFollowers.value.followers);

        res.status(200).json({
          status: 200,
          data: usersFollowers.value.followers,
          message: "user has been followed",
        });
      } else {
        res
          .status(403)
          .json({ status: 403, message: "you allready follow this user" });
      }
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  } else {
    res.status(403).json({ status: 403, message: "you cant follow yourself" });
  }
  await client.close();
};

const unfollowUser = async (req, res) => {
  const reqParamId = req.params._id;
  const reqBodyId = req.body._id;

  await client.connect();

  if (reqBodyId !== reqParamId) {
    try {
      const user = await db.collection("users").findOne({ _id: reqParamId });

      console.log(" user:", user);

      const currentUser = await db
        .collection("users")
        .findOne({ _id: reqBodyId });

      console.log("current user:", currentUser);

      if (user.followers.includes(reqBodyId)) {
        const usersFollowers = await db
          .collection("users")
          .findOneAndUpdate(
            { _id: reqParamId },
            { $pull: { followers: reqBodyId } },
            { returnDocument: "after" }
          );
        await db
          .collection("users")
          .findOneAndUpdate(
            { _id: reqBodyId },
            { $pull: { followings: reqParamId } }
          );

        res.status(200).json({
          status: 200,
          data: usersFollowers.value.followers,
          message: "user has been unfollowed",
        });
      } else {
        res
          .status(403)
          .json({ status: 403, message: "you don't follow this user" });
      }
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  } else {
    res
      .status(403)
      .json({ status: 403, message: "you cant unfollow yourself" });
  }
  await client.close();
};

//get friends

const getFriends = async (req, res) => {
  await client.connect();
  try {
    const user = await db
      .collection("users")
      .findOne({ _id: req.params.userId });

    console.log("user:", user);

    if (user) {
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return db.collection("users").findOne({ _id: friendId });
        })
      );

      console.log("friends:", friends);

      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });

      res.status(200).json({
        status: 200,
        data: friendList,
        message: "Request succesfull",
      });
    } else {
      res.status(404).json({ status: 404, message: "User not found" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
  await client.close();
};

module.exports = {
  getUser,
  getUsers,
  updateUser,
  followUser,
  unfollowUser,
  getFriends,
};
