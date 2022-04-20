import styled from "styled-components";
import { useState, useContext } from "react";
import LikeButton from "./LikeButton";
import Action from "./Action";
import TweetActionIcon from "./TweetActionIcon";
import axios from "axios";
import { CurrentUserContext } from "./context/CurrentUserContext";

const ActionBar = ({ post }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const likeData = post.likes.includes(currentUser._id);
  //===TweetAction====
  const [isLiked, setIsLiked] = useState(likeData);
  const [numOfLikes, setNumOfLikes] = useState(post.likes.length);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [numOfRetweets, setNumOfRetweets] = useState(0);

  console.log("currentUserId:", currentUser._id);
  console.log("postId:", post._id);

  const handleToggleLike = async (ev) => {
    ev.preventDefault();

    const likeObject = {
      userId: currentUser._id,
    };

    try {
      const res = await axios.put(`/posts/${post._id}/like`, likeObject);
      console.log("res>>>>:", res);
      setNumOfLikes(res.data.data.value.likes.length);
    } catch (err) {
      console.log(err);
    }

    setIsLiked(!isLiked);
  };

  console.log("like:", isLiked);

  const handleToggleRetweet = () => {
    !isRetweeted
      ? setNumOfRetweets(numOfRetweets + 1)
      : setNumOfRetweets(numOfRetweets - 1);

    setIsRetweeted(!isRetweeted);
  };

  //=====TweetAction=====Upcoming Features commented below=====

  return (
    <Wrapper>
      {/* <ActionWrap>
        <Action color="rgb(27, 149, 224)" size={40}>
          <TweetActionIcon kind="reply" />
        </Action>
      </ActionWrap> */}
      {/* <ActionWrap>
        <Action
          color="rgb(23, 191, 99)"
          size={40}
          onClick={handleToggleRetweet}
        >
          <TweetActionIcon
            kind="retweet"
            color={isRetweeted ? "rgb(23, 191, 99)" : undefined}
          />
        </Action>
        <Retweets>{numOfRetweets}</Retweets>
      </ActionWrap> */}

      <ActionWrap>
        <Action color="rgb(224, 36, 94)" size={40} onClick={handleToggleLike}>
          <LikeButton isLiked={isLiked} />
        </Action>
        <Likes>{numOfLikes}</Likes>
      </ActionWrap>

      {/* <ActionWrap>
        <Action color="rgb(27, 149, 224)" size={40}>
          <TweetActionIcon kind="share" />
        </Action>
      </ActionWrap> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 48px;
`;

const ActionWrap = styled.div`
  display: flex;
`;
const Retweets = styled.span`
  margin: 12px 30px;
  font-weight: bold;
`;
const Likes = styled.span`
  margin: 12px 30px;
  font-weight: bold;
`;

export default ActionBar;
