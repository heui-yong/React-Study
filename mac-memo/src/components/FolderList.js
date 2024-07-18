import { React, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import AddFolderPopup from "./AddFolderPopup";
import FolderCount from "./FolderCount";

const FolderListUl = styled.ul`
  list-style-type: none;
  padding: 15px;
  margin: 0;
  width: 11.5rem;
  height: 100%;
  justify-content: center;
  background-color: rgb(35, 35, 35);
  border-right: 2px solid #000000; // 오른쪽에 수직선 추가
`;

const FolderItemLi = styled.li`
  margin-bottom: 10px;
`;

const FolderName = styled.span`
  color: white;
`;

const FolderLink = styled(NavLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  text-decoration: none;
  color: inherit;
  border-radius: 5px;

  &.active {
    background-color: rgb(160, 130, 40);
    color: white;
  }
`;

const AddButton = styled.button`
  background-color: transparent; // 배경색을 투명하게 설정
  border: 2px solid transparent; // 파란색 테두리
  color: rgb(150, 150, 150); // 텍스트 색상
  font-size: 16px; // 폰트 크기
  cursor: pointer; // 마우스 커서 변경
  border-radius: 5px; // 모서리를 둥글게
  position: fixed; // 버튼을 화면에 고정
  bottom: 20px; // 화면 하단에서 20px 위에 위치
  &:hover {
    color: white; // 호버 시 글자색 변경
  }
`;

export default function FolderList() {
  const { data, loading, error } = useFetch("http://localhost:3001/folder");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleConfirm = (newFolderName) => {
    console.log("Confirmed with folder name:", newFolderName);
    console.log(data.length);
    setIsPopupOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <FolderListUl>
      {data.map((folder) => (
        <FolderItemLi key={folder.id}>
          <FolderLink
            to={`/folder/${folder.id}`}
            state={{ folderName: folder.name }} // state를 전달합니다.
          >
            <FolderName>{folder.name}</FolderName>
            <FolderCount id={folder.id} />
          </FolderLink>
        </FolderItemLi>
      ))}
      <AddButton onClick={handleOpenPopup}>새로운 폴더</AddButton>
      {isPopupOpen && (
        <AddFolderPopup onClose={handleClosePopup} onConfirm={handleConfirm} />
      )}
    </FolderListUl>
  );
}
