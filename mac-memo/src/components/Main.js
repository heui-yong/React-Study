import React from "react";
import styled from "styled-components";
import FolderList from "./FolderList";
import { Routes, Route } from "react-router-dom";
import MemoList from "./MemoList";
import MemoContent from "./MemoContent";

const MainDiv = styled.div`
  display: flex;
  height: 100vh;
  background-color: rgb(40, 30, 30);
`;

const ContentDiv = styled.div`
  flex: 1;
  display: flex;
`;

export default function Main() {
  return (
    <MainDiv>
      <FolderList />
      <ContentDiv>
        <Routes>
          <Route path="/folder/:folderId" element={<MemoList />} />
          <Route
            path="/folder/:folderId/memo/:memoId"
            element={
              <>
                <MemoList />
                <MemoContent />
              </>
            }
          />
        </Routes>
      </ContentDiv>
    </MainDiv>
  );
}
