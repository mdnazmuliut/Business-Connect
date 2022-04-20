import React, { useContext, createContext, useState } from "react";
import { CurrentUserContext } from "./CurrentUserContext";

export const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;
