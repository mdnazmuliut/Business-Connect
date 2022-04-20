import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../context/UserContext";

const Conversation = ({ conversation, currentUser }) => {
  const { users } = useContext(UserContext);

  const friendId = conversation?.members?.find(
    (member) => member !== currentUser._id
  );

  return (
    <>
      {users?.map((key) => {
        return (
          key._id === friendId && (
            <div key={key._id}>
              <Wrapper>
                <FriendImg src={key?.profilePicture} />
                <FriendsName>{key?.username}</FriendsName>
              </Wrapper>
            </div>
          )
        );
      })}
    </>
  );
};

const Wrapper = styled.div`
  margin-top: 50px;
  display: flex;
`;

const FriendImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const FriendsName = styled.div`
  margin: 10px;
  font-size: 18px;
  font-weight: bold;
`;

export default Conversation;
