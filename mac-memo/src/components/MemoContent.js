import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { StyledTopbar } from "../styles/Topbar";
import { formatDate } from "../utils/formatUtils";
import { IoCreateOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import usePatch from "../hooks/usePatch";

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

const TopButton = styled.div`
  width: 15px;
  height: 15px;
  background-color: transparent; // 배경색을 투명하게 설정
  border: none; // 테두리를 없앰
  color: rgb(150, 150, 150); // 텍스트 색상
  cursor: pointer; // 마우스 커서 변경
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px; // 필요에 따라 모서리 둥글게 설정
  padding: 10px;

  &:hover {
    color: #000000; // 호버 시 텍스트 색상 변경
    background-color: rgb(50, 40, 40);
  }

  &:focus {
    outline: none; // 포커스 시 아웃라인 제거
  }
`;

export default function MemoContent() {
  const { memoId } = useParams();
  const url = `http://localhost:3001/memo/${memoId}`;
  const { data, loading, error } = useFetch(url);
  const [date, setDate] = useState();
  const [content, setContent] = useState();
  const { patchContent, loading: patchLoading, error: patchError } = usePatch();

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

  const editBtnOnClick = () => {
    if (data.content !== content) {
      patchContent(url, content, (updatedData) => {
        console.log("Memo updated successfully : ", updatedData);
        const updatedDate = new Date(updatedData.time);
        if (!isNaN(updatedDate)) {
          setDate(formatDate(updatedDate));
        }
      });
    }
  };

  const addMemoBtnOnClick = () => {
    console.log("addMemoBtnOnClick");
  };

  if (loading || patchLoading) {
    return <div>Loading...</div>;
  }

  if (error || patchError) {
    return <div>Error: {error}</div>;
  }

  return (
    <ContentMain>
      <StyledTopbar>
        <TopButton onClick={addMemoBtnOnClick}>
          <IoCreateOutline />
        </TopButton>
        <TopButton onClick={editBtnOnClick}>
          <FaCheck />
        </TopButton>
      </StyledTopbar>
      <MainContent>
        <TimeContent>
          <span>{date}</span>
        </TimeContent>
        <InputContent value={content} onChange={handleTextChange} />
      </MainContent>
    </ContentMain>
  );
}
