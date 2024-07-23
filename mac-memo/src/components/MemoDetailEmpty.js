import styled from "styled-components";
import { useState } from "react";

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

export default function MemoDetailEmpty({ onTextChange }) {
  const [date] = useState();
  const [content, setContent] = useState();

  const handleTextChange = (event) => {
    setContent(event.target.value);

    onTextChange(event.target.value);
  };

  return (
    <>
      <TimeContent>
        <span>{date}</span>
      </TimeContent>
      <InputContent value={content} onChange={handleTextChange} />
    </>
  );
}
