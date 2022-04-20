import React, { useState, useContext } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { CurrentUserContext } from "../context/CurrentUserContext";
import signinPic from "../../assets/signinPic.jpg";

const SignIn = () => {
  let history = useHistory();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [errorMsg, setErrorMsg] = useState(false);

  const handleSubmit = (ev) => {
    ev.preventDefault();

    setErrorMsg(false);

    const inputValueEmail = ev.target[0].value;
    const inputValuePassword = ev.target[1].value;

    let dataObject = {
      email: inputValueEmail,
      password: inputValuePassword,
    };

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObject),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("SignIn Data:", data);
        data.data._id && setCurrentUser(data.data);
        if (data) {
          history.push("/");
        }
      })
      .catch((err) => {
        setErrorMsg(true);
        console.log("error:", err);
      });
  };

  return (
    <Container>
      <TitleWrap>
        <Title>Business Connect</Title>
      </TitleWrap>
      <Main>
        <TitlePicWrap>
          <WelcomeTitle>Welcome to CEOs Community</WelcomeTitle>
          <SigninPic src={signinPic} />
        </TitlePicWrap>
        <SigninWrapper>
          <SignInText>Sign In</SignInText>
          <SignInDiv onSubmit={handleSubmit}>
            <Input type="text" placeholder="Email"></Input>
            <Input type="password" placeholder="Password"></Input>
            <Button type="submit">Sign In</Button>
            {errorMsg && <ErrorDiv>Email and password don't match!</ErrorDiv>}
          </SignInDiv>
        </SigninWrapper>
      </Main>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  background-size: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ece7e7;
`;

const TitleWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  width: 300px;
  height: 80px;
  margin-top: 50px;
  padding: 15px;
  text-decoration: none;
  text-align: center;
  font-size: 32px;
  color: white;
  background-color: #0077b5;
  border-radius: 10px;
`;

const Main = styled.div`
  position: relative;
  display: flex;
  margin-top: 80px;
`;

const TitlePicWrap = styled.div`
  position: absolute;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WelcomeTitle = styled.div`
  color: black;
  font-size: 32px;
  font-weight: bold;
`;

const SigninPic = styled.img`
  margin-top: 50px;
  /* margin-left: 250px; */
  width: 650px;
  height: 550px;
  border-radius: 50%;
  border: 5px solid white;
`;

const SigninWrapper = styled.div`
  position: absolute;
  top: 130px;
  right: 350px;
  width: 350px;
  height: 300px;
  padding: 20px;
  background-color: rgba(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
`;

const SignInDiv = styled.form`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SignInText = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  color: black;
`;

const Input = styled.input`
  margin: 10px;
  font-size: 16px;
  width: 90%;
  height: 40px;
  border: 1px solid lightgrey;
  border-radius: 10px;
`;
const Button = styled.button`
  font-size: 24px;
  margin-top: 10px;
  padding: 2px;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 20px;
  color: white;
  background-color: #0077b5;
  cursor: pointer;
`;

const ErrorDiv = styled.div`
  margin-top: 10px;
  padding-top: 5px;
  text-align: center;
  color: #0077b5;
  width: 200px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.3);
`;

export default SignIn;
