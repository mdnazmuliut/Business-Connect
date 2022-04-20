import React from "react";
import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import axios from "axios";
import styled from "styled-components";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { PostContext } from "../context/PostContext";

const Feed = () => {
  const { posts, setPosts } = useContext(PostContext);
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    fetch(`/posts/timeline/${currentUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        data.data &&
          setPosts(
            data.data.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
          );
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, []);
  console.log("Post after fetch Data:", posts);

  if (!posts) {
    return <p>loading...</p>;
  }

  return (
    <>
      <Wrapper>
        {posts?.map((post) => {
          return <Post key={post._id} post={post} />;
        })}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Feed;
