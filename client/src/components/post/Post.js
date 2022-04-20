import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import styled from "styled-components";
import { format } from "timeago.js";
import ActionBar from "../ActionBar";

const Post = ({ post }) => {
  const { users } = useContext(UserContext);

  const prevent = (ev) => {
    ev.stopPropagation();
  };

  if (!users) {
    return <p>loading...</p>;
  }

  return (
    <>
      {users?.map((key) => {
        return (
          key._id === post.userId && (
            <div key={key._id}>
              <Wrapper>
                <TopDiv>
                  <LeftDiv>
                    <Img src={key.profilePicture} />
                  </LeftDiv>
                  <RightDiv>
                    <ProfileLink to={`/profile/${key._id}`} onClick={prevent}>
                      <div>{key.username}</div>
                    </ProfileLink>
                    <div>{format(post.createdAt)}</div>
                    <PostDesc>{post?.desc}</PostDesc>
                  </RightDiv>
                </TopDiv>
                <PostImg src={post?.img} />
                <ActionBar post={post} />
              </Wrapper>
            </div>
          )
        );
      })}
    </>
  );
};

const Wrapper = styled.div`
  margin: 10px;
  padding: 20px;
  width: 50vw;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
`;

const TopDiv = styled.div`
  display: flex;
`;

const LeftDiv = styled.div``;

const RightDiv = styled.div`
  margin-left: 20px;
`;

const Img = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ProfileLink = styled(Link)`
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  color: black;
`;

const PostDesc = styled.div`
  font-size: 16px;
  margin-top: 10px;
`;

const PostImg = styled.img`
  margin-top: 10px;
  width: 100%;
`;

export default Post;
