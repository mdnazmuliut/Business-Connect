import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { CurrentUserContext } from "./context/CurrentUserContext";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useContext(CurrentUserContext);

  const [profile, setProfile] = useState(null);

  const history = useHistory();

  const handleId = useParams();

  console.log("HandleId:", handleId);

  const getUser = async () => {
    try {
      const res = await axios(`/users/${handleId._id}`);

      console.log("setProfile Data:", res.data.data);
      setProfile(res.data.data);
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(async () => {
    await getUser();
  }, [handleId._id]);

  console.log("Profile:", profile);

  let dataObject = {
    _id: currentUser._id, //Current user must be
  };

  let followers;
  const handleClickFollow = () => {
    fetch(`/users/${handleId._id}/follow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObject),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProfile({ ...profile, followers: data.data });
      });
  };

  const handleClickUnfollow = () => {
    fetch(`/users/${handleId._id}/unfollow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObject),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // this is the data we get after putting our data
        console.log(data);
        setProfile({ ...profile, followers: data.data });
      });
  };

  const handleCreateConversation = async () => {
    const conversationObject = {
      senderId: currentUser._id,
      receiverId: handleId._id,
    };

    try {
      const res = await axios.post("/conversations", conversationObject);
      await history.push("/messenger");
    } catch (err) {
      console.log(err);
    }
  };

  if (!profile) {
    return <p>loading...</p>;
  }

  return (
    <>
      <Wrapper>
        <AllDiv>
          <MainDiv>
            <CoverPic src={profile.coverPicture} />
            <ContentDiv>
              <ProfilePic src={profile.profilePicture} />
              <ProfileName>
                <FirstName>{profile.name.first}</FirstName>
                <LastName>{profile.name.last}</LastName>
              </ProfileName>
              <Headline>{profile.headline}</Headline>
              <ButtonWrap>
                {currentUser._id !== profile._id &&
                  (profile.followers.includes(currentUser._id) ? (
                    <>
                      <ButtonUnfollow onClick={handleClickUnfollow}>
                        Unfollow
                      </ButtonUnfollow>
                      <MessageBtn onClick={handleCreateConversation}>
                        Message
                      </MessageBtn>
                    </>
                  ) : (
                    <ButtonFollow onClick={handleClickFollow}>
                      Follow
                    </ButtonFollow>
                  ))}
              </ButtonWrap>
            </ContentDiv>
          </MainDiv>
          <About>
            <Caption>About</Caption>
            <Info>{profile.about}</Info>
          </About>
          <About>
            <Caption>Experience</Caption>
            <Info>{profile.experience}</Info>
          </About>
          <About>
            <Caption>Education</Caption>
            <Info>{profile.education}</Info>
          </About>
        </AllDiv>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const AllDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const MainDiv = styled.div`
  position: relative;
  margin: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
`;

const ContentDiv = styled.div`
  margin: 20px;
  padding: 20px;
  width: 50%;
  display: flex;
  flex-direction: column;
`;

const CoverPic = styled.img`
  width: 100%;
  height: 350px;
  border-radius: 10px;
`;

const ProfilePic = styled.img`
  position: absolute;
  top: 280px;
  left: 50px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid #fff;
`;

const ProfileName = styled.div`
  margin-top: 50px;
  margin-left: 10px;
  display: flex;
`;

const FirstName = styled.div`
  font-size: 24px;
  font-weight: bolder;
`;

const LastName = styled.div`
  margin-left: 10px;
  font-size: 24px;
  font-weight: bolder;
`;

const Headline = styled.div`
  margin-top: 10px;
  margin-left: 10px;
  font-size: 16px;
  font-weight: bold;
`;

const ButtonWrap = styled.div`
  display: flex;
`;

const MessageBtn = styled.button`
  margin-top: 30px;
  margin-left: 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: transparent;
  width: 100px;
  height: 40px;
  border-radius: 20px;
  border-color: 2px solid white;
  color: #8b8585;
  cursor: pointer;
`;

const ButtonFollow = styled.button`
  margin-top: 30px;
  margin-left: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #0077b5;
  width: 100px;
  height: 40px;
  border-radius: 20px;
  border-color: 5px solid white;
  cursor: pointer;
`;

const ButtonUnfollow = styled.button`
  margin-top: 30px;
  margin-left: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #8b8585;
  width: 100px;
  height: 40px;
  border-radius: 20px;
  border-color: 5px solid white;
  cursor: pointer;
`;

const About = styled.div`
  margin: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
`;

const Caption = styled.div`
  margin-left: 20px;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
`;

const Info = styled.div`
  margin-left: 10px;
  padding: 0 20px;
  font-size: 16px;
`;

export default Profile;
