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
import MemoContentTopbar from "./MemoContentTopbar";
import useCreateMemo from "../hooks/useCreateMemo";
import usePatch from "../hooks/usePatch";

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
  display: flex;
  flex-direction: column;
  border-right: 2px solid #000000; // 오른쪽에 수직선 추가
`;

const MemoListDiv1 = styled.div`
  flex: 1;
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

  const { deleteContent, error: deleteError } = useDelete();

  const { createMemo, error: createError } = useCreateMemo();

  const { state, updateState } = useAppContext();
  const { triggerReloadMemoList } = useAppContext();
  const [dataUpdated, setDataUpdated] = useState(false);

  const [content, setContent] = useState("");
  const { patchContent } = usePatch();

  const handleCreate = useCallback(() => {
    console.log("handleCreate");
    refetch();
  }, [refetch]);

  const handleDelete = useCallback(
    (url, navLink) => {
      deleteContent(url, () => {
        console.log("delete!");

        refetch();
        if (navLink) {
          console.log("navLink !== link!");
          setDataUpdated(false);
          setLink(navLink);
          refetch();
        }
      });
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

  const handleTextChange = useCallback((newContent) => {
    setContent(newContent);
    // 여기에 필요한 추가 로직 구현 (예: API 호출 등)
    console.log("newContent : ", newContent);
    setContent(newContent);
  }, []);

  const handleEditMemo = useCallback(
    (url) => {
      if (data.content !== content) {
        patchContent(url, content, (updatedData) => {
          console.log("Memo updated successfully : ", updatedData);
          window.scrollTo(0, 0);
          triggerReloadMemoList();
          refetch();
        });
      }
    },
    [content, data.content, patchContent, refetch, triggerReloadMemoList]
  );

  useEffect(() => {
    console.log("useEffect :: data = ", data);
    console.log("dataUpdated = ", dataUpdated);
    if (data.length !== 0 && !dataUpdated && data !== state.folderList) {
      console.log("data.length !== 0 && !dataUpdated :: data = ", data);
      updateState({ folderList: data });
      setDataUpdated(true);
    }

    if (link) {
      navigate(link, { replace: true });
      setLink(null);
    }
  }, [updateState, data, link, navigate, state.folderList, dataUpdated]);

  if (loading) {
    return <span>loading</span>;
  }

  if (error || deleteError || createError) {
    return <span>error {error}</span>;
  }

  return (
    <MainDiv>
      <FolderList data={data} onCreate={handleCreate} />
      <ContentDiv>
        <Routes>
          <Route
            path="/folder/:folderId"
            element={
              <>
                <MemoListDiv>
                  <MemoListTopbar onDelete={handleDelete} />
                  <MemoListDiv1>
                    <MemoList />
                  </MemoListDiv1>
                </MemoListDiv>
                <ContentMain>
                  <MemoContentTopbar onAddMemo={handleAddMemo} />
                  <MemoContent />
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
                  <MemoListDiv1>
                    <MemoList />
                  </MemoListDiv1>
                </MemoListDiv>
                <ContentMain>
                  <MemoContentTopbar
                    onAddMemo={handleAddMemo}
                    onEditMemo={handleEditMemo}
                  />
                  <MemoContent onTextChange={handleTextChange} />
                </ContentMain>
              </>
            }
          />
        </Routes>
      </ContentDiv>
    </MainDiv>
  );
}
