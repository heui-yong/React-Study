import styled from "styled-components";
import { StyledTopbar } from "../styles/Topbar";
import { IoCreateOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { useParams } from "react-router-dom";

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

export default function MemoContentTopbar({ onAddMemo, onEditMemo }) {
  const { memoId, folderId } = useParams();

  const handleAddMemo = (folderId) => {
    onAddMemo(folderId);
  };

  const handleEditMemo = (url) => {
    onEditMemo(url);
  };

  const editBtnOnClick = () => {
    console.log("editBtnOnClick, ", memoId);
    if (memoId) {
      handleEditMemo(`http://localhost:3001/memo/${memoId}`);
    }
  };

  const addMemoBtnOnClick = () => {
    console.log("addMemoBtnOnClick");
    handleAddMemo(folderId);
  };

  return (
    <>
      <StyledTopbar>
        <TopButton onClick={addMemoBtnOnClick}>
          <IoCreateOutline />
        </TopButton>
        <TopButton onClick={editBtnOnClick}>
          <FaCheck />
        </TopButton>
      </StyledTopbar>
    </>
  );
}
