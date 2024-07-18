import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContainer = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 500px;
  background-color: rgb(40, 30, 30);
`;

const PopupTitle = styled.div`
  color: white;
  font-size: 20px; /* 텍스트 크기 설정 */
  font-weight: bold; /* bold 처리 */
`;

const FolderName = styled.div`
  display: flex;
  align-items: center; /* 아이템을 수직으로 가운데 정렬 */
  margin-top: 25px;
  color: white;
  gap: 10px; /* span과 EditName 사이의 간격을 설정 */
`;

const EditName = styled.textarea`
  flex: 1; /* 남은 공간을 모두 차지하도록 설정 */
  height: 20px;
  background-color: rgb(50, 40, 40);
  margin-left: 5px;
  resize: none; /* 사용자가 크기를 조정할 수 없게 설정 */
  border-radius: 8px; /* 테두리 라운드 처리 */
  color: white; /* 텍스트 색상을 하얀색으로 설정 */
  line-height: 20px;

  /* 포커스 시 테두리 스타일 */
  &:focus {
    border: 4px solid rgb(145, 135, 50); /* 테두리 두께 및 색상 설정 */
    outline: none; /* 기본 포커스 아웃라인 제거 */
  }
`;

const SmartFolder = styled.div`
  display: flex;
  margin-top: 25px;
  border-bottom: 2px solid rgb(60, 50, 50);
  color: white;
  margin-bottom: 25px;
`;

const SmartFloderCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 15px; /* 너비 설정 */
  height: 15px; /* 높이 설정 */
  background: linear-gradient(
    to bottom,
    rgb(80, 70, 70),
    rgb(100, 90, 90)
  ); /* 배경색 설정 */
  border-radius: 20%; /* 둥근 테두리 설정 */
  appearance: none; /* 기본 체크박스 스타일 제거 */
  cursor: pointer; /* 포인터 커서 설정 */
  margin-right: 10px;

  /* 체크박스가 체크되었을 때의 스타일 */
  &:checked {
    background-color: darkgray; /* 체크된 상태의 배경색 설정 */
    border: 2px solid darkgray; /* 체크된 상태의 테두리 색상 */
  }

  /* 체크박스의 표시 */
  &:checked::before {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    background: white; /* 체크 표시를 위한 색상 */
    border-radius: 50%;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const SmartFolderText = styled.div`
  display: flex; /* Flexbox를 사용하여 레이아웃 설정 */
  flex-direction: column; /* 자식 요소들을 수직으로 정렬 */
  color: white; /* 텍스트 색상 설정 */
  margin-bottom: 25px;
`;

const SmartFolderDec = styled.span`
  color: rgb(155, 155, 155);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  width: 90px;
  height: 30px;
  background: ${(props) =>
    props.$primary ? "rgb(195,155,25)" : "rgb(90,85,85)"};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const AddFolderPopup = ({ onClose, onConfirm }) => {
  const editNameRef = useRef(null);
  const [folderName, setFolderName] = useState("새로운 폴더");

  useEffect(() => {
    if (editNameRef.current) {
      editNameRef.current.focus();
      editNameRef.current.select();
    }
  }, []);

  const handleTextChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleConfirm = () => {
    onConfirm(folderName);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <PopupOverlay>
      <PopupContainer>
        <PopupTitle>
          <span>새로운 폴더</span>
        </PopupTitle>
        <FolderName>
          <span>이름: </span>
          <EditName
            ref={editNameRef}
            value={folderName}
            onChange={handleTextChange}
            onKeyDown={handleKeyPress}
          ></EditName>
        </FolderName>
        <SmartFolder>
          <SmartFloderCheckbox />
          <SmartFolderText>
            <span>스마트 폴더로 만들기</span>
            <SmartFolderDec>태그 및 기타 필터를 사용하여 정리</SmartFolderDec>
          </SmartFolderText>
        </SmartFolder>
        <ButtonContainer>
          <Button onClick={onClose}>취소</Button>
          <Button $primary onClick={handleConfirm}>
            확인
          </Button>
        </ButtonContainer>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default AddFolderPopup;
