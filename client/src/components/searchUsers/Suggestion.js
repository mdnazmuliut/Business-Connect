import React from "react";
import styled from "styled-components";

const Suggestion = ({
  inputValue,
  matchedSuggestions,
  handleSelect,
  selectedIndex,
  setSelected,
  setValue,
}) => {
  // if the input value is more than 2 characters and there is at least one match, return the match, else return null
  return inputValue.length > 1 && matchedSuggestions.length > 0 ? (
    <SuggestionBox>
      <ul>
        {matchedSuggestions.map((user, index) => {
          let firstHalf = user.username.slice(
            0,
            user.matchIndex + inputValue.length
          );
          let secondHalf = user.username.slice(
            user.matchIndex + inputValue.length
          );

          const isSelected = selectedIndex === matchedSuggestions.indexOf(user);

          return (
            <SuggestionTitle
              key={user._id}
              style={{
                background: isSelected
                  ? "hsla(50deg, 100%, 80%, 0.25)"
                  : "transparent",
              }}
              onClick={() => {
                handleSelect(user._id);
                setValue("");
              }}
              onMouseEnter={() => setSelected(index)}
            >
              <Avatar src={user.profilePicture} />
              <UserName>
                {firstHalf}
                <BoldSpan>{secondHalf}</BoldSpan>
              </UserName>
            </SuggestionTitle>
          );
        })}
      </ul>
      <BtnClear onClick={() => setValue("")}>Clear</BtnClear>
    </SuggestionBox>
  ) : null;
};

const SuggestionBox = styled.div`
  width: 180px;
  box-shadow: 0px 2px 6px 1px rgba(0, 0, 0, 0.2);
  background-color: white;
  border-radius: 10px;
  z-index: 1;
`;

const SuggestionTitle = styled.li`
  display: flex;
  font-size: 18px;
  padding: 15px;
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const UserName = styled.span`
  margin: 15px;
  font-weight: 700;
`;

const BoldSpan = styled.span`
  font-weight: 700;
`;

const BtnClear = styled.button`
  height: 30px;
  width: 60px;
  font-size: 16px;
  margin: 10px 60px;
  color: #8b8585;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: lightgrey;
    color: black;
    border-radius: 10px;
  }
`;

export default Suggestion;
