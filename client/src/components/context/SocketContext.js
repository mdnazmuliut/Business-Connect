import React, { useState } from "react";
import { createContext } from "react";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socketCurrent, setSocketCurrent] = useState(null);

  return (
    <SocketContext.Provider value={{ socketCurrent, setSocketCurrent }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
