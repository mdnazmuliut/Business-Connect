import React, { useState, useContext, useCallback } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { PostContext } from "../context/PostContext";

const PostInput = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const { setPosts } = useContext(PostContext);

  const [userInput, setUserInput] = useState("");
  const [remainingText, setRemainingText] = useState(280);

  let maxChar = 280;

  let inputValueLength = 0;

  let btnDisabled = remainingText === 280 || remainingText < 0 ? true : false;

  const getFeeData = useCallback(() => {
    fetch(`/posts/timeline/${currentUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(
          data.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      })
      .catch((err) => {
        console.log("Error", err);
      });
  });

  const handleClick = (e) => {
    setUserInput(e.target.value);
    inputValueLength = e.target.value.length;

    setRemainingText(maxChar - inputValueLength);
  };

  const dataObject = {
    userId: currentUser._id, //Current user must be
    desc: userInput,
  };

  const handleSubmit = (e) => {
    console.log(JSON.stringify(dataObject));
    e.preventDefault();

    if (remainingText >= 0) {
      fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dataObject),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data from PostInput:", data);
          getFeeData();
        })
        .catch((err) => {
          console.log("Error", err);
        });

      setUserInput("");
      setRemainingText(280);
    }
  };

  return (
    <MainDiv>
      <WrapInput>
        <TextArea
          value={userInput}
          placeholder="What's happening?"
          onChange={handleClick}
        ></TextArea>
      </WrapInput>

      <Count remainingText={remainingText}>{remainingText}</Count>

      <Button onClick={handleSubmit} disabled={btnDisabled}>
        Post
      </Button>
    </MainDiv>
  );
};

const MainDiv = styled.div`
  position: relative;
  margin-top: 20px;
  padding: 20px;
  width: 50vw;
  margin-bottom: 50px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
`;

const WrapInput = styled.div`
  display: flex;
`;

const AvatarProfile = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const TextArea = styled.textarea`
  margin-bottom: 50px;
  width: 100%;
  height: 50px;
  padding: 12px 20px;
  box-sizing: border-box;
  border: none;
  outline: none;
  border-radius: 4px;
  border: 1px solid lightgrey;
  border-radius: 10px;
  font-size: 18px;
  resize: none;
`;

const Count = styled.div`
  position: absolute;
  right: 180px;
  top: 100px;
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => {
    if (props.remainingText < 0) {
      return "red";
    } else if (props.remainingText < 56) {
      return "orange";
    } else {
      return "black";
    }
  }};
`;

const Button = styled.button`
  width: 120px;
  height: 45px;
  border-radius: 30px;
  font-size: 18px;
  border: none;
  background-color: #0077b5;
  color: white;
  cursor: pointer;
  position: absolute;
  right: 40px;
  top: 85px;

  &:hover {
    padding: 10px;
  }

  &:disabled {
    color: black;
    background-color: lightgray;
    cursor: auto;
  }
`;

const WrapperCircle = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  color: red;
`;

export default PostInput;
