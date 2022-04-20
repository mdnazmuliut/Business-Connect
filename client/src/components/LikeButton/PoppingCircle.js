import React from "react";
import styled, { keyframes } from "styled-components";

const PoppingCircle = ({ size, color }) => {
  return (
    <Wrapper
      style={{ width: size, height: size, backgroundColor: color }}
    ></Wrapper>
  );
};

const scale = keyframes`
  from {
    transform: scale(0);
}
to {
    transform: scale(1);
  }
`;
const fade = keyframes`
  from {
    opacity: 1;
}
to {
    opacity: 0;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  border-radius: 50%;
  animation: ${scale} 300ms forwards, ${fade} 500ms forwards;
`;

export default PoppingCircle;
