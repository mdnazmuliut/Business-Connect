import { createContext, useEffect, useState, useReducer } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]); // shoul use [] instead null if object  {}
  const [success, setSuccess] = useState(true);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("All Users-data:", data.data);
        setUsers(data.data);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        status,
        setUsers,
        setStatus,
        success,
        setSuccess,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
