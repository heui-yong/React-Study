import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useAppContext } from "../AppContext";
import { formatDateKo, formatFolderName } from "../utils/formatUtils";
import { useEffect } from "react";
import { useState } from "react";

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background-color: rgb(40, 30, 30);
`;

const MonthSection = styled.div`
  margin-bottom: 20px;
`;

const MonthTitle = styled.h2`
  color: white;
  margin-left: 20px;
`;

const GridMemoListDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const GridItemDiv = styled.div`
  padding: 20px;
  border-radius: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const GridMemoDiv = styled.div`
  height: 8rem;
  width: 11rem;
  display: flex;
  justify-content: space-between;
  background-color: rgb(28, 28, 28);
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-decoration: none;
  color: inherit;
  border-radius: 10px;
  border: 1px solid rgb(60, 60, 60);
  overflow: hidden;
  transition: border-color 0.3s ease;

  ${({ isSelected }) =>
    isSelected &&
    `
    border-color: rgb(160, 130, 40);
  `}
`;

const TitleTextDiv = styled.div`
  width: 11rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 10px;
`;

const DateTimeTextDiv = styled.div`
  color: white;
  font-size: 0.9em;
  margin-top: 2px;
  margin-bottom: 2px;
`;

const FolderTextDiv = styled.div`
  color: rgb(160, 150, 150);
  font-size: 0.9em;
`;

const ContentDiv = styled.div`
  color: rgb(126, 126, 126);
  font-size: 8px;
  font-weight: bold;
  overflow: hidden;
  display: -webkit-box;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 10px;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-wrap: break-word;
  max-height: 8rem; // Approximately 4 lines of text
`;

export default function MemoListGrid() {
  const { folderId } = useParams();
  const url =
    folderId === "1"
      ? `http://localhost:3001/memo`
      : `http://localhost:3001/memo?folder=${folderId}`;

  const { data, loading, error, refetch } = useFetch(url);
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [lastClickTime, setLastClickTime] = useState(0);
  const [selectedMemoId, setSelectedMemoId] = useState(null);

  useEffect(() => {
    refetch();
  }, [state.reloadMemoList, refetch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (data.length === 0) {
    return <span>메모 없음</span>;
  }

  const handleDoubleClick = (event, memoId) => {
    event.preventDefault();
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < 300) {
      // 300ms 이내의 클릭을 더블클릭으로 간주
      navigate(`/folder/${folderId}/grid/memo/${memoId}`);
    } else {
      // 단일 클릭일 경우 선택된 메모 ID를 업데이트
      setSelectedMemoId(memoId);
    }

    setLastClickTime(currentTime);
  };

  // 메모를 월별로 그룹화하고 각 그룹 내에서 날짜순으로 정렬
  const groupedMemos = data.reduce((acc, memo) => {
    const date = new Date(memo.time);
    const monthYear = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(memo);
    return acc;
  }, {});

  // 각 월 그룹 내에서 메모를 최신 순으로 정렬
  Object.keys(groupedMemos).forEach((month) => {
    groupedMemos[month].sort((a, b) => new Date(b.time) - new Date(a.time));
  });

  // 월별로 정렬 (최신 월이 먼저 오도록)
  const sortedMonths = Object.keys(groupedMemos).sort((a, b) => {
    const [yearA, monthA] = a.split("년 ");
    const [yearB, monthB] = b.split("년 ");
    return (
      new Date(yearB, parseInt(monthB) - 1) -
      new Date(yearA, parseInt(monthA) - 1)
    );
  });

  return (
    <MainContent>
      {sortedMonths.map((month) => (
        <MonthSection key={month}>
          <MonthTitle>{month}</MonthTitle>
          <GridMemoListDiv>
            {groupedMemos[month].map((memo) => (
              <GridItemDiv key={memo.id}>
                <GridMemoDiv
                  onClick={(e) => handleDoubleClick(e, memo.id)}
                  isSelected={selectedMemoId === memo.id}
                >
                  <ContentDiv>{memo.content}</ContentDiv>
                </GridMemoDiv>
                <TitleTextDiv>{memo.content}</TitleTextDiv>
                <DateTimeTextDiv>{formatDateKo(memo.time)}</DateTimeTextDiv>
                <FolderTextDiv>
                  {formatFolderName(state.folderList, memo.folder)}
                </FolderTextDiv>
              </GridItemDiv>
            ))}
          </GridMemoListDiv>
        </MonthSection>
      ))}
    </MainContent>
  );
}
