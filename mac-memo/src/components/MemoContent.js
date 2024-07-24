import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import usePatch from "../hooks/usePatch";
import { useAppContext } from "../AppContext";
import MemoContentTopbar from "./MemoContentTopbar";
import MemoDetail from "./MemoDetail";
import useCreateMemo from "../hooks/useCreateMemo";

const ContentMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column; /* 세로 방향으로 배치 */
  height: 100vh; /* 전체 뷰포트 높이 */
`;

const MainContent = styled.div`
  flex: 1; /* 나머지 공간을 차지하게 설정 */
  display: flex;
  overflow: auto; /* 내용이 넘칠 때 스크롤 */
  flex-direction: column;
  background-color: rgb(28, 28, 28);
`;

export default function MemoContent(onAddMemo) {
  const { memoId } = useParams();
  const url = `http://localhost:3001/memo/${memoId}`;
  const { data, loading, error, refetch } = useFetch(url);
  const [content, setContent] = useState();
  const { patchContent } = usePatch();
  const { triggerReloadMemoList } = useAppContext();
  const { createMemo } = useCreateMemo();
  const [link, setLink] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (link) {
      navigate(link, { replace: true });
      setLink(null);
    }
  }, [link, navigate]);

  const handleEditMemo = useCallback(
    (url) => {
      if (data.content !== content) {
        patchContent(url, content, (updatedData) => {
          console.log("Memo updated successfully : ", updatedData);
          window.scrollTo(0, 0);
          triggerReloadMemoList();
        });
      }
    },
    [content, data.content, patchContent, triggerReloadMemoList]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAddMemo = useCallback((folderId) => {
    console.log("folderId : ", folderId);
    const url = `http://localhost:3001/memo`;
    createMemo(url, folderId, (createData) => {
      console.log("create Memo!", createData);
      triggerReloadMemoList();
      setLink(`/folder/${createData.folder}/memo/${createData.id}`);
      refetch();
    });
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTextChange = useCallback((content) => {
    setContent(content);
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ContentMain>
      <MemoContentTopbar
        onAddMemo={handleAddMemo}
        onEditMemo={handleEditMemo}
      />
      <MainContent>
        <MemoDetail onTextChange={handleTextChange} />
      </MainContent>
    </ContentMain>
  );
}
