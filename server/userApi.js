// Whole File is optional as All users data is fetched inside batchImport.js

const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
let usersData = require("./userData");

//getUserData from api
const getUserData = async () => {
  try {
    const result = await fetch("https://randomuser.me/api/?results=2");

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

    return formatData;
  } catch (err) {
    console.log("error:", err);
  }
};
// 4.1
getUserData().then((dataFound) => {
  console.log("dataFound is Array:", Array.isArray(dataFound));
  usersData = [...dataFound];
  console.log("userData is Array:", Array.isArray(usersData));
});

console.log("usersData after functionCall:", Array.isArray(usersData));

module.exports = { usersData, getUserData };
