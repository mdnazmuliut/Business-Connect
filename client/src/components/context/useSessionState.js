import { useState, useEffect } from "react";

const useSessionState = (defaultValue, key) => {
  const [value, setValue] = useState(
    () => JSON.parse(window.sessionStorage.getItem(key)) || defaultValue
  );

  useEffect(() => {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useSessionState;
