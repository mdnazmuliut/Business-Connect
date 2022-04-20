const { MongoClient } = require("mongodb");

const fetch = require("node-fetch");

const { v4: uuidv4 } = require("uuid");

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

const batchImport = async (req, res) => {
  try {
    //getUserData from api

    const result = await fetch("https://randomuser.me/api/?results=10");

    const data = await result.json();

    let formatData = [];
    await data.results.map((el) => {
      return formatData.push({
        _id: uuidv4(),
        name: el.name,
        username: el.name.first,
        email: el.email,
        dob: el.dob.date.split("").slice(0, 10).join(""),
        age: el.dob.age,
        profilePicture: "",
        coverPicture: "",
        isAdmin: false,
        followers: [],
        followings: [],
      });
    });
    // console.log("formData:", Array.isArray(formatData));

    //create new client
    await client.connect();

    console.log("connected!");

    const savedUserdata = await db.collection("users").insertMany(formatData);

    console.log("success", savedUserdata);
  } catch (err) {
    console.log("error>", err.stack);
  }
  client.close();
};

batchImport();
