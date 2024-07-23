import { NavLink, useParams } from "react-router-dom";
import styled from "styled-components";
import useFetch from "../hooks/useFetch";
import { useAppContext } from "../AppContext";
import { sortByLatestTime } from "../utils/sortingUtils";
import { formatDateKo, formatFolderName } from "../utils/formatUtils";
import { useEffect } from "react";

const MemoListUl = styled.ul`
  list-style-type: none;
  padding: 10px;
  margin: 0;
  height: 100%;
  justify-content: center;
`;

const MemoItemLi = styled.li`
  margin-bottom: 10px;
`;

const MemoLink = styled(NavLink)`
  display: flex;
  justify-content: space-between;
  flex-direction: column; /* 세로 방향으로 배치 */
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: flex-start; /* 왼쪽 정렬 */
  text-decoration: none;
  color: inherit;
  border-radius: 5px;
  padding: 10px;
  padding-left: 30px;

  &.active {
    background-color: rgb(160, 130, 40);
    color: white;
  }
`;

const TitleTextDiv = styled.div`
  width: 100px; /* 원하는 너비 설정 */
  white-space: nowrap; /* 텍스트 줄 바꿈을 방지합니다. */
  overflow: hidden; /* 넘치는 부분을 숨깁니다. */
  text-overflow: ellipsis; /* 넘치는 텍스트에 줄임표를 추가합니다. */
  color: white;
  font-size: 1.1em;
  font-weight: bold;
`;

const DateTimeTextDiv = styled.div`
  color: white;
  font-size: 0.9em; /* 날짜 텍스트의 폰트 크기 설정 */
  margin-top: 2px;
  margin-bottom: 2px;
`;

const FolderTextDiv = styled.div`
  color: rgb(160, 150, 150);
  font-size: 0.9em; /* 날짜 텍스트의 폰트 크기 설정 */
`;

export default function MemoList() {
  const { folderId } = useParams();
  const url =
    folderId === "1"
      ? `http://localhost:3001/memo`
      : `http://localhost:3001/memo?folder=${folderId}`;

  const { data, loading, error, refetch } = useFetch(url);
  const { state } = useAppContext();

  useEffect(() => {
    refetch();
  }, [state.reloadMemoList, refetch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (data.length === 0) {
    return <span>메모 없음</span>;
  }

  return (
    <>
      <MemoListUl>
        {sortByLatestTime(data).map((memo) => (
          <MemoItemLi key={memo.id}>
            <MemoLink to={`/folder/${folderId}/memo/${memo.id}`}>
              <TitleTextDiv>{memo.content}</TitleTextDiv>
              <DateTimeTextDiv>{formatDateKo(memo.time)}</DateTimeTextDiv>
              <FolderTextDiv>
                {formatFolderName(state.folderList, memo.folder)}
              </FolderTextDiv>
            </MemoLink>
          </MemoItemLi>
        ))}
      </MemoListUl>
    </>
  );
}
