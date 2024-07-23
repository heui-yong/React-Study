import { useCallback, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import usePatch from "../hooks/usePatch";
import { useAppContext } from "../AppContext";
import MemoContentTopbar from "./MemoContentTopbar";
import MemoDetail from "./MemoDetail";

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

export default function MemoContent() {
  const { memoId } = useParams();
  const url = `http://localhost:3001/memo/${memoId}`;
  const { data, loading, error } = useFetch(url);
  const [content, setContent] = useState();
  const { patchContent, loading: patchLoading, error: patchError } = usePatch();
  const { triggerReloadMemoList } = useAppContext();

  const handleEditMemo = useCallback(
    (url) => {
      if (data.content !== content) {
        patchContent(url, content, (updatedData) => {
          console.log("Memo updated successfully : ", updatedData);
          triggerReloadMemoList();
        });
      }
    },
    [content, data.content, patchContent, triggerReloadMemoList]
  );

  const handleAddMemo = () => {
    console.log("addMemoBtnOnClick");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTextChange = useCallback((content) => {
    setContent(content);
  });

  if (loading || patchLoading) {
    return <div>Loading...</div>;
  }

  if (error || patchError) {
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
