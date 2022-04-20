import React from "react";
import Feed from "./feed/Feed";
import styled from "styled-components";
import PostInput from "./post/postInput";

const Home = () => {
  return (
    <>
      <Wrapper>
        <PostInput />
        <Feed />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Home;
