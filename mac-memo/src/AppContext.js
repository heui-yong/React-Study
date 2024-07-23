// AppContext.js
import React, { createContext, useState, useContext, useCallback } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    folderName: "",
    folderList: [],
    reloadMemoList: false,
    // 다른 상태들...
  });

  const updateState = useCallback((newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  // MemoList 리로드를 트리거하는 함수 추가
  const triggerReloadMemoList = useCallback(() => {
    updateState({ reloadMemoList: !state.reloadMemoList });
  }, [state.reloadMemoList, updateState]);

  return (
    <AppContext.Provider value={{ state, updateState, triggerReloadMemoList }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
