import React from "react";
import styled from "styled-components";
import { format } from "timeago.js";

const Message = ({ message, msgUser, own }) => {
  if (!message) {
    return <p>...</p>;
  }

  return (
    <>
      <div>
        <MessageTop own={own}>
          <WrapMainMsg>
            <UserImg own={own} src={msgUser?.profilePicture} />
            <MsgTxt own={own}>{message.text}</MsgTxt>
          </WrapMainMsg>
        </MessageTop>
        <MessageBottom own={own}>{format(message.createdAt)}</MessageBottom>
      </div>
    </>
  );
};

const MessageTop = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 800px;
  align-items: ${({ own }) => (own ? "flex-end" : "flex-start")};
`;

const WrapMainMsg = styled.div`
  display: flex;
  margin-top: 20px;
`;

const MsgTxt = styled.div`
  margin-left: 15px;
  margin-right: 0px;
  padding: 15px;
  border-radius: 20px;
  background-color: ${({ own }) => (!own ? "#0077b5" : "lightgrey")};
  color: ${({ own }) => (!own ? "white" : "black")};
  max-width: 300px;
`;

const MessageBottom = styled.div`
  margin-left: 70px;
  margin-top: 5px;
  font-size: 14px;

  display: flex;
  flex-direction: column;
  align-items: ${({ own }) => (own ? "flex-end" : "flex-start")};
`;

const UserImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: ${({ own }) => (own ? "none" : "block")};
`;

export default Message;
