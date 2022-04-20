import React, { useContext, useRef, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import Home from "./Home";
import SignIn from "./account/SignIn";
import Profile from "./Profile";
// import Register from "./account/Register";
import { CurrentUserContext } from "./context/CurrentUserContext";
import Header from "./Header";
import Messenger from "./messenger/Messenger";
import { SocketContext } from "./context/SocketContext";
import { io } from "socket.io-client";

const App = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const { setSocketCurrent } = useContext(SocketContext);

  const socket = useRef();
  socket.current = io("ws://localhost:8900");

  useEffect(() => {
    setSocketCurrent(socket.current);
  }, []);

  return (
    <>
      <BrowserRouter>
        <GlobalStyles />
        {currentUser && <Header />}
        <Switch>
          <Route exact path="/">
            {currentUser ? <Home /> : <SignIn />}
          </Route>

          <Route path="/signin">{currentUser ? <Home /> : <SignIn />}</Route>

          <Route path="/profile/:_id">
            {currentUser ? <Profile /> : <SignIn />}
          </Route>
          <Route path="/messenger">
            {currentUser ? <Messenger /> : <SignIn />}
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
