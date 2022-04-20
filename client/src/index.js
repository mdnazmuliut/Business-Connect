import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import UserProvider from "./components/context/UserContext";
import CurrentUserProvider from "./components/context/CurrentUserContext";
import PostProvider from "./components/context/PostContext";
import SocketProvider from "./components/context/SocketContext";

ReactDOM.render(
  <CurrentUserProvider>
    <SocketProvider>
      <PostProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </PostProvider>
    </SocketProvider>
  </CurrentUserProvider>,
  document.getElementById("root")
);
