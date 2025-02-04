import styled from "styled-components";
import MemoDetail from "./MemoDetail";
import { useParams } from "react-router-dom";

const MainContent = styled.div`
  flex: 1; /* 나머지 공간을 차지하게 설정 */
  display: flex;
  overflow: auto; /* 내용이 넘칠 때 스크롤 */
  flex-direction: column;
  background-color: rgb(28, 28, 28);
`;

export default function MemoContent({ onTextChange }) {
  const { memoId } = useParams();

  return (
    <MainContent>
      {memoId && <MemoDetail onTextChange={onTextChange} />}
    </MainContent>
  );
}
