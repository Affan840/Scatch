// OwnerContext.js
import { createContext, useContext, useState } from "react";

// Creating the context with default values (empty data)
export const OwnerContext = createContext({
  ownerData: null,
  setOwner: () => {},
});

// Hook to use the context
  export const useOwner = () => {
  return useContext(OwnerContext);
};

// OwnerProvider component to wrap around components needing the context
export const OwnerProvider = ({ children }) => {
  const [ownerData, setOwnerData] = useState(null);

  const setOwner = (owner) => {
    setOwnerData(owner);
  };

  return (
    <OwnerContext.Provider value={{ ownerData, setOwner }}>
      {children}
    </OwnerContext.Provider>
  );
};
