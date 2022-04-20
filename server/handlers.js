const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

require("dotenv").config();
const { MONGO_URI } = process.env;
// console.log("MONGO:", MONGO_URI);
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(MONGO_URI, options);

// TODO: declare 'db'
const db = client.db("business_connect");

const getProfile = async (req, res) => {
  try {
    await client.connect();

    const usersFetch = await db
      .collection("users")
      .findOne({ username: "Isolda" });

    console.log("users:", usersFetch);

    res.status(200).json({
      status: 200,
      data: usersFetch,

      message: "Request successful",
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

const registerAccount = async (req, res) => {
  try {
    await client.connect();

    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    // const newUser = {
    //     username: req.body.username,
    //     email: req.body.email,
    //   password: hashedPassword,
    // };

    //save user and respond

    const user = await db
      .collection("users")
      .updateOne(
        { email: req.body.email },
        { $set: { password: hashedPassword } }
      );

    res.status(200).json({
      status: 200,
      data: user,
      message: "Request successful",
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

//LOGIN
const loginAccount = async (req, res) => {
  try {
    await client.connect();

    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });

    if (!user) {
      return await res
        .status(404)
        .json({ status: 404, message: "user not found" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword &&
      (await res.status(400).json({ status: 400, message: "wrong password" }));

    const { password, ...other } = user;

    if (user && validPassword) {
      res.status(200).json({
        status: 200,
        data: other,
        message: "Request successful",
      });
    }

    await client.close();
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = { getProfile, registerAccount, loginAccount };
