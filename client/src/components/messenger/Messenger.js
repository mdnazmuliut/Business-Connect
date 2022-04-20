import React from "react";
import styled from "styled-components";
import { useContext, useEffect, useRef, useState } from "react";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { SocketContext } from "../context/SocketContext";
import Conversation from "./Conversation";
import Message from "./Message";
import axios from "axios";
import SearchBox from "../searchUsers/SearchBox";

const Messenger = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const { socketCurrent } = useContext(SocketContext);

  const [conversations, setConversations] = useState([]);
  const [flag, setFlag] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [active, setActive] = useState(null);

  const messagesEndRef = useRef(null);

  console.log(" messagesEndRef", messagesEndRef);

  const scrollToBottom = () => {
    if (messagesEndRef) {
      messagesEndRef.current?.scrollIntoView({
        // behavior: "smooth",
        block: "end",
        // inline: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  console.log(" messagesEndRefaAgain", messagesEndRef);

  useEffect(() => {
    socketCurrent?.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages([...messages, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socketCurrent?.emit("addUser", currentUser._id);
  }, [currentUser, conversations, currentChat]);

  //try start -> msg receiver(msgUser)
  const [msgUser, setMsgUser] = useState(null);

  const friendId = currentChat?.members.find(
    (member) => member !== currentUser._id
  );

  console.log("friendId:", friendId);

  const getUser = async () => {
    try {
      const res = await axios(`/users/${friendId}`);

      console.log("FriendId Data in Messenger:", res.data.data);
      setMsgUser(res.data.data);
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(async () => {
    friendId && (await getUser());
  }, [currentChat]);
  //try end

  console.log("CurrentUser in Messenger:", currentUser);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/conversations/${currentUser._id}`);

        console.log("setConversations Data:", res.data.data);
        setConversations(res.data.data);
      } catch (err) {
        console.log("Error", err);
      }
    };
    getConversations();
  }, [currentUser._id, flag]);

  console.log("CurrentChat Data:", currentChat);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/messages/${currentChat._id}`);
        console.log("setMessages Data:", res.data.data);
        setMessages(res.data.data);
      } catch (err) {
        console.log("Error", err);
      }
    };
    getMessages();
  }, [currentChat]);

  console.log("Messages Data:", messages[0]?.sender);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const messageObject = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== currentUser._id
    );
    console.log("receiverId:", receiverId);

    socketCurrent?.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", messageObject);
      setMessages([...messages, messageObject]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateConversation = async (suggestion) => {
    const conversationObject = {
      senderId: currentUser._id,
      receiverId: suggestion,
    };

    try {
      const res = await axios.post("/conversations", conversationObject);
      setFlag(!flag);
    } catch (err) {
      console.log(err);
    }
  };

  // conversationElem.scrollTop = conversationElem.scrollHeight;

  return (
    <>
      <Wrapper>
        <ConversationList>
          <SearchBox handleSelect={handleCreateConversation} />
          {conversations?.map((conversation) => {
            return (
              <ConversationDiv
                key={conversation._id}
                active={active === conversation._id}
                onClick={() => {
                  setCurrentChat(conversation);
                  setActive(conversation._id);
                }}
              >
                <Conversation
                  conversation={conversation}
                  currentUser={currentUser}
                />
              </ConversationDiv>
            );
          })}
        </ConversationList>
        <MessageBoxBorder>
          <MessageBox>
            {currentChat ? (
              <>
                <ChatBoxTop>
                  {messages?.map((message) => {
                    return (
                      <>
                        <div key={message._id}>
                          <Message
                            message={message}
                            msgUser={msgUser}
                            own={message?.sender === currentUser._id}
                          />
                        </div>
                      </>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </ChatBoxTop>
                <ChatBoxBottom>
                  <TextArea
                    placeholder={"send message..."}
                    onChange={(ev) => setNewMessage(ev.target.value)}
                    value={newMessage}
                  ></TextArea>
                  <SendButton onClick={handleSubmit}>Send</SendButton>
                </ChatBoxBottom>
              </>
            ) : (
              <ChatBoxOpen>Open a conversation to start a chat...</ChatBoxOpen>
            )}
          </MessageBox>
        </MessageBoxBorder>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;
const ConversationList = styled.div`
  margin-top: 50px;
  margin-left: 50px;
  margin-right: 50px;
  width: 300px;
`;

const SearchFriends = styled.input`
  border: 1px solid #0077b5;
  width: 150px;
  height: 30px;
  font-size: 14px;
`;

const MessageBoxBorder = styled.div`
  border-left: 2px solid lightgrey;
  height: 100%;
  min-width: 20%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const MessageBox = styled.div`
  margin-top: 50px;
  margin-left: 50px;
  margin-right: 50px;
`;

const ChatBoxTop = styled.div`
  overflow-y: scroll;
  margin-top: 50px;
  margin-left: 50px;
  margin-right: 50px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid lightgrey;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const ChatBoxBottom = styled.div`
  margin-top: 50px;
  margin-left: 50px;
  margin-right: 50px;
  display: flex;
  justify-content: space-between;
  width: 800px;
`;

const TextArea = styled.textarea`
  width: 650px;
  height: 90px;
  margin: 50px;
  padding: 10px;
  width: 80%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const SendButton = styled.button`
  background-color: #0077b5;
  font-size: 18px;
  border-radius: 20px;
  margin-top: 50px;
  padding: 3px;
  width: 100px;
  height: 30px;
  cursor: pointer;
`;

const ConversationDiv = styled.div`
  display: block;
  border-radius: 10px;
  cursor: pointer;
  ${({ active }) =>
    active &&
    `
    background-color: #0077b5;
    color: white;
  `};
  &:hover {
    background-color: lightgray;
    border-radius: 10px;
    height: 50px;
  }
`;

const ChatBoxOpen = styled.div`
  margin: 50px;
  font-size: 24px;
  font-weight: bold;
`;

export default Messenger;
