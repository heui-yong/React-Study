// AppContext.js
import React, { createContext, useState, useContext, useCallback } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    folderName: "",
    folderList: [],
    // 다른 상태들...
  });

  const updateState = useCallback((newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  return (
    <AppContext.Provider value={{ state, updateState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
