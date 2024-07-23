import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import FolderList from "./FolderList";
import { Routes, Route, useNavigate } from "react-router-dom";
import MemoList from "./MemoList";
import MemoContent from "./MemoContent";
import useDelete from "../hooks/uesDelete";
import MemoListTopbar from "./MemoListTopbar";
import useFetch from "../hooks/useFetch";
import { useAppContext } from "../AppContext";
import MemoContentEmpty from "./MemoContentEmpty";
import MemoContentTopbar from "./MemoContentTopbar";
import useCreateMemo from "../hooks/useCreateMemo";

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
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ContentMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column; /* 세로 방향으로 배치 */
  height: 100vh; /* 전체 뷰포트 높이 */
`;

export default function Main() {
  const { data, loading, error, refetch } = useFetch(
    "http://localhost:3001/folder"
  );
  const [link, setLink] = useState();
  const navigate = useNavigate();

  const {
    deleteContent,
    loading: deleteLoading,
    error: deleteError,
  } = useDelete();

  const {
    createMemo,
    loading: createLoading,
    error: createError,
  } = useCreateMemo();

  const { state, updateState } = useAppContext();
  const { triggerReloadMemoList } = useAppContext();
  const [dataUpdated, setDataUpdated] = useState(false);

  const handleDelete = useCallback(
    (url, link) => {
      if (window.confirm("정말로 이 폴더를 삭제하시겠습니까?")) {
        deleteContent(url, () => {
          console.log("delete!");
          setLink(link);
          refetch(); // 삭제 후 리스트를 다시 불러옵니다.
          setDataUpdated(false);
        });
      }
    },
    [deleteContent, refetch]
  );

  const handleAddMemo = useCallback(
    (folderId) => {
      console.log(folderId);
      const url = `http://localhost:3001/memo`;
      createMemo(url, folderId, (createData) => {
        console.log("create Memo!", createData);
        triggerReloadMemoList();
        setLink(`/folder/${createData.folder}/memo/${createData.id}`);
        refetch();
      });
    },
    [createMemo, refetch, triggerReloadMemoList]
  );

  useEffect(() => {
    if (data.length !== 0 && !dataUpdated) {
      updateState({ folderList: data });
      setDataUpdated(true);
    }

    if (link) {
      navigate(link, { replace: true });
      setLink(null);
    }
  }, [updateState, data, link, navigate, state.folderList, dataUpdated]);

  if (loading || deleteLoading || createLoading) {
    return <span>loading</span>;
  }

  if (error || deleteError || createError) {
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
                <ContentMain>
                  <MemoContentTopbar onAddMemo={handleAddMemo} />
                  <MemoContentEmpty />
                </ContentMain>
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
