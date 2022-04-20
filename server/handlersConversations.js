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
const client2 = new MongoClient(MONGO_URI, options);

// TODO: declare 'db'
const db = client.db("business_connect");
const db2 = client2.db("business_connect");

const createConversation = async (req, res) => {
  try {
    await client.connect();

    let newConversationData = {
      //   _id: uuidv4(),
      members: [req.body.senderId, req.body.receiverId],
      createdAt: new Date(),
    };

    let query = {
      members: { $in: [req.body.senderId] },
    };
    let query1 = {
      members: { $in: [req.body.receiverId, req.body.senderId] },
    };

    const fetchedConversation = await db
      .collection("conversations")
      .find(query)
      .toArray();

    console.log("fetchedConversation Check:", fetchedConversation);

    const savedConversation = await db
      .collection("conversations")
      .findOneAndUpdate(
        { query1 },
        { $set: newConversationData },
        { upsert: true }
      );

    if (savedConversation) {
      res.status(200).json({
        status: 200,
        data: savedConversation,
        message: "Request successful",
      });
    } else {
      res
        .status(404)
        .json({ status: 404, message: "Conversation already exists!" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

// get conversation of a user
const getConversation = async (req, res) => {
  try {
    await client2.connect();

    let query = {
      //   _id: uuidv4(),
      members: { $in: [req.params.userId] },
    };

    const fetchedConversation = await db2
      .collection("conversations")
      .find(query)
      .toArray();

    await client2.close();

    res.status(200).json({
      status: 200,
      data: fetchedConversation,
      message: "Request successful",
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const createMessage = async (req, res) => {
  try {
    await client.connect();

    let newMessageData = {
      conversationId: req.body.conversationId,
      sender: req.body.sender,
      text: req.body.text,
      createdAt: new Date(),
    };

    const savedMessage = await db
      .collection("messages")
      .insertOne(newMessageData);

    await client.close();

    res.status(200).json({
      status: 200,
      data: newMessageData,
      message: "Request successful",
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

// get messages of a conversationId
const getMessages = async (req, res) => {
  try {
    await client.connect();

    let query = {
      conversationId: req.params.conversationId,
    };

    const fetchedMessages = await db
      .collection("messages")
      .find(query)
      .toArray();

    await client.close();

    res.status(200).json({
      status: 200,
      data: fetchedMessages,
      message: "Request successful",
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  createConversation,
  getConversation,
  createMessage,
  getMessages,
};
