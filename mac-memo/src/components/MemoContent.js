import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { StyledTopbar } from "../styles/Topbar";
import { formatDate } from "../utils/formatUtils";

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

const TimeContent = styled.div`
  color: rgb(125, 125, 125);
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const InputContent = styled.textarea`
  flex: 1; /* 나머지 공간을 차지하게 설정 */
  background-color: rgb(28, 28, 28);
  border: none;
  outline: none; /* 클릭 시 생기는 테두리 제거 */
  color: white;
  resize: none; /* 필요 시 사용자가 크기를 조정하지 못하게 설정 */
`;

export default function MemoContent() {
  const { memoId } = useParams();
  const url = `http://localhost:3001/memo/${memoId}`;
  const { data, loading, error } = useFetch(url);
  const [date, setDate] = useState();
  const [content, setContent] = useState();

  useEffect(() => {
    if (data) {
      const testdate = new Date(data.time);
      if (!isNaN(testdate)) {
        setDate(formatDate(testdate));
      } else {
        console.log("Invalid Date:", data.time);
      }

      setContent(data.content);
    }
  }, [data]);

  const handleTextChange = (event) => {
    setContent(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ContentMain>
      <StyledTopbar></StyledTopbar>
      <MainContent>
        <TimeContent>
          <span>{date}</span>
        </TimeContent>
        <InputContent value={content} onChange={handleTextChange} />
      </MainContent>
    </ContentMain>
  );
}
