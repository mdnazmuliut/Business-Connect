import React from "react";
import { useSpring, animated, config } from "react-spring";

const ScaleIn = ({ children }) => {
  const style = useSpring({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    transform: "scale(1)",
    from: {
      transform: "scale(0)",
    },
    config: {
      tension: 200,
      friction: 12,
    },
  });

  return <animated.div style={style}>{children}</animated.div>;
};

export default ScaleIn;
