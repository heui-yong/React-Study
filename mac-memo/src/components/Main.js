import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import FolderList from "./FolderList";
import { Routes, Route } from "react-router-dom";
import MemoList from "./MemoList";
import MemoContent from "./MemoContent";
import useDelete from "../hooks/uesDelete";
import MemoListTopbar from "./MemoListTopbar";
import useFetch from "../hooks/useFetch";
import { useAppContext } from "../AppContext";

const MainDiv = styled.div`
  display: flex;
  height: 100vh;
  background-color: rgb(40, 30, 30);
`;

const ContentDiv = styled.div`
  flex: 1;
  display: flex;
`;

const MemoListDiv = styled.div`
  height: 100%;
  width: 13rem;
  border-right: 2px solid #000000; // 오른쪽에 수직선 추가
`;

export default function Main() {
  const { data, loading, error, refetch } = useFetch(
    "http://localhost:3001/folder"
  );

  const {
    deleteContent,
    loading: deleteLoading,
    error: deleteError,
  } = useDelete();

  const { updateState } = useAppContext();

  const handleDelete = useCallback(
    (url) => {
      if (window.confirm("정말로 이 폴더를 삭제하시겠습니까?")) {
        deleteContent(url, () => {
          console.log("delete!");
          refetch(); // 삭제 후 리스트를 다시 불러옵니다.
        });
      }
    },
    [deleteContent, refetch]
  );

  useEffect(() => {
    updateState({ folderList: data });
    console.log("updateState({ folderList: data });");
  }, [updateState, data]);

  if (loading || deleteLoading) {
    return <span>loading</span>;
  }

  if (error || deleteError) {
    return <span>error {error}</span>;
  }

  return (
    <MainDiv>
      <FolderList />
      <ContentDiv>
        <Routes>
          <Route
            path="/folder/:folderId"
            element={
              <>
                <MemoListDiv>
                  <MemoListTopbar onDelete={handleDelete} />
                  <MemoList />
                </MemoListDiv>
              </>
            }
          />
          <Route
            path="/folder/:folderId/memo/:memoId"
            element={
              <>
                <MemoListDiv>
                  <MemoListTopbar onDelete={handleDelete} />
                  <MemoList />
                </MemoListDiv>
                <MemoContent />
              </>
            }
          />
        </Routes>
      </ContentDiv>
    </MainDiv>
  );
}
