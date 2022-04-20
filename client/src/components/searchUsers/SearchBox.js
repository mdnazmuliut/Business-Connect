import React, { useState, useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../context/UserContext";
import Suggestion from "./Suggestion";

const SearchBox = ({ handleSelect }) => {
  const { users } = useContext(UserContext);

  const suggestions = users;

  const [inputValue, setValue] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  let matchedSuggestions = [];

  suggestions.forEach((user) => {
    let userTitleCaps = user.username.toUpperCase();

    if (userTitleCaps.indexOf(inputValue.toUpperCase()) != -1)
      matchedSuggestions.push({
        ...user,
        matchIndex: userTitleCaps.indexOf(inputValue.toUpperCase()),
      });
  });

  let keyboardHandle = (ev) => {
    switch (ev.key) {
      case "Enter": {
        handleSelect(matchedSuggestions[selectedSuggestionIndex].title);
        return;
      }
      case "ArrowUp": {
        if (selectedSuggestionIndex > 0)
          setSelectedSuggestionIndex(selectedSuggestionIndex - 1);
        return;
      }
      case "ArrowDown": {
        if (selectedSuggestionIndex < matchedSuggestions.length - 1)
          setSelectedSuggestionIndex(selectedSuggestionIndex + 1);
        return;
      }
    }
  };

  return (
    <>
      <Wrapper>
        <WrapperIn>
          <TopBar>
            <InputBox
              type="text"
              value={inputValue}
              placeholder={"Search..."}
              onChange={(ev) => setValue(ev.target.value)}
              onKeyDown={keyboardHandle}
            ></InputBox>
          </TopBar>

          <Suggestion
            inputValue={inputValue}
            matchedSuggestions={matchedSuggestions}
            handleSelect={handleSelect}
            selectedIndex={selectedSuggestionIndex}
            setSelected={setSelectedSuggestionIndex}
            setValue={setValue}
          />
        </WrapperIn>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrapperIn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: center;
  padding: 25px 0 20px;
`;
const InputBox = styled.input`
  width: 150px;
  height: 15px;
  padding: 10px;
  border: 1px solid #8b8585;
  border-radius: 5px;
  font-size: 20px;
`;

const BtnClear = styled.button`
  height: 50px;
  width: 100px;
  font-size: 20px;
  margin: 0 10px;
  color: white;
  background-color: blue;
  border-radius: 5px;
  border: none;
`;

export default SearchBox;
