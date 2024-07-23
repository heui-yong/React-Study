import { useParams } from "react-router-dom";
import styled from "styled-components";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { formatDate } from "../utils/formatUtils";

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

export default function MemoDetail({ onTextChange }) {
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
      }

      setContent(data.content);
    }
  }, [data]);

  const handleTextChange = (event) => {
    setContent(event.target.value);

    onTextChange(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <TimeContent>
        <span>{date}</span>
      </TimeContent>
      <InputContent value={content} onChange={handleTextChange} />
    </>
  );
}
