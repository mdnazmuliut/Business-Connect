import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { CurrentUserContext } from "./context/CurrentUserContext";
import { CgLogOff } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import logo from "../assets/logo.png";
import SearchBox from "./searchUsers/SearchBox";

const Header = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const history = useHistory();

  const handleSignOut = () => {
    setCurrentUser(null);
    history.push("/signin");
  };

  const handleSelect = (suggestion) => {
    history.push(`/profile/${suggestion}`);
  };

  return (
    <Wrapper>
      <SearchWrap>
        <Title to={"/"}>
          <Logo src={logo} />
        </Title>
        <SearchBox handleSelect={handleSelect} />
      </SearchWrap>

      <RightSec>
        <HomeNavWrap exact activeClassName="active" to={"/"}>
          <HomeNav>
            <FaHome />
          </HomeNav>
          <HomeTxt>Home</HomeTxt>
        </HomeNavWrap>
        <MessengerNav activeClassName="active" to={"/messenger"}>
          <MessengerNavIcon>
            <RiMessage2Fill />
          </MessengerNavIcon>
          <MessengerTxt>Message</MessengerTxt>
        </MessengerNav>
        {currentUser ? (
          <>
            <GreetingAvatar>
              <UserImg src={currentUser.profilePicture} />
              <Greeting to={`/profile/${currentUser._id}`}>
                {currentUser.username}
              </Greeting>
            </GreetingAvatar>
          </>
        ) : (
          <SignIn to={"/signin"}>Sign In</SignIn>
        )}
        {currentUser && (
          <SignOut onClick={handleSignOut}>
            <CgLogOff />
          </SignOut>
        )}
      </RightSec>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 80px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  justify-content: space-between;
`;

const SearchWrap = styled.div`
  display: flex;
  margin-left: 20px;
`;

const RightSec = styled.div`
  display: flex;
  margin-right: 50px;
  color: #8b8585;
  .active {
    color: #0077b5;
  }
`;

const HomeNavWrap = styled(NavLink)`
  margin: 15px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #8b8585;
`;

const HomeNav = styled.div`
  font-size: 30px;
`;

const HomeTxt = styled.div`
  font-size: 20px;
  margin-top: 1px;
  font-weight: bold;
  text-decoration: none;
`;

const MessengerNav = styled(NavLink)`
  margin-top: 15px;
  margin-left: 60px;
  margin-right: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #8b8585;
`;

const MessengerNavIcon = styled.div`
  font-size: 30px;
`;

const MessengerTxt = styled.div`
  font-size: 20px;
  margin-top: 1px;
  font-weight: bold;
  text-decoration: none;
`;

const GreetingAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5px;
  margin-right: 120px;
  width: 80px;
`;

const UserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Greeting = styled(NavLink)`
  margin-top: 2px;
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
  color: #8b8585;
`;

const Title = styled(NavLink)`
  width: 200px;
  height: 50px;
  margin-top: 5px;
  margin-left: 160px;
  margin-right: 100px;
  padding: 15px;
  text-decoration: none;
  text-align: center;
  font-size: 20px;
  color: white;
  border-radius: 10px;
`;

const Logo = styled.img`
  width: 250px;
  border-radius: 10px;
`;

const SignIn = styled(NavLink)`
  margin-top: 15px;
  margin-right: 200px;
  padding: 15px;
  font-size: 18px;
  text-align: center;
  text-decoration: none;
  width: 100px;
  height: 50px;
  background-color: #0077b5;
  color: white;
  border-radius: 10px;
  cursor: pointer;
`;

const SignOut = styled.div`
  margin-top: 15px;
  margin-right: 250px;
  padding: 15px;
  font-size: 20px;
  text-align: center;
  width: 50px;
  height: 50px;
  background-color: #0077b5;
  color: white;
  border-radius: 10px;
  cursor: pointer;
`;

export default Header;
