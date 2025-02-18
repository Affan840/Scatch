import { useState, createContext, useContext, useMemo } from "react";

export const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const setUser = (user) => {
    setUserData(user);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ userData, setUser }), [userData]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
